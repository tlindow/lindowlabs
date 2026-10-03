# Tyler Lindow

**Engineering Manager, Fintech Platforms**  
San Diego, CA (Open to relocation) · [tyler.lindow@gmail.com](mailto:tyler.lindow@gmail.com) · [linkedin.com/in/tlindow](https://www.linkedin.com/in/tlindow) · [github.com/tlindow](https://github.com/tlindow)

---

## Vision

To elevate the creative and financial position of software developers through education, in-person connection, and creating safe spaces to build business ideas.

---

## 🏛️ Repository Architecture

This repository is structured into three clear pillars:

```text
├── exercises/    # 🎯 Personal hands-on learning exercises & typing practice
├── content/      # ✍️ Journal entries, essays, and published post repository
└── site/         # 🌐 The living Next.js personal website & public story
```

- **[`exercises/`](./exercises/README.md)** — Dedicated exclusively to personal learning, technical katas, and schema design exercises (e.g. Protobuf & gRPC settlement engineering).
- **[`content/`](./content/README.md)** — Personal journal entries and philosophy essays (like *[Typing is Learning](./content/typing_is_learning.md)*). The working resume is at [/resume](https://lindowlabs.dev/resume).
- **[`site/`](./site/)** — The living Next.js application powering [tlindow.github.io](https://tlindow.github.io).

---

## Public story

The live narrative is on [tlindow.github.io](https://tlindow.github.io). The working resume is at [/resume](https://lindowlabs.dev/resume).

- **Summary:** Fintech engineering manager with 4+ years leading teams of up to 9 engineers at Affirm. Cut detection of higher-volume merchant outages from 20 minutes–2 hours to under 5, and held Merchant Portal at 99.9% availability with zero incidents during BFCM 2025. Ex-founder (Beginner Work Inc.). Targeting Engineering Manager / Senior EM roles in fintech (payments, platform/DevX, partner integrations).
- **Beginner | Founder** — Mar 2026 – Jul 2026 (dates only on the public narrative).
- **Affirm** carries the experience: engineering management for top-of-funnel marketing and the enterprise merchant portal, then partner engineering.
- **About** on the site uses that summary verbatim. Beginner stays dates-only on the lean narrative. Affirm carries the experience.

## Education
- **Deep Atlas** — Residency, Applied AI and Machine Learning
- **Northwestern University** — Graduate Coursework, Learning Sciences
- **University of California, San Diego** — B.S. NanoEngineering – Cum Laude

---

## Living Website (`site/`)

The `site/` directory contains the Next.js application powering [tlindow.github.io](https://tlindow.github.io). About uses the public summary verbatim. The working resume is at `/resume`.

### Quick Start

```bash
cd site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
cd site
npm run build
npm start
```

The working resume is at `/resume`. The site links to the public story and does not publish a second resume master.

### Machine Context & LLM RAG
- Full Context: [`/llms-full.txt`](site/public/llms-full.txt)
- MCP Resource: [`/context.json`](site/public/context.json)
