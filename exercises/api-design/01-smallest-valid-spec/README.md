# 01: Smallest valid spec

From [`../00-in-plain-english/api.md`](../00-in-plain-english/api.md), translate
**ask** and **return** for one read: OpenAPI version, `info` title and version,
and `GET /rides/{id}` returning `200`. About ten lines total.

A document needs identity (`info`) and at least one path before tools will lint it.

```bash
npm run check:step -- 01
```

Tiny shape (not the rides answer):

```yaml
openapi: "3.0.3"
info:
  title: Example
  version: "1.0.0"
paths: {}
```
