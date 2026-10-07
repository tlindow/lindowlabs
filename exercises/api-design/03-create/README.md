# 03: Create

Copy your step 02 file here. Add `POST /rides` with a JSON request body and
`required` fields on the create schema.

Creates need an explicit body contract so clients know what they must send.

```bash
npm run check:step -- 03
```

Tiny shape:

```yaml
requestBody:
  required: true
  content:
    application/json:
      schema:
        $ref: "#/components/schemas/CreateThing"
```
