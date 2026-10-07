# 02: Name the thing

From [`../00-in-plain-english/api.md`](../00-in-plain-english/api.md), translate
**return**: copy your step 01 file here, move the `200` response shape into
`components/schemas`, and point at it with `$ref`.

Named schemas keep response shapes reusable instead of repeating inline objects.

```bash
npm run check:step -- 02
```

Tiny shape:

```yaml
components:
  schemas:
    Thing:
      type: object
schema:
  $ref: "#/components/schemas/Thing"
```
