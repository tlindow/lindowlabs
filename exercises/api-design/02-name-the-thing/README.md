# 02: Name the thing

Copy your step 01 file here. Move the `200` response shape into
`components/schemas` and point at it with `$ref`.

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
