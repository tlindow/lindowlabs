# 05: Lists

**The gap:** Your `api.md` says callers can ask for many rides, not just one.
How does a machine know the list path, filters, and page controls?

**Why it exists:** Collection reads need knobs that aren't in the path. Query
parameters (key=value after `?`) carry filters and pagination so clients can ask
for a slice without inventing new URLs.

Copy your step 04 `openapi.yaml` here first.

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

**Done when:** `npm run check:step -- 05` passes (`GET /rides` with `200` and
pagination query params: `limit`/`offset`, `page`, or `cursor`).

**If stuck:** add `get:` under `/rides` with `parameters: []`, run the check,
then add one query name.
