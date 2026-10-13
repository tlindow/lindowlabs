# 07: From scratch

**The gap:** Same four questions (ask / send / return / wrong), same payments
domain. Can you write the full Merchant / Order / Refund contract from a blank
file without copying your step 06 YAML?

**Why it exists:** You learned each OpenAPI piece so you could assemble it cold.
The worksheet is the plain-English source; type every line of `openapi.yaml` by
hand.

Read [WORKSHEET.md](../WORKSHEET.md). Don't paste earlier practice YAML.

**Shape hint:** reuse what you already know (`info`, paths, schemas, `$ref`,
bodies, errors). Start with identity, then one route from the table.

**Done when:** `npm run check:step -- 07` passes (merchant, order, and refund
routes; `Merchant` / `Order` / `Refund` / `Error` schemas; create body; required
success / `400` / `404`).

**If stuck:** type only `openapi` + `info` + `paths: {}`, run the check, then
add `POST /orders` from the first missing-route error.
