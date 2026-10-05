# Tyler Lindow

**Engineering Manager, Developer Experience**  
San Diego, CA (Open to relocation) · [tyler@lindowlabs.dev](mailto:tyler@lindowlabs.dev) · [linkedin.com/in/tlindow](https://www.linkedin.com/in/tlindow) · [github.com/tlindow](https://github.com/tlindow)

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

- **Summary:** Engineering manager with 4+ years leading teams of up to 9 engineers on Affirm's merchant and partner integrations and developer experience. Led 4+ Partner and Merchant Engineering teams through a merchant-domain architecture review that reshaped Affirm's merchant org, cut detection of higher-volume merchant outages from ~1 hour to under 5 minutes, and held Merchant Portal at 99.9% availability with zero incidents during BFCM 2025. As founder of Beginner Work, built a writing tool that helped technical founders explain their work in their own voice, bridging non-technical and technical builders. Targeting Engineering Manager / Senior EM roles in developer experience, developer platforms, and partner integrations.
- **Beginner Work | Founder** — Mar 2026 – Jul 2026. Built Tinker, a writing tool that helped technical founders explain their work in their own voice; validated across successive prototypes through 92 in-person conversations (including 5 VCs) and 28 early users. Beginner's research phase ended in July 2026. Product: [tinker.beginner.work](https://tinker.beginner.work). Source: [github.com/beginner-work/tinker](https://github.com/beginner-work/tinker).
- **Affirm** carries the company-scale EM experience: Merchant Advocacy / Merchant Portal, then Partner Engineering developer support.
- **About** on the site uses that summary verbatim.

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
