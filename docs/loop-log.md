# Loop log

Shared handoff between the inner loop (Cursor agents, pre-push) and the outer loop (GitHub Copilot coding agent, CI / post-push fixes). One line per entry.

Format: `YYYY-MM-DD | loop | failure type | fixing PR | prevention`

| Date | Loop | Failure type | Fixing PR | Prevention |
| --- | --- | --- | --- | --- |
| 2026-10-01 | outer: Copilot | em dash (U+2014) in static HTML | #34, #36 | none yet |
| 2026-10-01 | outer: Copilot | server page imports helper from `"use client"` module | #48 | none yet |
| 2026-10-01 | inner: Cursor | em dash (U+2014) in static HTML | #52 | `npm run check` runs source + built-HTML em dash checks; AGENTS.md pre-push |
| 2026-10-01 | inner: Cursor | server page imports helper from `"use client"` module | #52 | `check:client-imports` + helpers stay in `data/`/`lib/`; AGENTS.md note |
| 2026-10-04 | inner: Cursor | none (added pages) | n/a | `/velocity` data refreshed by `.github/workflows/velocity-data.yml` daily into `site/src/data/velocity.json` |
| 2026-10-04 | inner: Cursor | none (replaced page) | n/a | `/velocity` removed; `/visitors` reads live totals from `tinker.beginner.work/api/site/visitors` with empty-state fallback |
| 2026-10-04 | inner: Cursor | phone digits in static HTML / JSON-LD / props | n/a | `check:phone-leak` scans `site/out` for `580-5788` / `5805788`; phone assembled client-side from char codes; removed from JSON-LD |
| 2026-10-05 | inner: Cursor | none (imported typing-coverage script; not in CI) | n/a | `make typing-coverage` runs `scripts/check_typing_coverage.py`; left out of CI because unmarked site LOC fails the 10% hand-typed bar (~0.2%) |
| 2026-10-06 | inner: Cursor | none (private /learning + Auth.js) | n/a | Vercel SSR hosts Auth.js; `npm run build:static` / Pages stash proxy+api+/learning for HTML checks; env `AUTH_SECRET` `AUTH_GOOGLE_ID` `AUTH_GOOGLE_SECRET` |
| 2026-10-06 | inner: Cursor | CI em-dash job used SSR `build` (no `out/`) | #97 | `.github/workflows/em-dash-check.yml` runs `npm run build:static` |
| 2026-10-06 | inner: Cursor | mobile menu panel clipped (Safari `overflow-x: clip` on header) | #100 | `npm run check:mobile-nav` (puppeteer: open menu + Visitors); no `overflow-x-clip` on sticky header |
| 2026-10-06 | inner: Cursor | none (swap Auth.js → Stytch SMS OTP) | follow-up | `/learning` uses Tinker Stytch (`STYTCH_PROJECT_ID` `STYTCH_SECRET`); email allowlist on Stytch user emails |
| 2026-10-06 | inner: Cursor | none (top nav → Login only) | follow-up | `check:mobile-nav` asserts Name left \| Login right at 390px (no Visitors/LinkedIn); Login uses `LEARNING_DASHBOARD_URL` |
| 2026-10-06 | inner: Cursor | none (Tinker login UI + phone allowlist) | follow-up | `/learning` gate matches Tinker cream/indigo UI + Lindow Labs mark; `LEARNING_ALLOWED_PHONES` enforced server-side before OTP + after verify + session; `npm run test` covers allow/refuse; Pages shows same UI with `staticHost` (no fake auth); real SMS needs Vercel + Stytch env |
| 2026-10-06 | inner: Cursor | none (/learning curriculum from Notion) | follow-up | Server Notion reader (`NOTION_READING_PLAN_TOKEN`) + overlay; parser tests on Reading plan fixture; Sealed/Already read/Dropped excluded; Tinker supplement seam unused in v1; Fastify `exercises/api-design` Open-in-Cursor on DDD Ch 2 |
| 2026-10-07 | inner: Cursor | none (resume phone/email unmasked by request) | this PR | Resume header shows plain `(650) 580-5788` + `tyler@lindowlabs.dev`; removed `check:phone-leak` / client char-code mask / blur email; separators only between rendered contact items |
| 2026-10-08 | inner: Cursor | nav + Let's talk both showed profile photo | this PR | `data-profile-anchor` + IntersectionObserver hides nav photo when hero/contact in view; `npm run check:profile-photo` (puppeteer) asserts exactly one visible photo at hero/middle/footer |
| 2026-10-08 | outer: Pages deploy | nav photo mid-fade overlapped Let's talk morph (footer@1280) | this PR | snap-hide nav `data-profile-photo` when anchors own the photo; check waits for nav opacity ≤0.15 after footer scroll; PR CI (`em-dash-check.yml`) now also runs `check:mobile-nav` + `check:profile-photo` |
| 2026-10-08 | inner: Cursor | Let's talk ↔ nav scroll hitch (layout thrash) | this PR | cache contact target Y (no getBoundingClientRect on scroll); reserve nav avatar/player width (opacity-only hide); `[overflow-anchor:none]` on sticky header; rAF-throttle morph measure |
| 2026-10-08 | inner: Cursor | scroll-up from Let's talk skipped nav; dual photo mid-hero morph; play/scrubber jumped into photo gap | #125 | `getProfileDockOwner(scrollY)` drives `showNavPhoto` (not IO gap); no auto `directToHero` on scroll; nav slot fixed width + opacity-only; `check:scroll-handoff` |
