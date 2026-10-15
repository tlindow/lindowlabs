# 00: In plain English

## What you are building (and why)

You are designing the HTTP contract for a **small payments API**: enough for a
merchant backend to collect card money, capture holds, refund, and learn about
lifecycle changes through webhook events.

Why start here: before YAML, you need a spoken model of the product. OpenAPI
exists so teams stop restating that same HTTP contract in chat that tools cannot
read. Get the human understanding down first; later steps invent syntax for
slices of it.

**Write every line by feel.** Type the OpenAPI YAML yourself from what you know
and from these notes. Never copy-paste from solutions, earlier practice files,
or an external sample. Step 07 starts from a blank file on purpose.

## Resources

- A **PaymentIntent** is the ask to collect money: one amount (in cents) in a
  currency, with a status that moves through the lifecycle.
- A **Capture** collects (settles) some or all of a PaymentIntent that was held
  for later capture.
- A **Refund** returns some or all of money that was already captured.
- A **WebhookEvent** is a signed notice your platform posts to the merchant's
  endpoint when something important happens (intent created, captured, refunded,
  and similar). Merchants can also look up an event by id.

Typical PaymentIntent lifecycle: `requires_capture` → `succeeded` (after
capture) → `refunded` (when refunded in full). Some intents may go straight to
`succeeded` when capture happens at create time; your notes can say which case
you are designing for.

## First concrete step (do this now)

Plain-English pseudocode. Do only this before anything else:

```
open 00-in-plain-english/api.md
write heading: ## ask
under it, one sentence:
  "Caller can get one payment intent by id."
save the file
then add ## send, ## return, and ## wrong
cover all four resources: payment intent, capture, refund, webhook event
```

**The gap:** No machine format yet. In `api.md`, answer what a payments caller
needs to know before they can use the service.

**Shape hint:** four headings, then your own bullets:

```md
## ask
## send
## return
## wrong
```

**Done when:** each heading has an answer that covers payment intents, capture,
refund, and webhook events. No `npm run check:step` here.

**If stuck:** keep the one ask sentence above, then under `## return` list the
fields you would expect back for one payment intent (`paymentIntentId`,
`amountCents`, `currency`, `status`, `createdAt`).
