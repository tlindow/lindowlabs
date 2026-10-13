#!/usr/bin/env node
/**
 * Playwright visual QA (LL-86).
 *
 * Builds are external (npm run build:static). This script serves site/out (or
 * --url), opens every public route at 1440 / 1024 / 375, plus homepage after
 * hero audio ends, and fails on:
 *   - console errors / page errors
 *   - key block overlaps (credentials vs About, dock vs badge, content over nav)
 *   - too many of the same primary CTA
 *   - button/link text below WCAG AA contrast
 *
 * Usage:
 *   node scripts/check-visual-qa.mjs
 *   node scripts/check-visual-qa.mjs --url http://127.0.0.1:3000
 *   node scripts/check-visual-qa.mjs --out ./visual-qa-output
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import {
  routes,
  viewports,
  primaryButtons,
} from "../visual-qa.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const outDirDefault = path.join(siteRoot, "out");

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : null;
  };
  return {
    url: get("--url"),
    out: get("--out") || path.join(siteRoot, "visual-qa-output"),
  };
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return (
    {
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".css": "text/css; charset=utf-8",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".ico": "image/x-icon",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".txt": "text/plain; charset=utf-8",
    }[ext] || "application/octet-stream"
  );
}

function startStaticServer(staticRoot) {
  if (!fs.existsSync(staticRoot)) {
    throw new Error(`Missing ${staticRoot}. Run npm run build:static first.`);
  }

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let rel = urlPath === "/" ? "/index.html" : urlPath;
    let filePath = path.join(staticRoot, rel);

    if (!filePath.startsWith(staticRoot)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (!fs.existsSync(filePath)) {
      const htmlAlt = path.join(staticRoot, `${rel.replace(/\/$/, "")}.html`);
      const indexAlt = path.join(
        staticRoot,
        rel.replace(/\/$/, ""),
        "index.html"
      );
      if (fs.existsSync(htmlAlt)) filePath = htmlAlt;
      else if (fs.existsSync(indexAlt)) filePath = indexAlt;
    }

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType(filePath) });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve, reject) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
    server.on("error", reject);
  });
}

function slugifyRoute(route) {
  if (route === "/") return "home";
  return route.replace(/^\//, "").replace(/\//g, "__");
}

function routeUrl(baseUrl, route) {
  if (route === "/") return `${baseUrl}/`;
  return `${baseUrl}${route}`;
}

const IGNORED_CONSOLE = [
  /Download the React DevTools/i,
  // Static export / local serve: analytics, click API, and optional pings 404.
  /Failed to load resource:/i,
  /net::ERR_/i,
  /CDN.*clarity/i,
  /Allow attribute will take precedence/i,
  /\/_vercel\//i,
  /\/api\/clicks/i,
  /tinker\.beginner\.work/i,
];

function shouldIgnoreConsole(text) {
  return IGNORED_CONSOLE.some((re) => re.test(text));
}

/** Same-origin JS/CSS 404s still fail the check (broken build). */
function isCriticalAssetUrl(url, baseUrl) {
  try {
    const u = new URL(url);
    const base = new URL(baseUrl);
    if (u.origin !== base.origin) return false;
    if (u.pathname.startsWith("/api/")) return false;
    if (u.pathname.startsWith("/_vercel/")) return false;
    return /\.(js|css)$/i.test(u.pathname);
  } catch {
    return false;
  }
}

async function collectPageFindings(page, { afterAudio = false } = {}) {
  return page.evaluate(
    ({ primaryButtons: buttons, afterAudio: audioDone }) => {
      const findings = [];

      function visible(el) {
        if (!(el instanceof Element)) return false;
        const style = window.getComputedStyle(el);
        if (
          style.display === "none" ||
          style.visibility === "hidden" ||
          Number(style.opacity) < 0.05
        ) {
          return false;
        }
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      }

      function textOf(el) {
        return (el.innerText || el.textContent || "")
          .replace(/\s+/g, " ")
          .trim();
      }

      function rectsOverlap(a, b, pad = 1) {
        return !(
          a.right <= b.left + pad ||
          a.left >= b.right - pad ||
          a.bottom <= b.top + pad ||
          a.top >= b.bottom - pad
        );
      }

      function parseColor(input) {
        if (!input || input === "transparent") return null;
        const s = input.trim();
        const m = s.match(
          /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i
        );
        if (m) {
          const a = m[4] === undefined ? 1 : Number(m[4]);
          if (a <= 0) return null;
          return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a };
        }
        const modern = s.match(
          /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i
        );
        if (modern) {
          const a = modern[4] === undefined ? 1 : Number(modern[4]);
          if (a <= 0) return null;
          return {
            r: Number(modern[1]),
            g: Number(modern[2]),
            b: Number(modern[3]),
            a,
          };
        }
        return null;
      }

      function channel(c) {
        const v = c / 255;
        return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      }

      function lum({ r, g, b }) {
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      }

      function ratio(fg, bg) {
        const L1 = lum(fg);
        const L2 = lum(bg);
        const lighter = Math.max(L1, L2);
        const darker = Math.min(L1, L2);
        return (lighter + 0.05) / (darker + 0.05);
      }

      function blend(fg, bg) {
        const a = fg.a ?? 1;
        if (a >= 1) return { r: fg.r, g: fg.g, b: fg.b };
        return {
          r: fg.r * a + bg.r * (1 - a),
          g: fg.g * a + bg.g * (1 - a),
          b: fg.b * a + bg.b * (1 - a),
        };
      }

      function effectiveBackground(el) {
        let node = el;
        let acc = null;
        while (node && node !== document.documentElement) {
          const bg = parseColor(getComputedStyle(node).backgroundColor);
          if (bg) {
            acc = acc ? blend(acc, bg) : { r: bg.r, g: bg.g, b: bg.b };
            if ((bg.a ?? 1) >= 0.99) return acc;
          }
          node = node.parentElement;
        }
        const root = parseColor(
          getComputedStyle(document.body).backgroundColor
        ) || { r: 255, g: 255, b: 255, a: 1 };
        return acc ? blend(acc, root) : { r: root.r, g: root.g, b: root.b };
      }

      // --- Primary CTA duplicates ---
      const clickable = [
        ...document.querySelectorAll("a, button, [role='button']"),
      ].filter(visible);

      for (const { label, max } of buttons) {
        const matches = clickable.filter((el) => {
          const t = textOf(el);
          const aria = (el.getAttribute("aria-label") || "").trim();
          const title = (el.getAttribute("title") || "").trim();
          return t === label || aria === label || title === label;
        });
        if (matches.length > max) {
          findings.push({
            type: "duplicate-cta",
            message: `Found ${matches.length} visible "${label}" (max ${max})`,
          });
        }
      }

      // --- Key block overlaps ---
      const pairs = [
        ["#trusted-partners", "#about", "credentials vs About"],
        [
          '[data-page-audio="bottom-dock"]',
          ".calendly-badge-widget",
          "bottom audio dock vs Calendly badge",
        ],
      ];
      for (const [selA, selB, label] of pairs) {
        const a = document.querySelector(selA);
        const b = document.querySelector(selB);
        if (!a || !b || !visible(a) || !visible(b)) continue;
        const ra = a.getBoundingClientRect();
        const rb = b.getBoundingClientRect();
        if (rectsOverlap(ra, rb, 2)) {
          findings.push({
            type: "overlap",
            message: `Overlapping blocks: ${label}`,
          });
        }
      }

      // Content must pass under sticky nav (not paint over it).
      const nav = document.querySelector("header.sticky");
      if (nav && visible(nav)) {
        const navRect = nav.getBoundingClientRect();
        const navZ = parseInt(getComputedStyle(nav).zIndex, 10) || 50;
        const allowOverNav = (el) =>
          Boolean(
            el.closest(
              '[data-profile-photo], [data-page-audio="morph-play"], [data-page-audio="hero-play"], [data-visual-qa-allow-over-nav]'
            )
          );
        for (const el of document.body.querySelectorAll("*")) {
          if (nav.contains(el) || !visible(el) || allowOverNav(el)) continue;
          const style = getComputedStyle(el);
          if (style.position !== "fixed" && style.position !== "sticky") {
            continue;
          }
          const r = el.getBoundingClientRect();
          if (r.width < 8 || r.height < 8) continue;
          if (!rectsOverlap(r, navRect, 0)) continue;
          const z = parseInt(style.zIndex, 10);
          if (Number.isNaN(z) || z < navZ) continue;
          findings.push({
            type: "overlap",
            message: `Content paints over sticky nav: ${el.tagName.toLowerCase()}${
              el.id ? `#${el.id}` : ""
            }${
              el.getAttribute("data-page-audio")
                ? `[data-page-audio="${el.getAttribute("data-page-audio")}"]`
                : ""
            } (z-index ${z})`,
          });
          break;
        }
      }

      // --- WCAG AA contrast on visible buttons/links with text ---
      for (const el of clickable) {
        const t = textOf(el);
        if (!t || t.length > 80) continue;
        const style = getComputedStyle(el);
        const fg = parseColor(style.color);
        if (!fg) continue;
        const bg = effectiveBackground(el);
        const solidFg = blend(fg, bg);
        const cr = ratio(solidFg, bg);
        const fontSizePx = parseFloat(style.fontSize) || 14;
        const fontWeight = parseInt(style.fontWeight, 10) || 400;
        const large =
          fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
        const min = large ? 3 : 4.5;
        if (cr < min) {
          findings.push({
            type: "contrast",
            message: `Contrast ${cr.toFixed(2)}:1 < AA ${min}:1 for "${t.slice(
              0,
              48
            )}"`,
          });
        }
      }

      // Surface audio-end state for debugging in the report.
      if (audioDone) {
        findings.push({
          type: "meta",
          message: `playbackEnded probe: ${Boolean(
            document.querySelector('[data-hero-audio-end], [data-page-audio="bottom-dock"]')
          )}`,
        });
      }

      return findings.filter((f) => f.type !== "meta");
    },
    { primaryButtons, afterAudio }
  );
}

async function forceHeroAudioEnded(page) {
  await page.evaluate(async () => {
    const audio = document.querySelector("audio");
    if (!audio) return;
    try {
      if (audio.readyState < 1) {
        await new Promise((resolve) => {
          audio.addEventListener("loadedmetadata", resolve, { once: true });
          audio.load();
          setTimeout(resolve, 2000);
        });
      }
      const dur =
        Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : 1;
      audio.currentTime = Math.max(0, dur - 0.05);
      audio.dispatchEvent(new Event("ended"));
      audio.pause();
    } catch {
      audio.dispatchEvent(new Event("ended"));
    }
  });
  // Let React state settle after ended.
  await new Promise((r) => setTimeout(r, 400));
}

async function main() {
  const { url: urlFlag, out: outputRoot } = parseArgs();
  fs.mkdirSync(outputRoot, { recursive: true });
  const shotsDir = path.join(outputRoot, "screenshots");
  fs.mkdirSync(shotsDir, { recursive: true });

  let server = null;
  let baseUrl = urlFlag;
  if (!baseUrl) {
    const started = await startStaticServer(outDirDefault);
    server = started.server;
    baseUrl = started.baseUrl;
  }

  const browser = await chromium.launch({ headless: true });
  const failures = [];
  const results = [];

  console.log(`Visual QA: ${routes.length} routes × ${viewports.length} viewports`);
  console.log(`Routes: ${routes.join(", ")}`);
  console.log(`Primary CTAs: ${primaryButtons.map((b) => `${b.label} (max ${b.max})`).join("; ")}`);

  try {
    for (const route of routes) {
      for (const vp of viewports) {
        const label = `${slugifyRoute(route)}-${vp.width}`;
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
        });
        const page = await context.newPage();
        const consoleErrors = [];

        page.on("console", (msg) => {
          if (msg.type() !== "error") return;
          const text = msg.text();
          if (shouldIgnoreConsole(text)) return;
          consoleErrors.push(text);
        });
        page.on("pageerror", (err) => {
          const text = String(err?.message || err);
          if (shouldIgnoreConsole(text)) return;
          consoleErrors.push(text);
        });
        page.on("response", (res) => {
          if (res.status() !== 404) return;
          if (!isCriticalAssetUrl(res.url(), baseUrl)) return;
          consoleErrors.push(`Critical asset 404: ${res.url()}`);
        });

        const target = routeUrl(baseUrl, route);
        const response = await page.goto(target, {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        if (!response || !response.ok()) {
          failures.push({
            label,
            route,
            viewport: vp.width,
            message: `HTTP ${response ? response.status() : "no response"} for ${target}`,
          });
        }

        // Allow layout effects (hero overflow spacer) to settle.
        await new Promise((r) => setTimeout(r, 500));

        const shotPath = path.join(shotsDir, `${label}.png`);
        await page.screenshot({ path: shotPath, fullPage: true });

        const findings = await collectPageFindings(page, { afterAudio: false });
        for (const err of consoleErrors) {
          findings.push({ type: "console", message: err });
        }

        const caseFailures = findings.filter((f) => f.type !== "meta");
        results.push({
          label,
          route,
          viewport: vp.width,
          screenshot: path.relative(outputRoot, shotPath),
          findings: caseFailures,
          afterAudio: false,
        });
        for (const f of caseFailures) {
          failures.push({
            label,
            route,
            viewport: vp.width,
            message: `[${f.type}] ${f.message}`,
          });
        }

        await context.close();
      }
    }

    // Homepage after hero audio ends (each viewport).
    if (routes.includes("/")) {
      for (const vp of viewports) {
        const label = `home-after-audio-${vp.width}`;
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: 1,
        });
        const page = await context.newPage();
        const consoleErrors = [];
        page.on("console", (msg) => {
          if (msg.type() !== "error") return;
          const text = msg.text();
          if (shouldIgnoreConsole(text)) return;
          consoleErrors.push(text);
        });
        page.on("pageerror", (err) => {
          const text = String(err?.message || err);
          if (shouldIgnoreConsole(text)) return;
          consoleErrors.push(text);
        });
        page.on("response", (res) => {
          if (res.status() !== 404) return;
          if (!isCriticalAssetUrl(res.url(), baseUrl)) return;
          consoleErrors.push(`Critical asset 404: ${res.url()}`);
        });

        await page.goto(routeUrl(baseUrl, "/"), {
          waitUntil: "networkidle",
          timeout: 60_000,
        });
        await new Promise((r) => setTimeout(r, 400));
        await forceHeroAudioEnded(page);

        const shotPath = path.join(shotsDir, `${label}.png`);
        await page.screenshot({ path: shotPath, fullPage: true });

        const findings = await collectPageFindings(page, { afterAudio: true });
        for (const err of consoleErrors) {
          findings.push({ type: "console", message: err });
        }

        results.push({
          label,
          route: "/",
          viewport: vp.width,
          screenshot: path.relative(outputRoot, shotPath),
          findings,
          afterAudio: true,
        });
        for (const f of findings) {
          failures.push({
            label,
            route: "/",
            viewport: vp.width,
            message: `[${f.type}] ${f.message}`,
          });
        }

        await context.close();
      }
    }
  } finally {
    await browser.close();
    if (server) server.close();
  }

  const report = {
    ok: failures.length === 0,
    generatedAt: new Date().toISOString(),
    routes,
    primaryButtons,
    viewports,
    results,
    failures,
  };
  const reportPath = path.join(outputRoot, "report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  const md = [
    `# Visual QA report`,
    "",
    `Status: **${report.ok ? "PASS" : "FAIL"}**`,
    "",
    `Routes (${routes.length}): ${routes.map((r) => `\`${r}\``).join(", ")}`,
    "",
    "## Failures",
    "",
  ];
  if (failures.length === 0) {
    md.push("_None_");
  } else {
    for (const f of failures) {
      md.push(`- \`${f.label}\`: ${f.message}`);
    }
  }
  md.push("", "## Screenshots", "");
  for (const r of results) {
    md.push(`- \`${r.label}\`: ${r.screenshot}`);
  }
  fs.writeFileSync(path.join(outputRoot, "report.md"), md.join("\n") + "\n");

  if (failures.length) {
    console.error(`\nVisual QA FAILED (${failures.length} issue(s)):`);
    for (const f of failures.slice(0, 50)) {
      console.error(`  - ${f.label}: ${f.message}`);
    }
    if (failures.length > 50) {
      console.error(`  …and ${failures.length - 50} more`);
    }
    process.exitCode = 1;
  } else {
    console.log("\nVisual QA passed.");
  }
  console.log(`Report: ${reportPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
