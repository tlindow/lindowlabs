# Payments API (plain English)

Caller: a merchant backend (or partner integration) talking to a small payments
API. Resources: PaymentIntent (collect money), Capture (settle a hold), Refund
(return money), WebhookEvent (lifecycle notice). PaymentIntent lifecycle:
requires_capture → succeeded → refunded.

## ask

- Get one payment intent by id.
- List payment intents, with a page size and starting offset.
- Get one refund by id.
- Get one webhook event by id (what the platform already posted, or will post).

## send

- To create a payment intent: amountCents and currency (required).
- To capture a payment intent: optional amountCents (defaults to the full hold).
- To create a refund on a payment intent: amountCents (required).
- To read or list: an id in the path, or query filters for the list.
- Callers prove who they are with a bearer token.
- Webhook delivery: the platform posts a WebhookEvent JSON body to the
  merchant's configured HTTPS URL.

## return

- One payment intent: paymentIntentId, amountCents, currency, status, createdAt.
- A list of payment intents: the intents on this page, plus the limit and offset used.
- A create payment intent: the new intent (status starts as requires_capture).
- A capture: captureId, paymentIntentId, amountCents, createdAt; intent status becomes succeeded when captured in full.
- One refund: refundId, paymentIntentId, amountCents, createdAt.
- One webhook event: eventId, type, createdAt, and a data object pointing at the related resource.

## wrong

- Bad create or capture payload (missing fields, bad amountCents, bad currency): say what went wrong.
- Capture or refund amount greater than the intent amount: say what went wrong.
- Unknown paymentIntentId, refundId, or eventId: say it was not found.
