# Idempotent refund

Seal the gap from Designing Data-Intensive Applications Ch 7 (transactions):
retry must not double-refund.

**Resume line:** merchant data platform RPCs replacing Snowflake.

**Essay:** "I'm still learning how to code everyday".

## Flow

1. Plain English first: fill [`00-in-plain-english/idempotency.md`](./00-in-plain-english/idempotency.md).
2. Then implement [`01-endpoint/refundOnce.ts`](./01-endpoint/refundOnce.ts)
   (blank starter).
3. Do not paste a solution. Invent your own key + store sketch.

## What to do

Design an endpoint (or function) where **the same refund twice refunds once**.

Callers may retry. Your job: same idempotency key (or equivalent) returns the
same refund result without creating a second money movement.

## Done when

- `idempotency.md` says what the key is, where you store it, and what happens on
  a retry with the same key vs a new key.
- `refundOnce.ts` exports a function that, given a store + request, refunds at
  most once per key.

```bash
ls exercises/idempotent-refund
```
