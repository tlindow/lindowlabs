# OpenAPI by hand

Write an OpenAPI YAML file from scratch, one small addition at a time. Each step
extends the same `openapi.yaml`. Copy your file forward into the next folder
when you move on. Practice files start blank on purpose.

Domain for steps 01 through 06: a tiny **rides** API (`/rides`).
Step 07 switches to the payments worksheet in [WORKSHEET.md](./WORKSHEET.md).

## Steps

| Step | Folder | What you add |
| :--- | :--- | :--- |
| 01 | [`01-smallest-valid-spec/`](./01-smallest-valid-spec/) | Version, info, one `GET` |
| 02 | [`02-name-the-thing/`](./02-name-the-thing/) | Named schema + `$ref` |
| 03 | [`03-create/`](./03-create/) | `POST` with a request body |
| 04 | [`04-failure/`](./04-failure/) | Shared `Error`, 400, 404 |
| 05 | [`05-lists/`](./05-lists/) | Query params and pagination |
| 06 | [`06-auth/`](./06-auth/) | A security scheme |
| 07 | [`07-from-scratch/`](./07-from-scratch/) | Whole payments spec by hand |

## How to check

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
