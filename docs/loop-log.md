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
