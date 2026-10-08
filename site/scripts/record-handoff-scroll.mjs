#!/usr/bin/env node
/**
 * Record full homepage scroll down + back up for profile-photo handoff review.
 *
 * Usage:
 *   node scripts/record-handoff-scroll.mjs --url http://127.0.0.1:3456 --width 1280 --height 800 --out /path/to/out.mp4
 */

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import puppeteer from "puppeteer";

function arg(name, fallback = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

const url = arg("url");
const width = Number(arg("width", "1280"));
const height = Number(arg("height", "800"));
const outPath = arg("out");

if (!url || !outPath) {
  console.error("Usage: --url URL --out FILE.mp4 [--width 1280] [--height 800]");
  process.exit(1);
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--enable-unsafe-swiftshader",
    `--window-size=${width},${height}`,
  ],
});

const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
await page.waitForSelector('[data-profile-photo="morph"]', { timeout: 20000 });
await new Promise((r) => setTimeout(r, 800));

const maxY = await page.evaluate(() => {
  const contact = document.getElementById("contact-avatar-target");
  if (!contact) return document.body.scrollHeight;
  const abs = contact.getBoundingClientRect().top + window.scrollY;
  return Math.min(
    document.documentElement.scrollHeight - window.innerHeight,
    Math.ceil(abs - window.innerHeight * 0.35)
  );
});

const framesDir = fs.mkdtempSync("/tmp/handoff-frames-");
let frameIdx = 0;

async function capture() {
  const file = path.join(framesDir, `frame-${String(frameIdx).padStart(5, "0")}.png`);
  await page.screenshot({ path: file, type: "png" });
  frameIdx += 1;
}

async function scrollTo(y, steps) {
  const start = await page.evaluate(() => window.scrollY);
  for (let i = 1; i <= steps; i++) {
    const next = start + ((y - start) * i) / steps;
    await page.evaluate(async (t) => {
      window.scrollTo(0, t);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    }, next);
    await new Promise((r) => setTimeout(r, 16));
    await capture();
  }
}

// Hold top briefly, scroll down to Let's talk, hold at rest (photo beside
// play), scroll back up through nav, hold at top.
for (let i = 0; i < 8; i++) await capture();
await scrollTo(maxY, 72);
// Wait for morph to finish docking beside Let's talk before holding.
await page.waitForFunction(
  () => {
    const morph = document.querySelector('[data-profile-photo="morph"]');
    const contact = document.getElementById("contact-avatar-target");
    if (!morph || !contact) return false;
    const op = Number.parseFloat(getComputedStyle(morph).opacity || "0");
    if (op <= 0.15) return false;
    const mr = morph.getBoundingClientRect();
    const cr = contact.getBoundingClientRect();
    return Math.abs(mr.top - cr.top) < 24 && Math.abs(mr.left - cr.left) < 24;
  },
  { timeout: 5000 }
).catch(() => {});
for (let i = 0; i < 18; i++) await capture();
await scrollTo(0, 72);
for (let i = 0; i < 8; i++) await capture();

await browser.close();

const fps = 24;
await new Promise((resolve, reject) => {
  const ff = spawn(
    "ffmpeg",
    [
      "-y",
      "-framerate",
      String(fps),
      "-i",
      path.join(framesDir, "frame-%05d.png"),
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      outPath,
    ],
    { stdio: "inherit" }
  );
  ff.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))));
});

fs.rmSync(framesDir, { recursive: true, force: true });
console.log(`wrote ${outPath} (${frameIdx} frames @ ${fps}fps)`);
