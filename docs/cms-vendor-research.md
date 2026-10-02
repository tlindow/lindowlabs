# CMS vendor research for lindowlabs.dev

**Access date for all pricing and feature claims below: 2026-10-02** unless a source notes otherwise.  
**Recommend nothing.** This document compares options so Tyler can choose a vendor or build his own.  
**Unverified** items are marked explicitly.

## How the site works today (grounding)

The marketing site is a static Next.js App Router app under `site/`, deployed to GitHub Pages.

| Concern | Current state | Key paths |
| --- | --- | --- |
| Framework | Next.js `16.1.6`, React `19.2.3`, TypeScript `^5` | `site/package.json` |
| Styling | Tailwind CSS `^4`, CSS variables in `@theme inline` | `site/src/app/globals.css` |
| Motion | Framer Motion `^12.35.0` | `site/src/components/animations/` |
| Routing | App Router pages: `/`, `/resume`, `/blog`, `/blog/[slug]`, `/time` (re-exports `/get-your-time-back`), `/brand`, `/modules` | `site/src/app/` |
| Output | `output: "export"` in production (static HTML) | `site/next.config.ts` |
| Deploy | GitHub Actions builds `site/out` and deploys Pages | `.github/workflows/deploy.yml` |
| Blog index | Typed array of posts (slug, slides, audio, summary) | `site/src/data/blogPosts.ts` |
| Essay bodies | Labeled markdown paragraphs in repo | `content/essays/*.md`, loaded via `site/src/lib/frontMatter.mjs` |
| TMAY / `/time` | Hardcoded React sections + `public/audio/time-note.mp3` | `site/src/app/time/page.tsx`, `site/src/app/get-your-time-back/page.tsx`, `site/src/components/leaders/` |
| Page audio | `PageAudioPlayer` + `pageAudio` map; blog posts carry optional `audioSrc` | `site/src/components/PageAudioPlayer.tsx`, `site/src/data/pageAudio.ts`, `site/public/audio/` |
| Share metadata | Per-route `metadata` / `generateMetadata`; site default in root layout | `site/src/app/layout.tsx`, blog and page files |
| Analytics | Firebase Analytics + Remote Config; query `?variant=` override | `site/src/lib/firebase/`, `site/src/context/AnalyticsProvider.tsx` |
| Checks | `npm run check` runs lint, typecheck, client-import, em-dash, build, labels, locations | `site/package.json` |
| Current run cost | About **$10 / month** for the live stack (domain and light Firebase/ops). GitHub Pages hosting itself is free. | [unverified exact line items] |

**Static-export implication:** any CMS that assumes a Node server for instant publish must either (a) rebuild static HTML on change, (b) move off `output: "export"`, or (c) use ISR/SSR on a host that supports it. That constraint is shared across vendors.

**Content volume to migrate:** six essays under `content/essays/`, post metadata and slides in `blogPosts.ts`, page and post MP3s under `site/public/audio/`, and the TMAY page (copy in `LeadersEssay.tsx`, hero in `LeadersHero.tsx`, audio in `LeadersAudio.tsx`).

---

## Scoring keys

### Clair marketing needs (from Clair)

Scored for each option as **Y** (yes on a usable free or low-cost path for one editor), **P** (partial / needs custom glue), **N** (not native), **$** (possible but paid-only for that need). A single need can be both **P** and **$**.

1. **Bots as authors** - agents create or update content via API, SDK, or MCP as an *unpublished draft* Tyler publishes.
2. **Draft preview links** - private, shareable preview Tyler can open on a phone and approve before live.
3. **Pages for one company** - spin up a company or engineering-manager story page without a code deploy; retire later.
4. **Link tracking** - UTM or link params plus lightweight analytics (no heavy third-party scripts required).
5. **Link previews** - per-page title, description, Open Graph image for LinkedIn and email unfurls.
6. **Migration effort** - move existing blog posts and the TMAY `/time` page with audio; estimate from the repo (Low / Medium / High).

### Wallenby real costs (from Wallenby)

For each option, capture in the same place as pros:

- Monthly price for **one editor** on a low-traffic site
- What pushes into a paid tier
- Free-tier limits (seats, API calls, bandwidth, locales, preview environments)
- Which of Clair's needs are **paid-only**
- Hidden costs for self-hosted or build-our-own (hosting, database) in dollars
- Annual contract required? API behind a sales call?

**Flag:** options that need a **$99+ / month** plan to meet Tyler's goal (flexible content + design that follows the message) relative to the current ~$10 / month baseline. Marked with **COST FLAG $99+**.

This research **recommends nothing**.

---

## Comparison table (summary)

| Option | Hosting model | 1-editor entry price (published) | COST FLAG $99+? | Clair bots | Preview | One-off pages | Tracking | OG/meta | Migrate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sanity | SaaS content DB + Studio | Free; Growth $15/seat | No for core; Growth optional | Y / $ for some AI | Y | Y | P | Y | Medium |
| Contentful | SaaS | Free; Lite ~$300 or €300 | **Yes** if leaving Free | Y | Y | Y | P | Y | Medium-High |
| Payload | Self-host (Cloud paused for new) | $0 license + host | Hosting can hit $99+ | Y | P | Y | P | Y | Medium-High |
| Storyblok | SaaS | Starter free; Growth $99 | **Yes** for Growth | Y | Y | Y | P | Y | Medium |
| Builder.io | SaaS visual | Free; Pro $24/user | No at Pro | Y / $ AI credits | Y | Y | P | Y | Medium-High |
| TinaCMS | Git + Tina Cloud | Free (2 users); Team $24/project | No | P | P | P (git deploy) | P | Y | Low-Medium |
| Keystatic | Git / Cloud | Free; Cloud Pro $10 | No | P | P | P (git deploy) | P | Y | Low |
| Prismic | SaaS | Free; Starter $10 | No until Medium $150 | Y | Y | Y | P | Y | Medium |
| Hygraph | SaaS | Hobby free; Growth $199 | **Yes** for Growth | Y | Y | Y | P | Y | Medium |
| Decap | Git OSS; Turbo optional | Free; Turbo Pro €19 | No | P | P | P (git deploy) | P | Y | Low-Medium |
| Directus | Self-host or Cloud | Core $0; Cloud add-on $99 | **Yes** for Cloud add-on | Y | P | Y | P | Y | Medium-High |
| Strapi | Self-host or Cloud | Community $0; Cloud Starter $35 | Cloud Pro $90; Growth CMS $45 | Y | Y / $ live preview Growth | Y | P | Y | Medium-High |
| DatoCMS | SaaS | Free; Professional €149-€199 | **Yes** for Professional | Y | Y | Y | P | Y | Medium |
| Plain MDX/files | Repo | $0 (+ Pages free) | No | P | P | N / P | P (today) | Y (today) | None (already) |
| Build our own | Custom | Eng time + host | Can exceed $99 if overbuilt | Y (you design it) | Y (you design it) | Y | Y | Y | High product work |

**Link tracking (Clair #4)** is **P** for almost every CMS: attribution is usually done in the Next.js client (already: Firebase Analytics in `site/src/lib/firebase/analytics.ts` and `?variant=` in `AnalyticsProvider.tsx`), not inside the CMS. CMS choice does not replace that layer.

---

## Vendor notes

### 1. Sanity

**Summary.** Headless content platform with a real-time content lake, GROQ, and Sanity Studio. Portable Text for structured rich text. Strong Next.js ecosystem and visual editing / Presentation tool.

**Pros / cons vs criteria**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Portable Text + custom object types; Presentation visual editing; clear component mapping. |
| Fit with stack | Excellent with Next.js; adapters exist. Static export needs rebuild or host change. |
| AI / NL authoring | Agent Actions and Content Agent write drafts by default (`forcePublishedWrite` false). AI Assist called out on Growth. |
| Previews | Live preview and visual editing listed on Free and paid. |
| Self-host vs SaaS | Managed content DB (SaaS). Studio can be self-hosted. |
| Lock-in / export | Documents exportable via APIs; Portable Text is structured JSON. |
| DX | Schema-as-code, TypeGen, strong docs. |
| Editor UX | Studio is mature; Presentation for visual context. |
| Performance | CDN API; Free hard caps, Growth overages. |
| Maturity | High; widely used in production. |

**Wallenby costs (from Wallenby)**  
Sources: [sanity.io/pricing](https://www.sanity.io/pricing) (accessed 2026-10-02); plan docs.

- **1 editor low traffic:** Free $0 forever (up to 20 seats on Free with limited roles).
- **Paid push:** Growth at **$15 / seat / month** for Editor roles, private datasets, scheduled drafts, AI Assist, comments/tasks, pay-as-you-go overages.
- **Free limits:** 20 seats; 2 public datasets; 10k documents; 1M API CDN req/mo; 250k API req/mo; 100 GB assets and bandwidth; Live Preview included.
- **Clair needs paid-only:** AI Assist / some agent compute features on Growth [verify current Free vs Growth Agent Actions quotas]. Scheduled drafts Growth.
- **Hidden costs:** Studio hosting if self-hosted (~$0 on Vercel hobby or similar). No separate DB bill on Free.
- **Annual / sales:** Growth self-serve. Enterprise custom / sales.
- **COST FLAG $99+?** No for Free/Growth at one seat.

**Clair scores (from Clair):** bots **Y** (Management API + Agent Actions → drafts); preview **Y**; one-off pages **Y** (documents + routes); tracking **P**; OG **Y** (fields → `generateMetadata`); migrate **Medium** (map essays + audio assets + slides).

---

### 2. Contentful

**Summary.** Mature SaaS headless CMS with CMA/CDA/CPA, GraphQL, and optional Studio / AI Actions on higher tiers.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Strong structured content; rich text and references; Studio for visual composition on paid/enterprise packaging. |
| Fit with stack | Official Next.js examples; static sites use build-time fetch. |
| AI / NL | AI Actions exist; packaging often paid / Enterprise. [unverified MCP-native connector] |
| Previews | Content Preview API on Free. |
| Self-host vs SaaS | SaaS only for core product. |
| Lock-in / export | CMA export; migration tooling exists; proprietary rich text. |
| DX | Excellent SDKs; heavier model ceremony than git CMS. |
| Editor UX | Polished; roles and workflows scale up. |
| Performance | CDN delivery; Free pauses delivery at quota (changelog Dec 2025). |
| Maturity | Very high. |

**Wallenby costs (from Wallenby)**  
Sources: [contentful.com/pricing](https://www.contentful.com/pricing/) (accessed 2026-10-02); third-party USD reads of Lite ~$300 / mo (page often shows €300). Mark USD as **cross-checked, not always shown on page**.

- **1 editor:** Free $0 (up to 10 users). Lite paid ~**$300 / mo** or **€300 / mo**.
- **Paid push:** commercial use beyond Free's "test and learn" terms; higher API/CDN; comments, tasks, scheduled publishing called out on Lite packaging in secondary sources.
- **Free limits:** 1 Starter Space; 10 users; 2 roles; 2 locales; 100k API calls/mo; 50 GB CDN; 25 content types; 2 environments; 10k records; no overages (delivery pauses).
- **Clair needs paid-only:** Studio / Personalization / AI Actions packaging often Enterprise or add-on [unverified exact Free AI availability]. Commercial production may conflict with Free ToS.
- **Hidden costs:** none for DB; engineering for sync.
- **Annual / sales:** Lite self-serve in recent packaging; Enterprise sales. API on Free is self-serve (CMA available).
- **COST FLAG $99+?** **Yes** if Free is not enough for production goals.

**Clair scores (from Clair):** bots **Y** (CMA drafts); preview **Y** (CPA); one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium-High**.

---

### 3. Payload

**Summary.** TypeScript-native CMS that can live inside a Next.js monorepo. MIT open source. After Figma acquisition (2025), **new Payload Cloud deployments are paused**; self-host is the path for new projects.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Collections, blocks, Lexical editor; visual editing called out for Enterprise. |
| Fit with stack | Closest "same language as the site" option (TS + Next). Conflicts with pure static export unless CMS is a separate Node service. |
| AI / NL | No first-party NL authoring comparable to Sanity Agents on Free [unverified]. REST/GraphQL for bots. |
| Previews | Draft/preview patterns exist; shareable phone preview needs your own preview host. |
| Self-host vs SaaS | Self-host primary. Cloud paused for new. Enterprise for managed. |
| Lock-in / export | You own DB (Postgres/Mongo/SQLite). Low lock-in. |
| DX | Excellent for TS developers; you maintain upgrades. |
| Editor UX | Solid admin UI; less "marketing page builder" than Storyblok/Builder. |
| Performance | Depends on your hosting. |
| Maturity | Growing; Cloud pause is a risk signal for managed hosting. |

**Wallenby costs (from Wallenby)**  
Sources: [payloadcms.com/get-started](https://payloadcms.com/get-started); community cost writeups noting Cloud pause (accessed 2026-10-02).

- **1 editor:** $0 license.
- **Paid push:** Enterprise support / visual editing / SSO (sales).
- **Free limits:** none on software; infra is yours.
- **Clair needs paid-only:** advanced visual editing / SSO often Enterprise [unverified exact split].
- **Hidden costs (dollars):** small VPS or Fly/Railway ~**$5-25 / mo**; managed Postgres ~**$0-15 / mo** (Neon/Supabase free tiers exist); object storage for MP3s ~**$0-5 / mo**; your time for backups and upgrades. Can stay under $99. A hardened always-on stack with backups can approach or exceed **$99 / mo**.
- **Annual / sales:** Enterprise sales for support tiers.
- **COST FLAG $99+?** Not required; possible if you over-provision.

**Clair scores (from Clair):** bots **Y** (drafts via Local API / REST); preview **P**; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium-High** (new collections + asset pipeline + keep static export or split services).

---

### 4. Storyblok

**Summary.** Visual component CMS aimed at marketers; stories composed from blocs that map to frontend components.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Visual editor + nestable blok schema; strong component mapping story. |
| Fit with stack | Next.js SDK; works with SSG rebuilds. |
| AI / NL | AI credits / Ideation features on Growth packaging. |
| Previews | Visual preview is a core product story. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | Stories JSON exportable; blok model is Storyblok-shaped. |
| DX | Good SDKs; schema discipline required. |
| Editor UX | Excellent for non-devs. |
| Performance | CDN; Starter caps API/traffic. |
| Maturity | High in marketing CMS segment. |

**Wallenby costs (from Wallenby)**  
Source: [storyblok.com/pricing](https://www.storyblok.com/pricing) (accessed 2026-10-02).

- **1 editor:** Starter **Free** (1 seat, max 2).
- **Paid push:** Growth **$99 / mo** ($90.75 / mo annual): 5 seats, higher API/traffic, AI credits.
- **Free limits (Starter):** 1 space; 1 seat (max 2); 100k API req/mo; ~100 GB traffic; 20k stories; 2 locales on Starter comparison rows.
- **Clair needs paid-only:** richer AI / ideation on Growth; higher seat counts.
- **Hidden costs:** rebuild CI minutes on GitHub Actions (usually free at this traffic).
- **Annual / sales:** Growth self-serve; Premium/Elite sales. Uptime SLA rows appear on paid tiers (do not treat SLA % as a buying reason here).
- **COST FLAG $99+?** **Yes** for Growth. Starter may cover a solo editor if Free limits fit.

**Clair scores (from Clair):** bots **Y** (Management API); preview **Y**; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium**.

---

### 5. Builder.io

**Summary.** Visual page builder plus GenAI / agent credits; maps sections to registered React components.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Visual first; components registered from code. |
| Fit with stack | First-class React/Next integration. |
| AI / NL | Agent credits central to pricing. |
| Previews | Built-in preview of visual pages. |
| Self-host vs SaaS | SaaS content. |
| Lock-in / export | Content in Builder; export paths exist but model is proprietary. |
| DX | Fast for landing pages; can fight highly bespoke motion (Framer scroll morph). |
| Editor UX | Strong for marketers. |
| Performance | Runtime fetch or build-time; watch client JS. |
| Maturity | Established in composable commerce / landing pages. |

**Wallenby costs (from Wallenby)**  
Source: [builder.io/pricing](https://www.builder.io/pricing) (accessed 2026-10-02).

- **1 editor:** Free $0 (1 user included, up to 5; 60 monthly Agent Credits / 15 daily).
- **Paid push:** Pro **$24 / user / mo**; Team **$40 / user / mo**; extra 500 credits **$25 / mo**.
- **Free limits:** 1 space; seat caps; agent credit caps; publish limits reported by secondary sources [verify "15 publishes/month" on live page].
- **Clair needs paid-only:** heavy AI authoring burns Free credits quickly (**$**).
- **Hidden costs:** possible client-side Builder SDK weight on performance budget.
- **Annual / sales:** Pro/Team self-serve; Enterprise sales.
- **COST FLAG $99+?** No at one Pro seat; possible if many seats + credit packs.

**Clair scores (from Clair):** bots **Y** / **$** (APIs + agents); preview **Y**; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium-High** (rebuild bespoke pages as Builder sections).

---

### 6. TinaCMS

**Summary.** Git-backed CMS with optional Tina Cloud; edits markdown/MDX/JSON in the repo through a contextual UI.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Schema-defined collections over files; MDX components possible. |
| Fit with stack | Natural for Next + markdown already in `content/`. |
| AI / NL | AI features listed on higher Tina Cloud plans ("Coming Soon" / beta language on pricing). |
| Previews | Branch / editorial workflow on paid; Free relies on git + deploy previews you wire. |
| Self-host vs SaaS | OSS self-host or Tina Cloud. |
| Lock-in / export | Content stays in git. Very portable. |
| DX | Good for this repo's PR-based content workflow (`content/README.md`). |
| Editor UX | Better than raw git for non-devs; less than Storyblok visual. |
| Performance | Static files; same as today. |
| Maturity | Solid for git CMS; smaller than Contentful/Sanity. |

**Wallenby costs (from Wallenby)**  
Source: [tina.io/pricing](https://tina.io/pricing) (accessed 2026-10-02).

- **1 editor:** Free $0 (2 users, 2 roles). Self-host also $0.
- **Paid push:** Team **$24 / project / mo** ($290 / year); Team Plus $41; Business $249.
- **Free limits:** 2 users; community support.
- **Clair needs paid-only:** Editorial Workflow (Team Plus+); AI features Business / higher.
- **Hidden costs:** GitHub Actions build minutes; optional auth hosting if self-hosting backend.
- **Annual / sales:** listed prices are annual-billed project fees; Enterprise custom.
- **COST FLAG $99+?** No until Business.

**Clair scores (from Clair):** bots **P** (git commits via GitHub API / Tina APIs; draft = branch or unpublished commit); preview **P** (needs Vercel/Netlify-style preview or Pages branch workflow; site is on Pages today); one-off pages **P** (still a deploy/rebuild); tracking **P**; OG **Y**; migrate **Low-Medium**.

---

### 7. Keystatic

**Summary.** Thinkmill OSS CMS over Markdown/JSON/YAML in the repo; Admin UI; Markdoc/MDX; optional Keystatic Cloud for auth and extras.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Collections + document fields; you own rendering. |
| Fit with stack | Aligns with `content/essays` and typed front matter. |
| AI / NL | No first-party NL agent [unverified]. Bots = git PRs. |
| Previews | Same as git/SSG story. |
| Self-host vs SaaS | Local or GitHub mode free; Cloud optional. |
| Lock-in / export | Files in repo. |
| DX | TypeScript config; Reader API. |
| Editor UX | Clean Admin UI for structured markdown. |
| Performance | Static. |
| Maturity | Younger than Decap/Tina; active Thinkmill backing. |

**Wallenby costs (from Wallenby)**  
Source: [keystatic.com/docs/cloud](https://keystatic.com/docs/cloud) (accessed 2026-10-02).

- **1 editor:** Free (local or GitHub). Cloud Free up to 3 users/team.
- **Paid push:** Cloud Pro **$10 / mo** (+ $5 / user beyond 3) for multiplayer/images extras.
- **Free limits:** 3 Cloud users/team; GitHub auth users need GitHub accounts.
- **Clair needs paid-only:** Cloud Images / multiplayer on Pro.
- **Hidden costs:** none beyond current Pages (~$0 host).
- **Annual / sales:** no; self-serve Cloud.
- **COST FLAG $99+?** No.

**Clair scores (from Clair):** bots **P**; preview **P**; one-off pages **P**; tracking **P**; OG **Y**; migrate **Low**.

---

### 8. Prismic

**Summary.** Hosted CMS with Slice Machine: slices map to components; Migration API; visual page builder on Free.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Slice-based composition. |
| Fit with stack | Next.js + Slice Machine. |
| AI / NL | [unverified depth of NL agents on Free]. Management API for bots. |
| Previews | Preview links are a documented workflow. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | Migration API included on Free; slice model is Prismic-shaped. |
| DX | Slice Machine is opinionated. |
| Editor UX | Strong for page assembly. |
| Performance | CDN; Free locks at hard caps. |
| Maturity | High. |

**Wallenby costs (from Wallenby)**  
Source: [prismic.io/pricing](https://prismic.io/pricing) (accessed 2026-10-02). Prices per repository; annual billing advertised.

- **1 editor:** Free $0 (1 user). Starter $10; Small $25.
- **Paid push:** more users/locales; Medium **$150 / mo** for larger API/CDN and roles.
- **Free limits:** 1 user; 2 locales; 4M API calls/mo; 100 GB CDN; unlimited documents/types/assets (as published).
- **Clair needs paid-only:** multi-editor collaboration beyond 1 user (Starter/Small).
- **Hidden costs:** low.
- **Annual / sales:** self-serve tiers; Enterprise sales. Automatic upgrades when Free caps hit [per billing docs].
- **COST FLAG $99+?** No until Medium/Platinum.

**Clair scores (from Clair):** bots **Y**; preview **Y**; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium**.

---

### 9. Hygraph

**Summary.** GraphQL-native headless CMS (ex-GraphCMS) with content stages, remote sources on Growth, AI tokens on plans.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Components + models; less "visual landing builder" than Storyblok. |
| Fit with stack | GraphQL fetch at build time fits static export. |
| AI / NL | AI tokens on Hobby/Growth; depth [partially unverified]. |
| Previews | Live preview listed on Hobby. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | GraphQL content exportable; proprietary. |
| DX | Strong GraphQL schema story. |
| Editor UX | Solid structured editor. |
| Performance | GraphQL CDN; Hobby hard caps. |
| Maturity | Established mid-market. |

**Wallenby costs (from Wallenby)**  
Sources: [hygraph.com/pricing](https://hygraph.com/pricing); [hygraph.com/docs/.../update-billing](https://hygraph.com/docs/getting-started/update-billing) (accessed 2026-10-02).

- **1 editor:** Hobby $0 (3 seats).
- **Paid push:** Growth **$199 / mo**.
- **Free limits:** 1k entries; 500k API calls; 100 GB asset traffic; 3 seats; 2 locales; 20 models; 10 components; 2 content stages; 1 environment.
- **Clair needs paid-only:** remote sources, version retention, higher quotas on Growth.
- **Hidden costs:** overages on Growth ($0.20 per 10k API ops and per GB asset traffic per pricing FAQ language; confirm live).
- **Annual / sales:** Growth self-serve; Enterprise sales.
- **COST FLAG $99+?** **Yes** for Growth. Hobby may suffice if under 1k entries.

**Clair scores (from Clair):** bots **Y**; preview **Y**; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium**.

---

### 10. Decap CMS (formerly Netlify CMS)

**Summary.** MIT git-based admin UI over GitHub/GitLab/etc. Optional Decap Turbo managed proxy.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Config-driven collections; widgets; less typed than Keystatic. |
| Fit with stack | Fits static export + markdown. |
| AI / NL | None first-party. |
| Previews | Editorial workflow branches; deploy status on Turbo. |
| Self-host vs SaaS | OSS free; Turbo optional. |
| Lock-in / export | Git files. |
| DX | Simple YAML config; older UI stack. |
| Editor UX | Familiar for static sites; dated vs Sanity Studio. |
| Performance | Static. |
| Maturity | Long history; Turbo is newer. |

**Wallenby costs (from Wallenby)**  
Sources: [decapcms.org](https://decapcms.org/); [decapcms.org/turbo](https://decapcms.org/turbo/) (accessed 2026-10-02).

- **1 editor:** Free OSS. Turbo Free: 1 site, 1 seat. Turbo Pro **€19 / mo** (tax-included language on site).
- **Paid push:** Turbo Pro add-ons (sites, seats, roles).
- **Free limits:** Turbo Free fair-use request caps (e.g. 2,500 requests/day on Free per billing docs).
- **Clair needs paid-only:** managed proxy conveniences on Turbo Pro.
- **Hidden costs:** OAuth app / Git Gateway setup time; CI rebuilds.
- **Annual / sales:** month-to-month Turbo; Enterprise contact.
- **COST FLAG $99+?** No.

**Clair scores (from Clair):** bots **P**; preview **P**; one-off pages **P**; tracking **P**; OG **Y**; migrate **Low-Medium**.

---

### 11. Directus

**Summary.** Database wrapper CMS (Studio + API) over Postgres/etc. Core free with seat/collection caps; Cloud hosting add-on.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Relational collections; flexible but not Portable Text-first. |
| Fit with stack | Separate API service; Next fetches at build or runtime. |
| AI / NL | AI Assistant listed on Core marketing. |
| Previews | You build preview routes against draft items. |
| Self-host vs SaaS | Both; Cloud optional. |
| Lock-in / export | You own SQL; good portability. |
| DX | Instant API from schema; ops burden if self-hosting. |
| Editor UX | Strong data studio; less page-visual. |
| Performance | Depends on DB/host. |
| Maturity | High in open-data-platform niche. License model evolved (MSCL / grant language). Verify license fit. |

**Wallenby costs (from Wallenby)**  
Source: [directus.com/pricing](https://www.directus.com/pricing) (accessed 2026-10-02).

- **1 editor:** Core $0 (3 seats hard limit, 25 collections, 5 flows). Self-host free under Core/grant rules.
- **Paid push:** Cloud hosting add-on **$99 / mo**; Team **$499 / mo** annual ($599 monthly) with SSO seats.
- **Free limits:** 3 seats; 25 collections; 5 flows.
- **Clair needs paid-only:** SSO (Team); managed Cloud ($99).
- **Hidden costs:** self-host VPS+DB ~**$5-30 / mo**.
- **Annual / sales:** Team annual discount; Enterprise sales.
- **COST FLAG $99+?** **Yes** for Cloud add-on or Team. Self-host Core can stay under.

**Clair scores (from Clair):** bots **Y**; preview **P**; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium-High**.

---

### 12. Strapi

**Summary.** Popular Node CMS. Community MIT self-host; Growth CMS license for collaboration features; separate Strapi Cloud hosting plans.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Dynamic zones / components map well to blocks. |
| Fit with stack | Headless REST/GraphQL into Next build. |
| AI / NL | Strapi AI credits on Growth. |
| Previews | Static Preview free on all CMS plans; Live Preview on Growth. |
| Self-host vs SaaS | Both. |
| Lock-in / export | Transfer/export tools; self-host owns DB. |
| DX | Fast to start; plugin ecosystem. |
| Editor UX | Good admin; marketing visual less than Storyblok. |
| Performance | Self-host or Cloud; Starter sleeps when idle. |
| Maturity | Very high OSS adoption. |

**Wallenby costs (from Wallenby)**  
Sources: [strapi.io/pricing-cms](https://strapi.io/pricing-cms); [strapi.io/pricing-cloud](https://strapi.io/pricing-cloud) (accessed 2026-10-02).

- **1 editor:** Community CMS $0 + self-host. Cloud Starter **$35 / project / mo** (annual ~$29). Growth CMS **$45 / mo** (3 seats min, +$15/seat). Cloud Pro **$90**.
- **Paid push:** Live Preview, Releases, Content History, AI → Growth CMS; always-on / backups → Cloud Pro+.
- **Free limits:** Community unlimited seats on self-host [as published]; Cloud no free plan for new projects (historical Free removed per Strapi blog).
- **Clair needs paid-only:** Live Preview (**$** Growth); Strapi AI (**$** Growth).
- **Hidden costs:** self-host DB+compute ~**$5-30 / mo**.
- **Annual / sales:** Cloud annual discount; Enterprise sales.
- **COST FLAG $99+?** Cloud Pro is $90 (under); Cloud Pro + Growth CMS can exceed **$99**. Flag when combining.

**Clair scores (from Clair):** bots **Y** (draft & publish via API); preview **Y** static / **$** live; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium-High**.

---

### 13. DatoCMS

**Summary.** SaaS CMS with strong GraphQL, assets/video pipeline, and granular overages on Professional.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Modular blocks + structured models. |
| Fit with stack | Next.js examples; build-time GraphQL. |
| AI / NL | [unverified first-party NL agent depth]. CMA for bots. |
| Previews | Preview links / environments. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | Export APIs; proprietary. |
| DX | Excellent GraphQL DX. |
| Editor UX | Polished. |
| Performance | CDN; Free hard-stops. |
| Maturity | High. |

**Wallenby costs (from Wallenby)**  
Source: [datocms.com/pricing](https://www.datocms.com/pricing) (accessed 2026-10-02). Prices in €.

- **1 editor:** Free €0 (marketing copy: 2 editors / 300 records / 10 GB traffic / 100k CDA calls). Professional **€149 / mo** annual or **€199 / mo** monthly.
- **Paid push:** Free hard caps / deactivations for inactivity or quota; production traffic usually Professional.
- **Free limits:** 300 records; 10 GB bandwidth; 100k CDA; 25k CMA; 200 MB storage; 3 projects; sandbox environments; history 3 days. Projects can suspend at quota.
- **Clair needs paid-only:** reliable production traffic and collaborator scale (**$** Professional).
- **Hidden costs:** none for infra; watch overage line items on Professional.
- **Annual / sales:** Professional self-serve; custom contact for large.
- **COST FLAG $99+?** **Yes** for Professional (€149+).

**Clair scores (from Clair):** bots **Y**; preview **Y**; one-off pages **Y**; tracking **P**; OG **Y**; migrate **Medium**.

---

### 14. Plain MDX / files in repo (status quo+)

**Summary.** Keep canonical content in git (`content/`, `site/src/data/*.ts`, `public/audio/`), optionally MDX. Matches the existing PR-as-feed workflow in `content/README.md`.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | You define front matter + block conventions. Maximum control; zero vendor UI. |
| Fit with stack | Exact fit for static export and GitHub Pages. |
| AI / NL | Agents already edit files / open PRs; publish = merge. |
| Previews | PR deploy previews need a preview host (Pages is main-only today). |
| Self-host vs SaaS | Neither; just git. |
| Lock-in / export | None. |
| DX | Highest for Tyler-as-developer; weakest for non-git editors. |
| Editor UX | VS Code / PRs unless you add Keystatic/Tina/Decap later. |
| Performance | Best case for static. |
| Maturity | Pattern is eternal. |

**Wallenby costs (from Wallenby)**

- **1 editor:** $0 CMS + current ~$10 / mo site ops.
- **Paid push:** only if you add a git-CMS UI or paid preview host.
- **Free limits:** GitHub and Pages quotas (generous for this traffic).
- **Clair needs paid-only:** none required; phone preview may need a free Vercel preview project or similar [optional cost].
- **Hidden costs:** Tyler time; CI minutes.
- **Annual / sales:** no.
- **COST FLAG $99+?** No.

**Clair scores (from Clair):** bots **P** (PR drafts, not a CMS draft API); preview **P**; one-off pages **N/P** (needs code/content PR + rebuild; no runtime create); tracking **P** (already Firebase); OG **Y** (already `generateMetadata`); migrate **None** (already here). Audio and TMAY stay as files.

---

### 15. Build our own

**Summary.** Small content API or file writer + draft store + preview app + publish pipeline tailored to Clair needs and the design-components resolver (see sibling docs).

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Exact schemas for intent metadata + blocks. |
| Fit with stack | Can keep static export: bot writes JSON/MD → CI publish. Or add a thin Node preview service. |
| AI / NL | You own the authoring agent contract (MCP, etc.). |
| Previews | Design signed preview tokens + phone-friendly URLs. |
| Self-host vs SaaS | Your choice. |
| Lock-in / export | None if content is git or SQL you own. |
| DX | Full control; you maintain everything. |
| Editor UX | Only as good as you build. |
| Performance | Controllable. |
| Maturity | Starts at zero. |

**Wallenby costs (from Wallenby)**

- **1 editor:** software $0; infra can stay ~**$0-20 / mo** (Pages + free DB tier) if scoped tightly.
- **Paid push:** managed auth, media CDN, always-on preview, observability.
- **Free limits:** your design.
- **Clair needs paid-only:** none by vendor; maybe paid SMS/auth later.
- **Hidden costs:** engineering hours (largest cost); Postgres ~$0-15; object storage for audio ~$0-5; error tracking; domain already in ~$10 baseline. A "full CMS clone" easily exceeds **$99 / mo** in time-equivalent or infra.
- **Annual / sales:** n/a.
- **COST FLAG $99+?** Avoidable; flag if scope expands to managed multi-tenant CMS.

**Clair scores (from Clair):** all **Y** if built; migrate **High** in product work even if content copy-paste is easy.

---

## Clair needs deep dive (from Clair)

### 1. Bots as authors (unpublished draft)

| Strength | Options |
| --- | --- |
| Native draft APIs + agent products | Sanity (Agent Actions → drafts), Contentful CMA, Storyblok, Prismic, Hygraph, DatoCMS, Strapi, Directus, Payload |
| Git-as-draft (branch/PR) | Tina, Keystatic, Decap, plain files, build-our-own |
| Watch | Builder agent credits; Sanity/Strapi AI features that sit on paid tiers |

### 2. Draft preview links (phone approve)

SaaS preview APIs (Sanity Presentation, Contentful CPA, Storyblok visual, Prismic, Dato, Hygraph) map cleanly.  
Git/static path needs **branch preview hosting**. Today `.github/workflows/deploy.yml` deploys **main only** to Pages, so phone previews are a gap unless you add a preview environment (still possible under $99).

### 3. Pages for one company (no code deploy)

Requires **content-driven routes** (e.g. `/for/[slug]`) already in the app, then CMS/file entries only.  
None of the vendors remove the need for that route shell in this static Next app. After the shell exists: SaaS and Payload/Directus/Strapi can add entries without redeploying *app code* if you use runtime data or on-demand rebuild webhooks. Pure git still triggers a rebuild (not a code change, but still a deploy).

### 4. Link tracking

Keep using lightweight Firebase Analytics (`site/src/lib/firebase/analytics.ts`) plus UTM/`utm_*` and existing `?variant=` remote-config override. CMS-agnostic.

### 5. Link previews (title, description, OG image)

Already patterned: `generateMetadata` on `site/src/app/blog/[slug]/page.tsx`, route metadata on `/time` via `get-your-time-back/page.tsx`, OG image routes like `site/src/app/opengraph-image.tsx`. Any CMS must expose equivalent fields and, for static export, either prebuild OG images or host dynamic OG elsewhere.

### 6. Migration effort (from the repo)

| Surface | What moves | Effort drivers |
| --- | --- | --- |
| Blog posts | 6 essays in `content/essays/` + metadata/slides/audio in `blogPosts.ts` + `public/audio/pages/blog-*.mp3` | Map labeled paragraphs (`[Decision]`, etc.) and slide decks; keep `LabeledBody` behavior |
| `/time` TMAY | `LeadersEssay` / `LeadersHero` / `LeadersAudio` + `public/audio/time-note.mp3` | Today not markdown; either keep React or extract to CMS fields + audio asset |
| Homepage | Still largely bespoke motion (`ScrollMorphAvatar`, theme overrides) | Poor first CMS candidate; leave coded |
| Redirects | `write-redirects.mjs` + front matter redirects | Preserve during migration |

**Rough effort bands:** git CMS / files **Low**; Sanity/Storyblok/Prismic/Dato/Hygraph **Medium**; Payload/Strapi/Directus/Builder (plus static-export tension) **Medium-High**; build-our-own productization **High**.

---

## Fit notes specific to lindowlabs.dev

1. **Static export + Pages** favors git-based or build-time headless fetch with webhooks to rebuild.
2. **Audio** is first-class (`PageAudioPlayer`, per-post `audioSrc`). Any CMS must treat MP3 as a first-class asset, not an afterthought.
3. **PR content culture** (`content/README.md`) aligns with Tina/Keystatic/Decap/files.
4. **Design-follows-message** goal (sibling docs) needs **intent metadata + block schema**, which every option can store; the resolver lives in `site/` regardless of vendor.
5. **Budget:** options whose *necessary* tier is **$99+ / mo** to meet Clair's set are flagged above (Contentful Lite, Storyblok Growth, Hygraph Growth, Directus Cloud add-on, Dato Professional, and stacked Strapi Cloud+Growth).

---

## Sources (URLs + access date)

| Vendor | Pricing / primary | Accessed |
| --- | --- | --- |
| Sanity | https://www.sanity.io/pricing | 2026-10-02 |
| Contentful | https://www.contentful.com/pricing/ | 2026-10-02 |
| Payload | https://payloadcms.com/get-started | 2026-10-02 |
| Storyblok | https://www.storyblok.com/pricing | 2026-10-02 |
| Builder.io | https://www.builder.io/pricing | 2026-10-02 |
| TinaCMS | https://tina.io/pricing | 2026-10-02 |
| Keystatic | https://keystatic.com/docs/cloud | 2026-10-02 |
| Prismic | https://prismic.io/pricing | 2026-10-02 |
| Hygraph | https://hygraph.com/pricing | 2026-10-02 |
| Decap | https://decapcms.org/ ; https://decapcms.org/turbo/ | 2026-10-02 |
| Directus | https://www.directus.com/pricing | 2026-10-02 |
| Strapi | https://strapi.io/pricing-cms ; https://strapi.io/pricing-cloud | 2026-10-02 |
| DatoCMS | https://www.datocms.com/pricing | 2026-10-02 |
| Sanity Agent Actions | https://www.sanity.io/docs/agent-actions/operations | 2026-10-02 |

Secondary USD cross-checks for Contentful Lite used industry pricing mirrors; treat on-page EUR as authoritative where USD is absent (**unverified exact USD** without currency switcher).

---

## Explicit non-goals of this doc

- No vendor recommendation.
- No site code changes.
- No permanent redirects added.
- No SLA percentage shopping (uptime rows exist on some paid plans; ignored as a decision driver here).
