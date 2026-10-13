# Worksheet: Payments REST API

Use this for **step 07**. Steps 01 through 06 already practiced Order shapes;
here you assemble Merchant, Order, and Refund into one contract from a blank
file.

Build the public HTTP contract with the words a payments team says out loud:
**merchant**, **order**, **refund**, **amountCents**, **currency**.

An **Order** is a checkout payment: money a merchant wants to collect for a
purchase. Lifecycle: `created` → `paid` → `refunded` (after a full refund).

## Resources

### Merchant

| Field | Type | Rules |
| --- | --- | --- |
| `merchantId` | string | Server-generated; present on responses |
| `name` | string | Required on create; non-empty |
| `createdAt` | string | ISO-8601; set by server |

### Order

| Field | Type | Rules |
| --- | --- | --- |
| `orderId` | string | Server-generated; present on responses |
| `merchantId` | string | Required on create; non-empty |
| `amountCents` | number | Required on create; integer > 0 |
| `currency` | string | Required on create; lowercase ISO code, e.g. `usd` |
| `status` | string | Server-set: `created` on create; `paid` when collected; `refunded` after a full refund |
| `createdAt` | string | ISO-8601; set by server |

### Refund

| Field | Type | Rules |
| --- | --- | --- |
| `refundId` | string | Server-generated |
| `orderId` | string | The order being refunded |
| `amountCents` | number | Required; integer > 0; must not exceed the order's `amountCents` |
| `createdAt` | string | ISO-8601; set by server |

## Routes

| Method | Path | Success | Notes |
| --- | --- | --- | --- |
| `POST` | `/merchants` | `201` | Body: `{ name }`. Return the created merchant. |
| `GET` | `/merchants/{merchantId}` | `200` | Return one merchant. |
| `POST` | `/orders` | `201` | Body: `{ merchantId, amountCents, currency }`. Return the created order (`status` starts as `created`). |
| `GET` | `/orders` | `200` | Optional `?merchantId=` filter. Return `{ orders: Order[] }`. |
| `GET` | `/orders/{orderId}` | `200` | Return one order. |
| `POST` | `/orders/{orderId}/refunds` | `201` | Body: `{ amountCents }`. Return the created refund. Mark the order `refunded` when refunded in full. |
| `GET` | `/refunds/{refundId}` | `200` | Return one refund. |

## Validation and status codes

- Missing or empty required fields, non-integer or non-positive `amountCents`, or unknown `currency` shape: `400` with `{ error: string }`.
- Refund `amountCents` greater than the order's `amountCents`: `400` with `{ error: string }`.
- Unknown `merchantId`, `orderId`, or `refundId`: `404` with `{ error: string }`.
- Content-Type for JSON requests and responses: `application/json`.

## Language

Before you name a path or schema, ask: would a payments teammate say this word
in standup? Keep code names aligned with spoken domain language.
