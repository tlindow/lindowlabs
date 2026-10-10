# Settlement binary search

Seal the gap from Grokking Algorithms: one chapter's algorithm per session, on
merchant-shaped data.

**Essay:** "I'm still learning how to code everyday" (never mastered DS&A).

## Flow

1. Plain English first: fill [`00-in-plain-english/search.md`](./00-in-plain-english/search.md).
2. Then implement [`01-search/findSettlement.ts`](./01-search/findSettlement.ts)
   (blank starter).
3. Do not paste an answer from the book. Type the loop yourself.

## What to do

Given a **sorted** list of settlement records (by `settledAt` or `settlementId`),
find one target with **binary search**.

Example session: binary search over sorted settlement records for a merchant.

Later sessions: pick another chapter's algorithm and apply it to merchant data
the same way (new folder when you are ready).

## Done when

- `search.md` explains mid, low, high, and the not-found case in plain English.
- `findSettlement.ts` returns the matching record or `null` without a linear scan.

```bash
ls exercises/settlement-binary-search
```
