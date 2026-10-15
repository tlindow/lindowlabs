# 07: From scratch

**The gap:** Same four questions (ask / send / return / wrong), same payments
domain. Can you write the full PaymentIntent / Capture / Refund / WebhookEvent
contract from a blank file without pasting your step 06 YAML?

**Why it exists:** You learned each OpenAPI piece so you could assemble it cold.
The worksheet is the plain-English source; type every line of `openapi.yaml` by
feel. Never copy-paste.

Read [WORKSHEET.md](../WORKSHEET.md). Do not paste earlier practice YAML or
anything from `solutions/`.

**Shape hint:** reuse what you already know (`info`, paths, schemas, `$ref`,
bodies, errors). Start with identity, then one route from the table.

**Done when:** `npm run check:step -- 07` passes (payment intent, capture,
refund, and event routes; `PaymentIntent` / `Capture` / `Refund` /
`WebhookEvent` / `Error` schemas; create body; required success / `400` /
`404`).

**If stuck:** type only `openapi` + `info` + `paths: {}`, run the check, then
add `POST /payment_intents` from the first missing-route error.
