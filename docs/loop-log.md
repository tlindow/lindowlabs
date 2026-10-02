# Loop log

Shared handoff between the inner loop (Cursor agents, pre-push) and the outer loop (GitHub Copilot coding agent, CI / post-push fixes). One line per entry.

Format: `YYYY-MM-DD | loop | failure type | fixing PR | prevention`

| Date | Loop | Failure type | Fixing PR | Prevention |
| --- | --- | --- | --- | --- |
| 2026-10-01 | outer: Copilot | em dash (U+2014) in static HTML | #34, #36 | none yet |
| 2026-10-01 | outer: Copilot | server page imports helper from `"use client"` module | #48 | none yet |
| 2026-10-01 | inner: Cursor | em dash (U+2014) in static HTML | (pending PR) | `npm run check` runs source + built-HTML em dash checks; AGENTS.md pre-push |
| 2026-10-01 | inner: Cursor | server page imports helper from `"use client"` module | (pending PR) | `check:client-imports` + helpers stay in `data/`/`lib/`; AGENTS.md note |
