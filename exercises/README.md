# Learning Exercises

Hands-on technical exercises for personal learning. Open each folder in Cursor
(or from Tinker → Exercises) and solve from scratch; never copy-paste solutions.
Prefer plain-English pseudocode first, then a blank starter file.

## /learning curriculum essay (ordered)

| # | Exercise | Book | Brief |
| :--- | :--- | :--- | :--- |
| 1 | [`merchant-portal-slos/`](./merchant-portal-slos/) | Site Reliability Engineering (Ch 3, 4, 6, 14 and 15) | SLOs, error budget, fast-burn alert |
| 2 | [`api-design/`](./api-design/) | The Design of Web APIs | Merchant / Order / Refund resources → OpenAPI |
| 3 | [`bounded-contexts/`](./bounded-contexts/) | Learning Domain-Driven Design (Khononov) | Split checkout into Merchant, Payments, Disputes |
| 4 | [`card-payment-lifecycle/`](./card-payment-lifecycle/) | Payments Systems in the U.S. | Auth → capture → clearing → settlement state machine |
| 5 | [`idempotent-refund/`](./idempotent-refund/) | DDIA Ch 7 | Same refund twice refunds once |
| 6 | [`settlement-binary-search/`](./settlement-binary-search/) | Grokking Algorithms | Binary search over sorted settlement records |

## Other practice

| Exercise | One-line brief | Run |
| :--- | :--- | :--- |
| [`stripe-payment-intent/`](./stripe-payment-intent/) | Read PaymentIntent create fixture fields (no Stripe network calls) | `cd exercises/stripe-payment-intent && npm install && npm test` |
| [`proto-learning/`](./proto-learning/) | Protobuf & gRPC B2B merchant settlements and payout rails | See [`proto-learning/README.md`](./proto-learning/README.md) |
| [`nextjs-learning/`](./nextjs-learning/) | Next.js App Router ledger and streaming architecture | See [`nextjs-learning/README.md`](./nextjs-learning/README.md) |
| [`realtime-deal-room/`](./realtime-deal-room/) | Real-time collaboration: polling vs SSE vs WebSockets | See [`realtime-deal-room/README.md`](./realtime-deal-room/README.md) |
| [`rest-api-trading/`](./rest-api-trading/) | REST API design for a Robinhood-style trading platform | See [`rest-api-trading/README.md`](./rest-api-trading/README.md) |

`api-design` and `stripe-payment-intent` also appear in [beginner-work/tinker](https://github.com/beginner-work/tinker) Practice. They are not part of the site build or root CI; run checks inside each exercise folder when provided (`npm run check` / `npm test`).
