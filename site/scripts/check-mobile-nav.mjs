#!/usr/bin/env node
/**
 * Smoke-test the mobile top-right menu against the static export in site/out.
 *
 * Opens the homepage at a 390px viewport, toggles the menu, asserts the panel
 * is visible below the header (not clipped), follows Visitors, and confirms
 * the URL changes. Also guards against reintroducing overflow-x: clip on the
 * sticky header (Safari clips overflow-y when overflow-x is clip).
 *
 * Usage (after npm run build):
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
    throw new Error(`Missing ${outDir}. Run npm run build first.`);
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

    // Next static export may use /visitors.html or /visitors/index.html
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
        `header overflow-x is "${overflowX}"; that clips the mobile menu on Safari`
      );
    }

    const openBtn = await page.waitForSelector(
      'button[aria-label="Open menu"]',
      { timeout: 10000 }
    );
    if (!openBtn) throw new Error("Open menu button not found at 390px");

    await openBtn.click();
    await page.waitForSelector('button[aria-label="Close menu"]', {
      timeout: 5000,
    });

    const panel = await page.waitForSelector('header [id] a[href="/visitors"]', {
      visible: true,
      timeout: 5000,
    });
    if (!panel) throw new Error("Visitors link not visible in open menu");

    const geometry = await page.evaluate(() => {
      const header = document.querySelector("header");
      const link = document.querySelector('header a[href="/visitors"]');
      if (!header || !link) return null;
      const hr = header.getBoundingClientRect();
      const lr = link.getBoundingClientRect();
      return {
        headerBottom: hr.bottom,
        linkTop: lr.top,
        linkHeight: lr.height,
        linkWidth: lr.width,
        visible:
          lr.height > 0 &&
          lr.width > 0 &&
          lr.top >= hr.bottom - 1 &&
          lr.bottom <= window.innerHeight,
      };
    });

    if (!geometry?.visible) {
      throw new Error(
        `Mobile menu panel appears clipped or invisible: ${JSON.stringify(geometry)}`
      );
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle0", timeout: 15000 }),
      panel.click(),
    ]);

    const pathname = new URL(page.url()).pathname.replace(/\/$/, "") || "/";
    if (pathname !== "/visitors") {
      throw new Error(`Expected /visitors after menu link click, got ${pathname}`);
    }

    // Menu should close after navigation (new page or client route).
    const stillOpen = await page.$('button[aria-label="Close menu"]');
    if (stillOpen) {
      // Soft check: on full reload the menu remounts closed; if still open, fail.
      throw new Error("Menu still open after following Visitors link");
    }

    console.log("check-mobile-nav: ok (open, visible panel, Visitors navigates)");
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
