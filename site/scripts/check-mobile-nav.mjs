#!/usr/bin/env node
/**
 * Smoke-test the sticky top nav against the static export in site/out.
 *
 * Opens the homepage at a 390px viewport, asserts the Login control is visible
 * (Name left | Login right), and guards against reintroducing overflow-x: clip
 * on the sticky header (Safari clips overflow-y when overflow-x is clip).
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
      const login = header?.querySelector(
        'a[href*="/learning"], a[title*="Log in"]'
      );
      const visitors = header?.querySelector('a[href="/visitors"]');
      const linkedIn = [...(header?.querySelectorAll("a") || [])].find((a) =>
        /linkedin\.com/i.test(a.href || "")
      );

      if (!header || !brand || !login) {
        return {
          ok: false,
          reason: "missing header, brand, or Login",
          brand: !!brand,
          login: !!login,
        };
      }

      const hr = header.getBoundingClientRect();
      const br = brand.getBoundingClientRect();
      const lr = login.getBoundingClientRect();

      return {
        ok:
          lr.width > 0 &&
          lr.height > 0 &&
          br.left < lr.left &&
          lr.top >= hr.top - 1 &&
          lr.bottom <= hr.bottom + 1 &&
          !visitors &&
          !linkedIn,
        brandLeft: br.left,
        loginLeft: lr.left,
        loginHref: login.getAttribute("href"),
        loginText: (login.textContent || "").trim(),
        hasVisitors: !!visitors,
        hasLinkedIn: !!linkedIn,
      };
    });

    if (!layout?.ok) {
      throw new Error(
        `Expected Name left | Login right with no Visitors/LinkedIn: ${JSON.stringify(layout)}`
      );
    }

    if (!/\/learning\/?$/.test(layout.loginHref || "")) {
      throw new Error(
        `Login href should point at /learning, got ${layout.loginHref}`
      );
    }

    if (layout.loginText !== "Login") {
      throw new Error(`Expected Login label, got "${layout.loginText}"`);
    }

    console.log(
      "check-mobile-nav: ok (Login visible at 390px, no Visitors/LinkedIn, header overflow-x safe)"
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
