# 06: Auth

From [`../00-in-plain-english/api.md`](../00-in-plain-english/api.md), translate
credential notes under **send**: copy your step 05 file here, declare a
`securitySchemes` entry, and apply it with `security`.

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
