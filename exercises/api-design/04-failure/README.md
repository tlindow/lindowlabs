# 04: Failure

Copy your step 03 file here. Add a shared `Error` schema, then document `400`
and `404` responses on the ride operations.

Happy paths alone hide how clients should handle bad input and missing resources.

```bash
npm run check:step -- 04
```

Tiny shape:

```yaml
"400":
  description: Bad request
  content:
    application/json:
      schema:
        $ref: "#/components/schemas/Error"
```
