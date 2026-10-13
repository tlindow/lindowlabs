# Outreach click logging

Page views on the Vercel-hosted site emit one structured line into **Vercel Runtime Logs**. No Upstash, KV, or other external store.

## What is recorded

On every client page view (`AnalyticsProvider` → `POST /api/clicks`):

| Field | Meaning |
| --- | --- |
| `timestamp` | ISO UTC |
| `path` | Full pathname (`/`, `/resume`, …) |
| `query` | Full query string (no leading `?`) |
| `utm` | Present `utm_*` / `tag` values |
| `tag` | Preferred person/campaign tag (`utm_content` → `tag` → …) |
| `referrer` | `document.referrer` (or `Referer` header fallback) |
| `userAgent` | Client UA |

Each ingest prints a single console line:

```text
click {"timestamp":"…","path":"/","query":"utm_content=alex","utm":{"utm_content":"alex"},"tag":"alex","referrer":"…","userAgent":"…"}
```

## Filter in Vercel Logs

1. Vercel → project **lindowlabs** (team **lindow-labs-2**) → **Logs** (Runtime / Observability logs).
2. Search / filter for `click` (matches the line prefix).
3. Optional: narrow further with a path or tag, e.g. `click` and `utm_content` or a person slug.

Hobby retention is short (~1 hour); this is intentionally log-only with no paid add-on.

## Ingest

- Client: `sendClickLog` in `AnalyticsProvider` (silent on failure; no public UI change).
- Server: `POST /api/clicks` (public, write-only) → `emitClickLog` → `console.log`.
