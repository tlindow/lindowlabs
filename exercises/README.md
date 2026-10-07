# Learning Exercises

Hands-on technical exercises for personal learning. Open each folder in Cursor and solve from scratch; tests stay red until you implement the solution.

| Exercise | One-line brief | Run |
| :--- | :--- | :--- |
| [`api-design/`](./api-design/) | OpenAPI by hand (rides steps, then payments worksheet); Fastify extras | `cd exercises/api-design && npm install && npm run check:step -- 01` |
| [`stripe-payment-intent/`](./stripe-payment-intent/) | Read PaymentIntent create fixture fields (no Stripe network calls) | `cd exercises/stripe-payment-intent && npm install && npm test` |
| [`proto-learning/`](./proto-learning/) | Protobuf & gRPC B2B merchant settlements and payout rails | See [`proto-learning/README.md`](./proto-learning/README.md) |
| [`nextjs-learning/`](./nextjs-learning/) | Next.js App Router ledger and streaming architecture | See [`nextjs-learning/README.md`](./nextjs-learning/README.md) |
| [`realtime-deal-room/`](./realtime-deal-room/) | Real-time collaboration: polling vs SSE vs WebSockets | See [`realtime-deal-room/README.md`](./realtime-deal-room/README.md) |
| [`rest-api-trading/`](./rest-api-trading/) | REST API design for a Robinhood-style trading platform | See [`rest-api-trading/README.md`](./rest-api-trading/README.md) |

`api-design` and `stripe-payment-intent` come from [beginner-work/tinker](https://github.com/beginner-work/tinker) Practice reps. They are not part of the site build or root CI; run checks inside each exercise folder (`npm run check` / `npm test`).
