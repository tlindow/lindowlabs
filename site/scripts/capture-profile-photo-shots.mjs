#!/usr/bin/env node
/**
 * Capture before/after profile-photo screenshots at hero, middle, footer.
 * Usage:
 *   node scripts/capture-profile-photo-shots.mjs --url URL --label before|after --out DIR
 *   node scripts/capture-profile-photo-shots.mjs --url URL --label after --audio --out DIR
 */

import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer";

function flag(name, fallback = null) {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return fallback;
}

const url = flag("url");
const label = flag("label", "shot");
const outDir = path.resolve(flag("out", "/opt/cursor/artifacts/screenshots"));
const wantAudio = process.argv.includes("--audio");

if (!url) {
  console.error("Need --url");
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });

async function settle(page) {
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  );
  await new Promise((r) => setTimeout(r, 500));
}

async function captureViewport(browser, width, height) {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  const targetUrl = wantAudio
    ? `${url.replace(/\/$/, "")}/?pageAudioPreview=1`
    : url;
  await page.goto(targetUrl, { waitUntil: "networkidle0", timeout: 90000 });
  await settle(page);

  const prefix = `${label}-${width}`;

  await page.screenshot({
    path: path.join(outDir, `${prefix}-hero.png`),
    fullPage: false,
  });

  await page.evaluate(() => {
    const contact = document.getElementById("contact");
    const mid = contact
      ? Math.max(280, Math.floor(contact.offsetTop * 0.45))
      : Math.floor(document.body.scrollHeight * 0.4);
    window.scrollTo(0, mid);
  });
  await settle(page);
  await page.screenshot({
    path: path.join(outDir, `${prefix}-middle.png`),
    fullPage: false,
  });

  await page.evaluate(() => {
    const target =
      document.getElementById("contact-avatar-target") ||
      document.getElementById("contact");
    target?.scrollIntoView({ block: "center" });
  });
  await settle(page);
  await page.screenshot({
    path: path.join(outDir, `${prefix}-footer.png`),
    fullPage: false,
  });

  if (wantAudio && width === 1280) {
    // Ensure contact play control has painted for the audio footer artifact.
    await settle(page);
    await page.screenshot({
      path: path.join(outDir, `${prefix}-footer-audio.png`),
      fullPage: false,
    });
  }

  await page.close();
}

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  await captureViewport(browser, 1280, 800);
  await captureViewport(browser, 390, 844);
  console.log(`captured ${label} shots into ${outDir}`);
} finally {
  await browser.close();
}
