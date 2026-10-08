#!/usr/bin/env node
/**
 * Assert exactly one profile photo is visible at hero, mid-page, and Let's talk.
 *
 * Uses Puppeteer against the static export (or --url). Counts elements marked
 * data-profile-photo whose computed opacity is > 0.15 and that intersect the
 * viewport (with a small fudge for the sticky nav / morph coin).
 *
 * Usage (after npm run build:static):
 *   node scripts/check-profile-photo.mjs
 *   node scripts/check-profile-photo.mjs --url http://127.0.0.1:3000
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

async function countVisibleProfilePhotos(page) {
  return page.evaluate(() => {
    const nodes = [...document.querySelectorAll("[data-profile-photo]")];
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    const visible = [];

    for (const el of nodes) {
      const style = getComputedStyle(el);
      const opacity = Number.parseFloat(style.opacity || "0");
      if (!Number.isFinite(opacity) || opacity <= 0.15) continue;
      if (style.visibility === "hidden" || style.display === "none") continue;

      const rect = el.getBoundingClientRect();
      if (rect.width < 4 || rect.height < 4) continue;

      const intersects =
        rect.bottom > 0 &&
        rect.top < vh &&
        rect.right > 0 &&
        rect.left < vw;
      if (!intersects) continue;

      visible.push({
        id: el.getAttribute("data-profile-photo") || "unknown",
        opacity,
        top: Math.round(rect.top),
        left: Math.round(rect.left),
      });
    }

    return visible;
  });
}

async function waitForMorphReady(page) {
  await page.waitForFunction(
    () => {
      const morph = document.querySelector('[data-profile-photo="morph"]');
      if (!morph) return false;
      const opacity = Number.parseFloat(getComputedStyle(morph).opacity || "0");
      return opacity > 0.15;
    },
    { timeout: 20000 }
  );
}

async function settle(page) {
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  await new Promise((r) => setTimeout(r, 450));
}

async function assertOnePhoto(page, label) {
  const visible = await countVisibleProfilePhotos(page);
  if (visible.length !== 1) {
    throw new Error(
      `${label}: expected exactly 1 visible profile photo, got ${visible.length}: ${JSON.stringify(visible)}`
    );
  }
  return visible[0];
}

async function runAtViewport(browser, baseUrl, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: "networkidle0", timeout: 60000 });
  await waitForMorphReady(page);
  await settle(page);

  const hero = await assertOnePhoto(page, `hero@${width}`);
  if (hero.id !== "morph") {
    throw new Error(`hero@${width}: expected morph coin, got ${hero.id}`);
  }

  // Mid-page: past hero morph, before Let's talk enters the expanded root.
  await page.evaluate(() => {
    const contact = document.getElementById("contact");
    const mid = contact
      ? Math.max(280, Math.floor(contact.offsetTop * 0.45))
      : Math.floor(document.body.scrollHeight * 0.4);
    window.scrollTo(0, mid);
  });
  await settle(page);
  const mid = await assertOnePhoto(page, `middle@${width}`);
  if (mid.id !== "nav") {
    throw new Error(`middle@${width}: expected nav photo, got ${mid.id}`);
  }

  // Footer Let's talk: scroll contact avatar into view.
  await page.evaluate(() => {
    const target =
      document.getElementById("contact-avatar-target") ||
      document.getElementById("contact");
    target?.scrollIntoView({ block: "center" });
  });
  // Wait for the IntersectionObserver handoff (contact visible → nav photo
  // snaps off). Sampling mid-handoff was a flake on deploy@1280; still assert
  // exactly one photo once settled.
  await page.waitForFunction(
    () => {
      const nav = document.querySelector('[data-profile-photo="nav"]');
      if (!nav) return true;
      const opacity = Number.parseFloat(getComputedStyle(nav).opacity || "0");
      return !Number.isFinite(opacity) || opacity <= 0.15;
    },
    { timeout: 3000 }
  );
  await settle(page);
  const footer = await assertOnePhoto(page, `footer@${width}`);
  if (footer.id !== "morph") {
    throw new Error(`footer@${width}: expected morph coin at Let's talk, got ${footer.id}`);
  }

  // Confirm nav photo is not also painting.
  const navOpacity = await page.$eval('[data-profile-photo="nav"]', (el) =>
    Number.parseFloat(getComputedStyle(el).opacity || "0")
  );
  if (navOpacity > 0.15) {
    throw new Error(
      `footer@${width}: nav photo still visible (opacity=${navOpacity}) alongside Let's talk`
    );
  }

  await page.close();
  return { hero: hero.id, middle: mid.id, footer: footer.id };
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
    const desktop = await runAtViewport(browser, baseUrl, 1280, 800);
    const mobile = await runAtViewport(browser, baseUrl, 390, 844);
    console.log(
      `check-profile-photo: ok desktop=${JSON.stringify(desktop)} mobile=${JSON.stringify(mobile)}`
    );
  } finally {
    await browser.close();
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
}

run().catch((err) => {
  console.error(`check-profile-photo: ${err.message || err}`);
  process.exit(1);
});
