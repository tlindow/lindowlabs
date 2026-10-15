# Worksheet: Payments REST API

Use this for **step 07**. Steps 01 through 06 already practiced PaymentIntent
shapes; here you assemble PaymentIntent, Capture, Refund, and WebhookEvent into
one contract from a blank file.

Build the public HTTP contract with the words a payments team says out loud:
**payment intent**, **capture**, **refund**, **webhook event**, **amountCents**,
**currency**.

A **PaymentIntent** is the ask to collect money. Lifecycle: `requires_capture`
→ `succeeded` (after capture) → `refunded` (after a full refund).

Type every line by feel. Do not paste YAML from steps 01 through 06 or from
`solutions/`.

## Resources

### PaymentIntent

| Field | Type | Rules |
| --- | --- | --- |
| `paymentIntentId` | string | Server-generated; present on responses |
| `amountCents` | number | Required on create; integer > 0 |
| `currency` | string | Required on create; lowercase ISO code, e.g. `usd` |
| `status` | string | Server-set: `requires_capture` on create; `succeeded` after full capture; `refunded` after a full refund |
| `createdAt` | string | ISO-8601; set by server |

### Capture

| Field | Type | Rules |
| --- | --- | --- |
| `captureId` | string | Server-generated |
| `paymentIntentId` | string | The intent being captured |
| `amountCents` | number | Optional on create; integer > 0; defaults to the intent's `amountCents`; must not exceed it |
| `createdAt` | string | ISO-8601; set by server |

### Refund

| Field | Type | Rules |
| --- | --- | --- |
| `refundId` | string | Server-generated |
| `paymentIntentId` | string | The intent being refunded |
| `amountCents` | number | Required; integer > 0; must not exceed the intent's `amountCents` |
| `createdAt` | string | ISO-8601; set by server |

### WebhookEvent

| Field | Type | Rules |
| --- | --- | --- |
| `eventId` | string | Server-generated |
| `type` | string | e.g. `payment_intent.succeeded`, `payment_intent.captured`, `refund.created` |
| `createdAt` | string | ISO-8601; set by server |
| `data` | object | Payload pointing at the related resource (at least an id field) |

## Routes

| Method | Path | Success | Notes |
| --- | --- | --- | --- |
| `POST` | `/payment_intents` | `201` | Body: `{ amountCents, currency }`. Return the created intent (`status` starts as `requires_capture`). |
| `GET` | `/payment_intents` | `200` | Return `{ paymentIntents: PaymentIntent[] }`. Support pagination query params. |
| `GET` | `/payment_intents/{paymentIntentId}` | `200` | Return one payment intent. |
| `POST` | `/payment_intents/{paymentIntentId}/capture` | `201` | Body optional: `{ amountCents }`. Return the created capture. Mark the intent `succeeded` when captured in full. |
| `POST` | `/payment_intents/{paymentIntentId}/refunds` | `201` | Body: `{ amountCents }`. Return the created refund. Mark the intent `refunded` when refunded in full. |
| `GET` | `/refunds/{refundId}` | `200` | Return one refund. |
| `GET` | `/events/{eventId}` | `200` | Return one webhook event (lookup of what the platform posts to the merchant URL). |

## Validation and status codes

- Missing or empty required fields, non-integer or non-positive `amountCents`, or unknown `currency` shape: `400` with `{ error: string }`.
- Capture or refund `amountCents` greater than the intent's `amountCents`: `400` with `{ error: string }`.
- Unknown `paymentIntentId`, `refundId`, or `eventId`: `404` with `{ error: string }`.
- Content-Type for JSON requests and responses: `application/json`.

## Language

Before you name a path or schema, ask: would a payments teammate say this word
in standup? Keep code names aligned with spoken domain language.
