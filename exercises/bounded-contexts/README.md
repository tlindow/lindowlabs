# Bounded contexts: checkout

Seal the gap from Domain-Driven Design Ch 2: one shared language inside each
boundary, not one muddled checkout blob.

**Resume line:** merchant domain architecture review (which team owns which
merchant data).

## Flow

1. Plain English first: fill [`00-in-plain-english/contexts.md`](./00-in-plain-english/contexts.md).
2. Then map code into folders under [`01-split/`](./01-split/) (blank starters).
3. Do not copy a finished design. Type your own boundaries.

## What to do

Split a small checkout sketch into three bounded contexts using the words your
team would say in standup:

| Context | Owns (examples) | Does not own |
| :--- | :--- | :--- |
| **Merchant** | merchant identity, onboarding status | card capture |
| **Payments** | authorize / capture intent | dispute evidence |
| **Disputes** | chargeback / dispute cases | merchant API keys |

## Done when

- `contexts.md` names each context, its ubiquitous language, and one seam
  (what crosses the boundary, and in which direction).
- Under `01-split/`, each context has at least one blank module file you filled
  with types or stubs that use **only that context's words**.

```bash
# No automated check yet. Re-read your seams out loud; if a word belongs in
# two contexts with different meanings, rename or redraw the boundary.
ls exercises/bounded-contexts
```
