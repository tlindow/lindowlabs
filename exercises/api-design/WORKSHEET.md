# Worksheet: Payments REST API

Use this domain only for **step 07**. Steps 01 through 06 stay on rides.

Build the public HTTP contract with the words a payments team says out loud:
**merchant**, **payment**, **refund**, **amountCents**, **currency**.

## Resources

### Payment

| Field | Type | Rules |
| --- | --- | --- |
| `paymentId` | string | Server-generated; present on responses |
| `merchantId` | string | Required on create; non-empty |
| `amountCents` | number | Required on create; integer > 0 |
| `currency` | string | Required on create; lowercase ISO code, e.g. `usd` |
| `status` | string | Server-set: `pending` on create; `refunded` after a full refund |
| `createdAt` | string | ISO-8601; set by server |

### Refund

| Field | Type | Rules |
| --- | --- | --- |
| `refundId` | string | Server-generated |
| `paymentId` | string | The payment being refunded |
| `amountCents` | number | Required; integer > 0; must not exceed the payment's `amountCents` |
| `createdAt` | string | ISO-8601; set by server |

## Routes

| Method | Path | Success | Notes |
| --- | --- | --- | --- |
| `POST` | `/payments` | `201` | Body: `{ merchantId, amountCents, currency }`. Return the created payment. |
| `GET` | `/payments` | `200` | Optional `?merchantId=` filter. Return `{ payments: Payment[] }`. |
| `GET` | `/payments/{paymentId}` | `200` | Return one payment. |
| `POST` | `/payments/{paymentId}/refunds` | `201` | Body: `{ amountCents }`. Return the created refund. Mark the payment `refunded` when refunded in full. |
| `GET` | `/refunds/{refundId}` | `200` | Return one refund. |

## Validation and status codes

- Missing or empty required fields, non-integer or non-positive `amountCents`, or unknown `currency` shape: `400` with `{ error: string }`.
- Refund `amountCents` greater than the payment's `amountCents`: `400` with `{ error: string }`.
- Unknown `paymentId` or `refundId`: `404` with `{ error: string }`.
- Content-Type for JSON requests and responses: `application/json`.

## Language

Before you name a path or schema, ask: would a payments teammate say this word
in standup? Keep code names aligned with spoken domain language.
