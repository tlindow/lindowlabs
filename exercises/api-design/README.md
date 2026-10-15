# OpenAPI by hand

**/learning curriculum #1** (exercise-only): write an OpenAPI contract for a
small payments API. Every step stays in the same domain: **PaymentIntent**,
**Capture**, **Refund**, and **WebhookEvent**.

Start in plain English, then turn that understanding into OpenAPI YAML one
milestone at a time. Practice files start blank on purpose. Write every YAML
line by feel; never copy-paste from solutions or from an earlier step's file
into a later one (you may re-type forward what you already learned).

1. Step **00**: write [`00-in-plain-english/api.md`](./00-in-plain-english/api.md).
2. Steps **01** through **06**: grow one `openapi.yaml` around **PaymentIntent**
   (ask, return, send, wrong, lists, auth).
3. Step **07**: from a blank file, write the full PaymentIntent / Capture /
   Refund / WebhookEvent contract from [WORKSHEET.md](./WORKSHEET.md).

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
| 07 | [`07-from-scratch/`](./07-from-scratch/) | Whole payments spec by hand | all four |

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
