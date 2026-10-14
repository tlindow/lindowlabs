#!/usr/bin/env node
/**
 * Smoke-test the sticky top nav against the static export in site/out.
 *
 * Opens the homepage at a 390px viewport, asserts Name left | LinkedIn+email
 * icons right (no audience pills), and guards against reintroducing
 * overflow-x: clip on the sticky header (Safari clips overflow-y when
 * overflow-x is clip).
 *
 * Layout-only check, so it runs with prefers-reduced-motion: reduce (no
 * spring timing). Motion-on coverage lives in check-profile-photo and
 * check-scroll-handoff.
 *
 * Usage (after npm run build:static):
 *   node scripts/check-mobile-nav.mjs
 *   node scripts/check-mobile-nav.mjs --url http://127.0.0.1:3000
 */

import {
  closeServer,
  launchChromium,
  newCheckPage,
  resolveBaseUrl,
  waitForStable,
} from "./lib/browser.mjs";

async function run() {
  const { server, baseUrl } = await resolveBaseUrl();
  const browser = await launchChromium();

  try {
    const page = await newCheckPage(browser, {
      width: 390,
      height: 844,
      reducedMotion: "reduce",
    });
    await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60000 });
    // Wait for the element instead of assuming it exists right after load.
    await page.waitForSelector("header", { state: "attached", timeout: 20000 });

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
    await waitForStable(page);
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
      null,
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
    await closeServer(server);
  }
}

run().catch((err) => {
  console.error(`check-mobile-nav: ${err.message || err}`);
  process.exit(1);
});
