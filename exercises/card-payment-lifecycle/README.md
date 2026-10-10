# Card payment lifecycle

Seal the gap from *Payments Systems in the U.S.* (Glenbrook): authorization is
not settlement.

**Resume line:** Affirm merchant engineering.

**Source:** DDD reading notes (needs fintech frameworks).

## Flow

1. Plain English first: fill [`00-in-plain-english/lifecycle.md`](./00-in-plain-english/lifecycle.md).
2. Then encode the state machine in [`01-state-machine/paymentState.ts`](./01-state-machine/paymentState.ts)
   (blank starter).
3. Do not copy a finished machine. Name states with payments-team words.

## What to do

Model **one** card payment through:

1. Authorization
2. Capture
3. Clearing
4. Settlement

As a state machine: states, allowed transitions, and what event moves you.

## Done when

- `lifecycle.md` explains each stage in plain English and what can go wrong.
- `paymentState.ts` exports states + a `transition(state, event)` that only
  allows legal moves (illegal moves return the prior state or an error of your
  choosing; document it).

```bash
ls exercises/card-payment-lifecycle
```
