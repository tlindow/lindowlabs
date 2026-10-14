/**
 * Single source of truth for the pre-push / CI check pipeline.
 *
 * `npm run check`, the pre-push hook (.githooks/pre-push), PR CI
 * (.github/workflows/site-check.yml) and the Pages deploy
 * (.github/workflows/deploy.yml) all run these steps via scripts/check.mjs.
 * Add a step here (and an npm script in package.json); never hand-copy the
 * list into a workflow or doc.
 *
 * Tiers run in order:
 *   fast      no build; seconds. Pre-push always runs this tier.
 *   build     static export into site/out (no network: fonts are local).
 *   artifact  scans site/out.
 *   browser   Playwright Chromium against site/out. Retried once; a pass on
 *             retry is reported as FLAKY, not as a clean pass.
 */

/** @typedef {{ id: string, script: string, args?: string[], retry?: number }} Step */

/** @type {Record<"fast" | "build" | "artifact" | "browser", Step[]>} */
export const TIERS = {
  fast: [
    { id: "lint", script: "lint" },
    { id: "typecheck", script: "typecheck" },
    { id: "test", script: "test" },
    { id: "client-imports", script: "check:client-imports" },
    { id: "em-dashes-source", script: "check:em-dashes", args: ["--source"] },
    { id: "loop-log", script: "check:loop-log" },
  ],
  build: [{ id: "build-static", script: "build:static" }],
  artifact: [
    { id: "labels", script: "check:labels" },
    { id: "em-dashes-html", script: "check:em-dashes" },
    { id: "locations", script: "check:locations" },
  ],
  browser: [
    { id: "mobile-nav", script: "check:mobile-nav", retry: 1 },
    { id: "profile-photo", script: "check:profile-photo", retry: 1 },
    { id: "scroll-handoff", script: "check:scroll-handoff", retry: 1 },
    { id: "visual-qa", script: "check:visual-qa", retry: 1 },
  ],
};

export const TIER_ORDER = /** @type {const} */ (["fast", "build", "artifact", "browser"]);
