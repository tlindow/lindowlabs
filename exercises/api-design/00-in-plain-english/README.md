# 00: In plain English

**The gap:** No machine format yet. In `api.md`, answer what a **rides** caller
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

**If stuck:** write `## ask` and one sentence about one thing a caller might
want. Fill the other three after that.
