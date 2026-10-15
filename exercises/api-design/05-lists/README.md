# 05: Lists

**The gap:** Your `api.md` says callers can ask for many payment intents, not
just one. How does a machine know the list path, filters, and page controls?

**Why it exists:** Collection reads need knobs that aren't in the path. Query
parameters (key=value after `?`) carry filters and pagination so clients can ask
for a slice without inventing new URLs.

Re-type your step 04 `openapi.yaml` here first (by feel; no paste).

**Shape hint:**

```yaml
/<path>:
  get:
    parameters:
      - name: <field>
        in: query
        schema:
          type: integer
```

**Done when:** `npm run check:step -- 05` passes (`GET /payment_intents` with
`200` and pagination query params: `limit`/`offset`, `page`, or `cursor`).

**If stuck:** add `get:` under `/payment_intents` with `parameters: []`, run the
check, then add one query name.
