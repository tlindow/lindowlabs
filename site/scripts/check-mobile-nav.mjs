#!/usr/bin/env node
/**
 * Smoke-test the sticky top nav against the static export in site/out.
 *
 * Opens the homepage at a 390px viewport, asserts Name left | LinkedIn+email
 * icons right (no audience pills), and guards against reintroducing
 * overflow-x: clip on the sticky header (Safari clips overflow-y when
 * overflow-x is clip).
 *
 * Usage (after npm run build:static):
 *   node scripts/check-mobile-nav.mjs
 *   node scripts/check-mobile-nav.mjs --url http://127.0.0.1:3000
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "out");

function parseUrlFlag() {
  const idx = process.argv.indexOf("--url");
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return null;
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
      ".txt": "text/plain; charset=utf-8",
    }[ext] || "application/octet-stream"
  );
}

function startStaticServer() {
  if (!fs.existsSync(outDir)) {
    throw new Error(`Missing ${outDir}. Run npm run build:static first.`);
  }

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let rel = urlPath === "/" ? "/index.html" : urlPath;
    let filePath = path.join(outDir, rel);

    if (!filePath.startsWith(outDir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    // Next static export may use /page.html or /page/index.html
    if (!fs.existsSync(filePath)) {
      const htmlAlt = path.join(outDir, `${rel.replace(/\/$/, "")}.html`);
      const indexAlt = path.join(outDir, rel.replace(/\/$/, ""), "index.html");
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

async function run() {
  const externalUrl = parseUrlFlag();
  let server = null;
  let baseUrl = externalUrl;

  if (!baseUrl) {
    ({ server, baseUrl } = await startStaticServer());
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    await page.goto(baseUrl, { waitUntil: "networkidle0", timeout: 60000 });

    const overflowX = await page.$eval("header", (el) =>
      getComputedStyle(el).overflowX
    );
    if (overflowX === "clip" || overflowX === "hidden") {
      throw new Error(
        `header overflow-x is "${overflowX}"; that clips overflow on Safari`
      );
    }

    const layout = await page.evaluate(() => {
      const header = document.querySelector("header");
      const brand = header?.querySelector('a[href="/"]');
      const audience = header?.querySelector(
        'a[data-nav="for-engineering-leaders"], a[data-nav="for-recruiters"], a[href="/engineering-leaders"], nav[aria-label="Audience"]'
      );
      const visitors = header?.querySelector('a[href="/visitors"]');
      const linkedIn = header?.querySelector('a[data-nav="linkedin"]');
      const email = header?.querySelector('a[data-nav="email"]');
      const topAudio = header?.querySelector(
        '[data-page-audio="nav-full-player"], [data-page-audio="nav-play"]'
      );

      if (!header || !brand) {
        return {
          ok: false,
          reason: "missing header or brand",
          brand: !!brand,
        };
      }

      const hr = header.getBoundingClientRect();
      const br = brand.getBoundingClientRect();
      const lr = linkedIn?.getBoundingClientRect();
      const er = email?.getBoundingClientRect();

      return {
        ok:
          !!linkedIn &&
          !!email &&
          lr != null &&
          er != null &&
          lr.width > 0 &&
          er.width > 0 &&
          br.left < lr.left &&
          lr.left < er.left &&
          er.top >= hr.top - 1 &&
          er.bottom <= hr.bottom + 1 &&
          !visitors &&
          !audience &&
          !topAudio,
        brandLeft: br.left,
        linkedInLeft: lr?.left ?? null,
        emailLeft: er?.left ?? null,
        hasVisitors: !!visitors,
        hasAudience: !!audience,
        hasLinkedIn: !!linkedIn,
        hasEmail: !!email,
        hasTopAudio: !!topAudio,
      };
    });

    if (!layout?.ok) {
      throw new Error(
        `Expected Name left | LinkedIn+email icons right, no audience pills, no top audio: ${JSON.stringify(layout)}`
      );
    }

    // Bottom floating dock (past hero): play + scrub + times at rest.
    await page.evaluate(() => {
      const contact = document.getElementById("contact");
      const mid = contact
        ? Math.max(280, Math.floor(contact.offsetTop * 0.45))
        : 400;
      window.scrollTo(0, mid);
    });
    await page.waitForFunction(
      () => {
        const dock = document.querySelector('[data-page-audio="bottom-dock"]');
        const player = document.querySelector(
          '[data-page-audio="nav-full-player"]'
        );
        if (!dock || !player) return false;
        const style = getComputedStyle(dock);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number.parseFloat(style.opacity || "0") > 0.85
        );
      },
      { timeout: 8000 }
    );
    const docked = await page.evaluate(() => {
      const dock = document.querySelector('[data-page-audio="bottom-dock"]');
      const player = document.querySelector(
        '[data-page-audio="nav-full-player"]'
      );
      const play = document.querySelector('[data-page-audio="nav-play"]');
      const scrubber = document.querySelector(
        '[data-page-audio="nav-scrubber"]'
      );
      const elapsed = document.querySelector(
        '[data-page-audio="nav-mobile-time-elapsed"]'
      );
      const total = document.querySelector(
        '[data-page-audio="nav-mobile-time-total"]'
      );
      const range = scrubber?.querySelector('input[type="range"]');
      const dockRect = dock?.getBoundingClientRect();
      return {
        hasDock: !!dock,
        hasPlayer: !!player,
        hasPlay: !!play,
        hasScrubber: !!scrubber,
        elapsed: (elapsed?.textContent || "").trim(),
        total: (total?.textContent || "").trim(),
        rangeMax: range ? Number(range.getAttribute("max") || range.max) : 0,
        heroPlay: !!document.querySelector('[data-page-audio="hero-play"]'),
        dockBottom: dockRect ? Math.round(dockRect.bottom) : null,
        viewportH: window.innerHeight,
        inHeader: !!play?.closest("header"),
      };
    });
    if (!docked.hasDock || !docked.hasPlayer || !docked.hasPlay) {
      throw new Error(
        `Bottom dock player missing at rest: ${JSON.stringify(docked)}`
      );
    }
    if (!docked.hasScrubber) {
      throw new Error(
        `Bottom dock scrubber missing at rest: ${JSON.stringify(docked)}`
      );
    }
    if (docked.elapsed !== "0:00") {
      throw new Error(
        `Expected elapsed 0:00 at rest, got "${docked.elapsed}"`
      );
    }
    if (!docked.total || docked.total === "0:00" || !(docked.rangeMax > 0)) {
      throw new Error(
        `Expected total duration at rest on bottom dock: ${JSON.stringify(docked)}`
      );
    }
    if (docked.heroPlay) {
      throw new Error("hero-play still mounted while bottom dock is visible");
    }
    if (docked.inHeader) {
      throw new Error("nav-play must not live in the sticky header anymore");
    }
    if (
      docked.dockBottom == null ||
      docked.dockBottom < docked.viewportH - 80
    ) {
      throw new Error(
        `Bottom dock not near viewport bottom: ${JSON.stringify(docked)}`
      );
    }

    console.log(
      "check-mobile-nav: ok (LinkedIn+email icons at 390px, no audience pills, bottom dock play+scrub+times at rest, no top audio, header overflow-x safe)"
    );
  } finally {
    await browser.close();
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

run().catch((err) => {
  console.error(`check-mobile-nav: ${err.message || err}`);
  process.exit(1);
});
