# 07: From scratch

**The gap:** Same four questions (ask / send / return / wrong), new domain.
Can you write a full payments contract from a blank file without copying rides?

**Why it exists:** You learned each OpenAPI piece so you could assemble it cold.
The worksheet is the plain-English source; type every line of `openapi.yaml` by
hand.

Read [WORKSHEET.md](../WORKSHEET.md). Don't paste the rides YAML.

**Shape hint:** reuse what you already know (`info`, paths, schemas, `$ref`,
bodies, errors). Start with identity, then one route from the table.

**Done when:** `npm run check:step -- 07` passes (payments routes; `Payment` /
`Refund` / `Error` schemas; create body; required success / `400` / `404`).

**If stuck:** type only `openapi` + `info` + `paths: {}`, run the check, then
add `POST /payments` from the first missing-route error.
