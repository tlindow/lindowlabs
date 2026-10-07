# 06: Auth

Copy your step 05 file here. Declare a `securitySchemes` entry and apply it with
`security` so protected operations require credentials.

Auth belongs in the contract so generated clients and docs show how to call in.

```bash
npm run check:step -- 06
```

Tiny shape:

```yaml
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
security:
  - bearerAuth: []
```
