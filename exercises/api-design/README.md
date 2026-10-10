# OpenAPI by hand

**/learning curriculum #2** (*The Design of Web APIs*): in plain English, model
**Merchant**, **Order**, and **Refund** as resources, map routes/methods, then
write the OpenAPI. Steps 01–06 practice the shapes on a rides domain; step 07
(and the worksheet) switch to payments-team words. You may name the checkout
resource **Order** in your plain-English notes even when the worksheet table
says payment.

Start in plain English, then turn that understanding into OpenAPI YAML one
milestone at a time. Practice files start blank on purpose.

1. Step **00**: write [`00-in-plain-english/api.md`](./00-in-plain-english/api.md).
2. Steps **01** through **06**: copy your `openapi.yaml` forward; each milestone
   translates a slice of that `api.md` for the **rides** domain.
3. Step **07**: leave rides behind and write the payments contract from
   [WORKSHEET.md](./WORKSHEET.md) by hand.

Machine-readable step list: [`steps.json`](./steps.json) (for Tinker to split or
merge steps later; boundaries stay coarse here).

## Steps

| Step | Folder | What you add | From `api.md` |
| :--- | :--- | :--- | :--- |
| 00 | [`00-in-plain-english/`](./00-in-plain-english/) | Plain English answers | ask, send, return, wrong |
| 01 | [`01-smallest-valid-spec/`](./01-smallest-valid-spec/) | Version, info, one `GET` | ask, return |
| 02 | [`02-name-the-thing/`](./02-name-the-thing/) | Named schema + `$ref` | return |
| 03 | [`03-create/`](./03-create/) | `POST` with a request body | send |
| 04 | [`04-failure/`](./04-failure/) | Shared `Error`, 400, 404 | wrong |
| 05 | [`05-lists/`](./05-lists/) | Query params and pagination | ask |
| 06 | [`06-auth/`](./06-auth/) | A security scheme | send |
| 07 | [`07-from-scratch/`](./07-from-scratch/) | Whole payments spec by hand | all four (payments) |

## How to check

Step 00 has no lint. For YAML milestones:

```bash
cd exercises/api-design
npm install
npm run check:step -- 01
```

Replace `01` with the step you are on. The check lints your YAML and asserts the
shapes that step requires. Reference answers live under [`solutions/`](./solutions/)
(peek only after you have typed your own).

## Later: Fastify implementation

After the OpenAPI track, build the payments API in TypeScript under
[`extras/`](./extras/).
