# Merchant portal SLOs

**/learning curriculum #1** (*Site Reliability Engineering*, Ch 3, 4, 6, 14 and
15). Reliability as a target with an error budget, not a hope.

**Resume line:** Merchant Portal ~99.7% → 99.9%; outage detection ~1h → under 5 min.

Book (free): https://sre.google/sre-book/table-of-contents/

## Flow

1. Plain English first: fill [`00-in-plain-english/slos.md`](./00-in-plain-english/slos.md).
2. Then encode the burn alert check in [`01-alert-check/burnAlert.ts`](./01-alert-check/burnAlert.ts)
   (blank starter).
3. Do not paste a finished SLO pack. Derive numbers from the resume story.

## What to do

1. Pick SLIs for a merchant portal (availability and/or latency of a critical
   read path).
2. Write SLOs and the monthly error budget those imply.
3. Describe an alert that fires when the budget is burning too fast (not every
   single blip).

## Done when

- `slos.md` has SLI, SLO, error budget, and a fast-burn alert in plain English.
- `burnAlert.ts` exports a function that, given recent burn vs budget, returns
  whether to page (your rules; document them in a short comment).

```bash
# Optional self-check once you wire a tiny test later.
ls exercises/merchant-portal-slos
```
