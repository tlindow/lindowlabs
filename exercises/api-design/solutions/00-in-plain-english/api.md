# Payments API (plain English)

Caller: a merchant backend (or partner integration) talking to a payments
platform. Resources: Merchant (the store), Order (a checkout payment), Refund
(money returned). Order lifecycle: created → paid → refunded.

## ask

- Get one merchant by id.
- Get one order by id.
- List orders, optionally filtered by merchantId, with a page size and starting offset.
- Get one refund by id.

## send

- To create a merchant: a name (required).
- To create an order: merchantId, amountCents, and currency (all required).
- To create a refund on an order: amountCents (required).
- To read or list: an id in the path, or query filters for the list.
- Callers prove who they are with a bearer token.

## return

- One merchant: merchantId, name, createdAt.
- One order: orderId, merchantId, amountCents, currency, status, createdAt.
- A list of orders: the orders on this page, plus the limit and offset used.
- A create order: the new order (status starts as created).
- One refund: refundId, orderId, amountCents, createdAt.

## wrong

- Bad create payload (missing fields, bad amountCents, bad currency): say what went wrong.
- Refund amount greater than the order amount: say what went wrong.
- Unknown merchant, order, or refund id: say it was not found.
