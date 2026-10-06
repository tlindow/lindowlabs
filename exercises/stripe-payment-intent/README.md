# Learn from docs: Stripe PaymentIntent (test mode)

Stripe's payments quickstart (test mode) creates a PaymentIntent and
hands the browser a client_secret so Elements can confirm the payment.

In Practice we never call Stripe. A sample create-response JSON is
checked into the repo as a fixture. Your job is to read the fields
the quickstart cares about.

Write from scratch (pseudocode first is fine):

```
readPaymentIntentClient(fixture)
  Input: fixture - the PaymentIntent create-response object
  Output: an object with:
    - clientSecret  ← fixture.client_secret
    - amountCents  ← fixture.amount   (integer cents)
    - currency     ← fixture.currency
    - livemode     ← fixture.livemode (false for this test fixture)
```

Export it so the tests can call it:

```js
module.exports = { readPaymentIntentClient };
```

Do not call fetch. Do not invent secrets. Use only the fixture object.

## Start here

1. Open `readPaymentIntentClient.js` (starter stub) and implement the function.
2. The original Practice rep (spec + embedded test names) is in `stripe-payment-intent.js`.
3. Fixture: `fixtures/stripe-payment-intent-create.json`.

```bash
cd exercises/stripe-payment-intent
npm install
npm test
```

Tests start red until `readPaymentIntentClient` is implemented.
