# 04: Failure

**The gap:** Your `api.md` lists what can go wrong. How do clients know the
status codes and the shared error shape?

**Why it exists:** Happy paths hide failure. Codes like `400` (bad input) and
`404` (missing resource) only help if the contract also names the error JSON
once and reuses it.

Copy your step 03 `openapi.yaml` here first.

**Shape hint:**

```yaml
"<status>":
  description: <why>
  content:
    application/json:
      schema:
        $ref: "#/components/schemas/<Error>"
```

**Done when:** `npm run check:step -- 04` passes (`Error` schema; ride ops
declare `400` and `404`; at least one `$ref` to `Error`).

**If stuck:** add `components.schemas.Error` as `type: object`, run the check,
then wire one failure response.
