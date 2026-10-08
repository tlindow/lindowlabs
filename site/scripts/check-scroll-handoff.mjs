#!/usr/bin/env node
/**
 * Frame-by-frame scrollY + CLS check across the Let's talk ↔ nav handoff.
 *
 * Usage:
 *   node scripts/check-scroll-handoff.mjs --url http://127.0.0.1:3000
 */

import puppeteer from "puppeteer";

function parseUrl() {
  const idx = process.argv.indexOf("--url");
  if (idx >= 0 && process.argv[idx + 1]) return process.argv[idx + 1];
  return "http://127.0.0.1:3000";
}

async function sampleHandoff(page, width, height, label) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(parseUrl(), { waitUntil: "networkidle0", timeout: 60000 });
  await page.waitForSelector('[data-profile-photo="morph"]', { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 600));
  // Instant scroll so html.scroll-smooth does not fake stalled/backward samples.
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
  });

  const range = await page.evaluate(() => {
    const contact = document.getElementById("contact-avatar-target");
    if (!contact) return null;
    const abs = contact.getBoundingClientRect().top + window.scrollY;
    const mid = abs - window.innerHeight * 0.5;
    const start = Math.max(0, mid - 360);
    const end = mid + 80;
    return { start, end, mid };
  });
  if (!range) throw new Error(`${label}: no contact target`);

  // Install PerformanceObserver for layout-shift before scrolling the band.
  // Morph coin left/top/size updates are expected motion — exclude shifts whose
  // only source is [data-profile-photo=morph]. Still fail on nav/header CLS.
  await page.evaluate(() => {
    window.__clsEntries = [];
    window.__scrollSamples = [];
    try {
      const po = new PerformanceObserver((list) => {
        for (const e of list.getEntries()) {
          if (e.hadRecentInput) continue;
          const sources = e.sources || [];
          const onlyMorph =
            sources.length > 0 &&
            sources.every((s) => {
              const n = s.node;
              return (
                n &&
                typeof n.closest === "function" &&
                n.closest('[data-profile-photo="morph"]')
              );
            });
          if (onlyMorph) continue;
          window.__clsEntries.push({
            value: e.value,
            startTime: e.startTime,
          });
        }
      });
      po.observe({ type: "layout-shift", buffered: true });
      window.__clsObserver = po;
    } catch {
      /* older chromium */
    }
  });

  // Programmatic smooth-ish scroll through the band, sampling each frame.
  const result = await page.evaluate(async ({ start, end }) => {
    window.scrollTo(0, start);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

    const samples = [];
    let y = start;
    const step = Math.max(4, Math.floor((end - start) / 90));
    let frames = 0;
    const maxFrames = 200;

    while (y < end && frames < maxFrames) {
      y = Math.min(end, y + step);
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(r));
      const measured = window.scrollY;
      samples.push(measured);
      frames += 1;
    }

    // Scroll back up through the same band.
    while (y > start && frames < maxFrames * 2) {
      y = Math.max(start, y - step);
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(r));
      samples.push(window.scrollY);
      frames += 1;
    }

    let backward = 0;
    let stalled = 0;
    // Downhill half then uphill half — check monotonicity per direction.
    const midIdx = Math.floor(samples.length / 2);
    for (let i = 1; i < midIdx; i++) {
      if (samples[i] + 0.5 < samples[i - 1]) backward += 1;
      if (Math.abs(samples[i] - samples[i - 1]) < 0.05 && samples[i] < end - 10)
        stalled += 1;
    }
    for (let i = midIdx + 1; i < samples.length; i++) {
      if (samples[i] > samples[i - 1] + 0.5) backward += 1;
    }

    const cls = (window.__clsEntries || []).reduce((s, e) => s + (e.value || 0), 0);
    const navOpacities = [];
    const flyingHits = [];
    // Spot-check dual-photo + no mid-page flying morph at a few points in the band.
    for (const t of [0.2, 0.5, 0.8]) {
      const target = start + (end - start) * t;
      window.scrollTo({ top: target, behavior: "instant" });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      await new Promise((r) => setTimeout(r, 50));
      const photos = [...document.querySelectorAll("[data-profile-photo]")].filter((el) => {
        const op = Number.parseFloat(getComputedStyle(el).opacity || "0");
        const rect = el.getBoundingClientRect();
        return (
          op > 0.15 &&
          rect.width > 4 &&
          rect.bottom > 0 &&
          rect.top < window.innerHeight
        );
      });
      navOpacities.push({
        y: window.scrollY,
        count: photos.length,
        ids: photos.map((p) => p.getAttribute("data-profile-photo")),
      });

      // Morph must be parked at contact (or invisible) — never mid-page over body text.
      const morph = document.querySelector('[data-profile-photo="morph"]');
      const contact = document.getElementById("contact-avatar-target");
      if (morph && contact) {
        const op = Number.parseFloat(getComputedStyle(morph).opacity || "0");
        const mr = morph.getBoundingClientRect();
        const cr = contact.getBoundingClientRect();
        const inView =
          op > 0.15 && mr.width > 4 && mr.bottom > 0 && mr.top < window.innerHeight;
        if (inView) {
          const dx = Math.abs(mr.left - cr.left);
          const dy = Math.abs(mr.top - cr.top);
          if (dx > 48 || dy > 48) {
            flyingHits.push({
              y: window.scrollY,
              dx: Math.round(dx),
              dy: Math.round(dy),
              morphTop: Math.round(mr.top),
              contactTop: Math.round(cr.top),
            });
          }
        }
      }
    }

    // After visiting Let's talk, scroll back into the nav dock band and require
    // the nav photo (not an empty slot waiting for hero). Settle long enough
    // for springs + dock ownership to converge.
    const midNavY = Math.max(280, Math.floor(start * 0.55 + 240));
    window.scrollTo(0, end);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 100));
    window.scrollTo(0, midNavY);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    await new Promise((r) => setTimeout(r, 400));
    const afterUp = [...document.querySelectorAll("[data-profile-photo]")].filter((el) => {
      const op = Number.parseFloat(getComputedStyle(el).opacity || "0");
      const rect = el.getBoundingClientRect();
      return (
        op > 0.15 &&
        rect.width > 4 &&
        rect.bottom > 0 &&
        rect.top < window.innerHeight
      );
    });
    const afterUpIds = afterUp.map((p) => p.getAttribute("data-profile-photo"));

    return {
      sampleCount: samples.length,
      backward,
      stalled,
      cls,
      dualPhotoHits: navOpacities.filter((s) => s.count > 1),
      flyingHits,
      spots: navOpacities,
      start,
      end,
      afterUpIds,
      midNavY,
    };
  }, range);

  console.log(
    `${label}: samples=${result.sampleCount} backward=${result.backward} stalled=${result.stalled} cls=${result.cls.toFixed(4)} dual=${result.dualPhotoHits.length} flying=${result.flyingHits.length} afterUp=${JSON.stringify(result.afterUpIds)}`
  );
  if (result.backward > 0) {
    throw new Error(`${label}: scrollY moved backward ${result.backward} times`);
  }
  if (result.cls > 0.001) {
    throw new Error(`${label}: CLS ${result.cls} during handoff (want ~0)`);
  }
  if (result.dualPhotoHits.length > 0) {
    throw new Error(
      `${label}: dual profile photos during handoff: ${JSON.stringify(result.dualPhotoHits)}`
    );
  }
  if (result.flyingHits.length > 0) {
    throw new Error(
      `${label}: morph flying mid-page (must snap at contact): ${JSON.stringify(result.flyingHits)}`
    );
  }
  if (!(result.afterUpIds || []).includes("nav") || (result.afterUpIds || []).length !== 1) {
    throw new Error(
      `${label}: scroll-up from Let's talk must show only nav photo, got ${JSON.stringify(result.afterUpIds)} at y≈${result.midNavY}`
    );
  }
  return result;
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await sampleHandoff(page, 1280, 800, "handoff@1280");
    await sampleHandoff(page, 390, 844, "handoff@390");
    console.log("check-scroll-handoff: ok");
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error(`check-scroll-handoff: ${err.message || err}`);
  process.exit(1);
});
