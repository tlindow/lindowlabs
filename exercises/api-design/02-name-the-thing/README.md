# 02: Name the thing

**The gap:** Your `api.md` describes what comes back for a ride. How do you name
that shape once so responses can point at it instead of repeating fields?

**Why it exists:** Inline objects get copied and drift. A schema is a named JSON
shape; `$ref` points into `components/schemas` so the contract reuses the name.

Copy your step 01 `openapi.yaml` here first.

**Shape hint:**

```yaml
components:
  schemas:
    <Thing>:
      type: object
schema:
  $ref: "#/components/schemas/<Thing>"
```

**Done when:** `npm run check:step -- 02` passes (`Ride` schema exists; `200`
uses `$ref` to it).

**If stuck:** add an empty `components:` key, run the check, then fill
`schemas` from the error.
