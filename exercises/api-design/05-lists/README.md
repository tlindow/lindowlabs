# 05: Lists

Copy your step 04 file here. Add `GET /rides` with query parameters for filtering
and pagination (for example `limit` and `offset`).

Lists need filters and page controls in the query string, not the path.

```bash
npm run check:step -- 05
```

Tiny shape:

```yaml
parameters:
  - name: limit
    in: query
    schema:
      type: integer
```
