# 00: In plain English

## Domain (read this first)

You are designing the HTTP contract for a **payments platform**. The caller is
usually a merchant backend or an integration that talks to your API on behalf of
a store.

- A **Merchant** is a business that sells something and wants to take payments.
- An **Order** is a checkout payment: one amount (in cents) in a currency that
  merchant wants to collect for a purchase.
- A **Refund** returns some or all of that money after the order was paid.

Typical lifecycle for an order: `created` → `paid` → `refunded` (when refunded
in full). Your plain-English notes should cover all three resources; later YAML
steps grow the Order contract first, then step 07 asks for the whole surface.

**The gap:** No machine format yet. In `api.md`, answer what a payments caller
needs to know before they can use the service.

**Why it exists:** OpenAPI started because teams kept restating the same HTTP
contract in chat that tools couldn't read. Get the human understanding down
first; later steps invent syntax for slices of it.

**Shape hint:** four headings, then your own bullets:

```md
## ask
## send
## return
## wrong
```

**Done when:** each heading has an answer. No `npm run check:step` here.

**If stuck:** write `## ask` and one sentence about fetching one order by id.
Fill the other three after that.
