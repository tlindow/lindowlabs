# 06: Auth

**The gap:** Your `api.md` (under send) says callers prove who they are. How
does the contract declare that credential so tools stop treating calls as open?

**Why it exists:** Auth left in a wiki doesn't show up in generated clients. A
security scheme names how credentials travel; a `security` list applies it to
the API or one operation.

Copy your step 05 `openapi.yaml` here first.

**Shape hint:**

```yaml
components:
  securitySchemes:
    <schemeName>:
      type: http
      scheme: bearer
security:
  - <schemeName>: []
```

**Done when:** `npm run check:step -- 06` passes (`components.securitySchemes`
exists; `security` set at root or on an operation).

**If stuck:** add `components.securitySchemes:` with one empty key, run the
check, then fill `type` from the error.
