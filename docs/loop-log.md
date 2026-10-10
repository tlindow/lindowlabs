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
| 2026-10-08 | inner: Cursor | Let's talk resting state showed play only (morph lagged under sticky nav) | #125 | jump `contactProgress` with scroll (no spring lag); check waits for morph aligned at contact before asserting |
| 2026-10-08 | inner: Cursor | nav↔Let's talk morph flew across body text (Building Teams) | #125 | snap morph to contact slot on dock owner change (crossfade with nav img); `check:scroll-handoff` asserts no mid-page flying morph |
| 2026-10-08 | inner: Cursor | docked mid-page: morph WebGL sliver under sticky nav | #125 | while owner=nav hide canvas (`visibility`+opacity) every frame; morph wrapper `visibility:hidden` |
| 2026-10-08 | inner: Cursor | docked mid-page: leftover morph still painted below nav (scrubber/play) | #125 | owner=nav → morph `display:none` + canvas `display:none`; snap x/y/size to nav slot (no spring-lag overhang); check asserts display:none |
| 2026-10-09 | inner: Cursor | hero morph + play painted over sticky nav mid-scroll (~1024-1280) | #131 | SiteChrome wraps page in `relative z-0` so fixed morph/filter/translate layers stay under nav `z-50`; morph never raises to z-60; `check:profile-photo` samples cross-nav offsets |
| 2026-10-10 | inner: Cursor | none (personalized /learning reading curriculum) | #133 | `/learning` desk reads ordered list from `site/src/data/learning/readingCurriculum.ts` (book, scope, Why + essay title); exercises stay from `learningDashboard.ts`; Notion no longer required for the desk home |
| 2026-10-10 | inner: Cursor | none (docked nav scrubber + play progress ring) | #138 | Docked nav shows play + seekable scrub + times at rest; circular progress ring on play after start; mobile under-nav timeline with elapsed/total; durationSeconds seeds scrubber before metadata |
| 2026-10-10 | inner: Cursor | none (hero play progress ring; nav scrub only) | this PR | Circular progress ring moves to hero play (beside large photo); docked nav keeps linear scrub + times with no ring |
| 2026-10-10 | inner: Cursor | none (open /learning signup + per-user scope) | this PR | OTP allowlist removed; any phone may session. Curriculum scoped by Stytch `user_id` + owner env `LEARNING_OWNER_PHONES` (fallback `LEARNING_ALLOWED_PHONES`); non-owners get starter empty desk; `npm run test` covers owner/non-owner/signed-out |
| 2026-10-10 | inner: Cursor | none (owner curriculum 6 books + exercises) | this PR | Owner `readingCurriculum` is exactly 6 books (resume + essay/source + Tinker exercise links); non-owners still get starter via `readingCurriculumForUser`; new `exercises/*` katas; `npm run test` asserts count/links |
| 2026-10-10 | inner: Cursor | none (why-this-module Claim/Gap/Risk/Close) | this PR | Owner desk shows order rationale once + per-module Why block; SRE marked Owned (paperback); still server-scoped; tests assert why fields + single ownership chip |
| 2026-10-10 | inner: Cursor | none (curriculum as essay; SRE first) | this PR | Owner `/learning` is one essay (title/intro/6 modules with Considered instead + Exercise); order SRE→APIs→DDD→Payments→DDIA→Grokking; Claim/Gap/Risk removed; tests assert order + exercise text |
| 2026-10-10 | inner: Cursor | none (final curriculum essay text) | this PR | Final owner essay: SRE→Lauret→Khononov→Glenbrook→DDIA Ch7→Grokking; no Owned badge; no earlier-plan/date leftovers; tests forbid Oct 4/Sep 30/ruled out |
