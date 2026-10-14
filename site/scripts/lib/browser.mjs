/**
 * Shared browser-check helpers (Playwright Chromium for every check script,
 * so local and CI use the same browser binary).
 *
 * - startStaticServer(): serve site/out on a random localhost port
 * - launchChromium(): headless Playwright Chromium
 * - newCheckPage(): page with viewport + optional reduced motion
 * - waitForStable(): wait until scroll-linked styles stop changing
 *   (replaces fixed setTimeout sleeps that made checks timing-dependent)
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const OUT_DIR = path.resolve(__dirname, "..", "..", "out");

export function parseUrlFlag(argv = process.argv) {
  const idx = argv.indexOf("--url");
  if (idx >= 0 && argv[idx + 1]) return argv[idx + 1];
  return null;
}

const CONTENT_TYPES = {
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
  ".txt": "text/plain; charset=utf-8",
};

function contentType(filePath) {
  return CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

export function startStaticServer(outDir = OUT_DIR) {
  if (!fs.existsSync(outDir)) {
    throw new Error(`Missing ${outDir}. Run npm run build:static first.`);
  }

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
    const rel = urlPath === "/" ? "/index.html" : urlPath;
    let filePath = path.join(outDir, rel);

    if (!filePath.startsWith(outDir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

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

export function closeServer(server) {
  if (!server) return Promise.resolve();
  return new Promise((resolve) => server.close(resolve));
}

/** Serve site/out unless --url was passed. */
export async function resolveBaseUrl() {
  const externalUrl = parseUrlFlag();
  if (externalUrl) return { server: null, baseUrl: externalUrl };
  return startStaticServer();
}

export function launchChromium() {
  return chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
}

/**
 * New page in its own context so viewport + reduced motion are isolated.
 * Call closeCheckPage(page) to dispose of both.
 */
export async function newCheckPage(browser, { width, height, reducedMotion = "no-preference" }) {
  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    reducedMotion,
  });
  return context.newPage();
}

export async function closeCheckPage(page) {
  await page.context().close();
}

/**
 * Wait until computed opacity / transform / display / rect of every element
 * matching `selector` is unchanged for `stableFrames` consecutive animation
 * frames (or `timeout` ms passes). Use after scrolling instead of a fixed
 * sleep so spring animations finish before assertions.
 */
export async function waitForStable(
  page,
  {
    selector = "[data-profile-photo], [data-page-audio]",
    stableFrames = 6,
    timeout = 4000,
  } = {}
) {
  await page.evaluate(
    ({ selector, stableFrames, timeout }) =>
      new Promise((resolve) => {
        const snapshot = () =>
          [...document.querySelectorAll(selector)]
            .map((el) => {
              const s = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              return [
                s.opacity,
                s.transform,
                s.display,
                s.visibility,
                Math.round(r.top),
                Math.round(r.left),
                Math.round(r.width),
              ].join("|");
            })
            .join(";");
        const started = performance.now();
        let last = snapshot();
        let stable = 0;
        const tick = () => {
          const next = snapshot();
          stable = next === last ? stable + 1 : 0;
          last = next;
          if (stable >= stableFrames || performance.now() - started > timeout) {
            resolve();
            return;
          }
          requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { selector, stableFrames, timeout }
  );
}
