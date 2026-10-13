# Outreach click logging

Page views on the Vercel-hosted site are written to durable storage so Tyler can see who opened outreach links (and when), past Vercel Hobby's ~1 hour log retention.

## Storage choice

**Upstash Redis** via the existing Vercel KV REST env vars:

| Env var | Purpose |
| --- | --- |
| `KV_REST_API_URL` | Upstash Redis REST URL |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |

Why this store:

- Already stubbed for playlist progress; free Upstash / Vercel Marketplace Redis on Hobby (no paid Vercel plan or paid add-on).
- Survives process restarts and outlives runtime logs.
- Serverless-friendly REST API (`@upstash/redis`).

Events are stored in a Redis list key `ll:clicks` (newest first, capped at 2000).
There is no in-memory production fallback: without `KV_REST_API_*`, ingest no-ops and `/learning/clicks` stays empty (local `LEARNING_AUTH_BYPASS=1` may show sample rows for screenshots only).

## What is recorded

On every client page view (`AnalyticsProvider`):

- `ts` - ISO UTC timestamp
- `path` - pathname (`/`, `/resume`, …)
- `query` - full query string (no leading `?`), including `utm_*` / `tag`
- `referrer` - `document.referrer`
- `userAgent` - `navigator.userAgent`

Ingest: `POST /api/clicks` (public, write-only). Viewer: `/learning/clicks` (Stytch session + owner).

## Grouping

Visits are grouped by tag, preferring `utm_content`, then `tag`, then `utm_term` / `utm_campaign` / `utm_source`. Missing tags show as `(untagged)`. Groups and rows are newest-first.

## Setup on Vercel (`lindowlabs` / team `lindow-labs-2`)

1. Project → **Storage** (or Marketplace) → create **Upstash Redis** (free).
2. Connect it so `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set, or paste them from the Upstash console.
3. Redeploy. Open a public URL with `?utm_content=someone`, then sign in and open `/learning/clicks`.

Local screenshots: `LEARNING_AUTH_BYPASS=1` seeds sample rows when the store is empty (never set bypass on production).
