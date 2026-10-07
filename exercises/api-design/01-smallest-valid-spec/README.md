# 01: Smallest valid spec

**The gap:** Your `api.md` says a caller can ask for one ride and get something
back. How does a machine know the path and what success looks like?

**Why it exists:** OpenAPI is a YAML/JSON contract for HTTP APIs. Lint tools
need a version, an `info` name, and at least one path before they'll treat the
file as real. You're inventing the smallest doc that answers one ask and return.

**Shape hint** (placeholders only):

```yaml
openapi: "3.0.3"
info:
  title: <name>
  version: "1.0.0"
paths:
  /<path>/{id}:
    get:
      responses:
        "200":
          description: <what comes back>
```

**Done when:** `npm run check:step -- 01` passes (OpenAPI 3.x, `info`, and
`GET /rides/{id}` with a `200`).

**If stuck:** type `openapi: "3.0.3"` alone, run the check, then add `info`
from the error.
