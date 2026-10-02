# CMS vendor research for lindowlabs.dev

## Decision (2026-10-01)

**Choice:** home-rolled CMS (option 15, Build our own).

**Tyler's rationale (verbatim):** "All current enterprise software solutions have too much bloat. Additionally, I want a continuous integration model of content development rather than a time-based release model."

The vendor comparison below stays as the neutral record of what was compared. It does not re-argue the choice.

## Revision 2 (2026-10-01)

| Change | Reviewer |
| --- | --- |
| Decision: home-rolled CMS (option 15); verbatim rationale; continuous content CI note under Build our own | Tyler decision |
| Hosting recommendation recorded for siblings: private repo + Cloudflare Pages Free ($0 added); research rows stay neutral | Team hosting decision |
| Relabel scores as "Scored against Clair's needs" (Bón scored against Clair's six needs; Clair agrees) | Clair |
| Add MCP / connector column (Unverified unless confirmed); git bots author via cloud-agent PRs, not a bare P | Clair, Bón |
| Phone preview as deciding factor: Pages is main-only; every option needs a preview host (called out in summary) | Clair |
| SaaS "one-off pages" Y means once `/for/[slug]` and a rebuild webhook exist | Clair, Bón |
| Link tracking: `utm_source` (linkedin\|email) + `utm_content` = Tinker id; Firebase; no UTM code in site today (Unverified auto-capture) | Clair, Bón |
| Contentful Free "test and learn" terms noted in summary table | Clair |
| Column: company page content kept out of public repo (`tlindow/lindowlabs` is public) | Bón |
| `deploy.yml` is push to main + `workflow_dispatch` only | Bón |
| Static export: rebuild still required; "no code change", not "no deploy" | Bón |
| **TOTAL monthly cost** column (~$10 baseline + plan + preview host + DB/host/storage) | Wallenby |
| Preview host caveat (Vercel Hobby non-commercial; Cloudflare Pages Free limits) with source URLs | Wallenby |
| Pricing corrections for Sanity, Prismic, Builder.io, Storyblok, Hygraph, Contentful (sources checked 2026-10-01) | Wallenby |
| Section: keeping company pages private (private repo, free-host, hosted CMS, ops/security) | Wallenby |

**Access date for Rev 2 pricing corrections: 2026-10-01.** Other feature claims retain access date **2026-10-02** unless a source notes otherwise.  
**Recommend nothing.** This document compares options so Tyler can choose a vendor or build his own.  
**Unverified** items are marked explicitly.

## How the site works today (grounding)

The marketing site is a static Next.js App Router app under `site/`, deployed today to GitHub Pages. **Sibling docs (LL-81 / LL-82) recommend** making the repo private and moving production to **Cloudflare Pages Free** (**$0 added**), waiting on Tyler. That cutover is not done yet; rows below still describe the live GitHub Pages setup unless noted.

| Concern | Current state | Key paths |
| --- | --- | --- |
| Framework | Next.js `16.1.6`, React `19.2.3`, TypeScript `^5` | `site/package.json` |
| Styling | Tailwind CSS `^4`, CSS variables in `@theme inline` | `site/src/app/globals.css` |
| Motion | Framer Motion `^12.35.0` | `site/src/components/animations/` |
| Routing | App Router pages: `/`, `/resume`, `/blog`, `/blog/[slug]`, `/time` (re-exports `/get-your-time-back`), `/brand`, `/modules` | `site/src/app/` |
| Output | `output: "export"` in production (static HTML) | `site/next.config.ts` |
| Deploy | GitHub Actions builds `site/out` and deploys Pages on **push to `main`** and **`workflow_dispatch`** only (no PR preview) | `.github/workflows/deploy.yml` |
| Blog index | Typed array of posts (slug, slides, audio, summary) | `site/src/data/blogPosts.ts` |
| Essay bodies | Labeled markdown paragraphs in repo | `content/essays/*.md`, loaded via `site/src/lib/frontMatter.mjs` |
| TMAY / `/time` | Hardcoded React sections + `public/audio/time-note.mp3` | `site/src/app/time/page.tsx`, `site/src/app/get-your-time-back/page.tsx`, `site/src/components/leaders/` |
| Page audio | `PageAudioPlayer` + `pageAudio` map; blog posts carry optional `audioSrc` | `site/src/components/PageAudioPlayer.tsx`, `site/src/data/pageAudio.ts`, `site/public/audio/` |
| Share metadata | Per-route `metadata` / `generateMetadata`; site default in root layout | `site/src/app/layout.tsx`, blog and page files |
| Analytics | Firebase Analytics + Remote Config; query `?variant=` override. **No `utm_*` helpers in site code today.** Firebase may record `utm_*` on page views on its own (**Unverified** until tested). | `site/src/lib/firebase/`, `site/src/context/AnalyticsProvider.tsx` |
| Checks | `npm run check` runs lint, typecheck, client-import, em-dash, build, labels, locations | `site/package.json` |
| Current run cost | About **$10 / month** for the live stack (domain and light Firebase/ops). GitHub Pages hosting itself is free. | [unverified exact line items] |
| Repo visibility | `tlindow/lindowlabs` is **public**. Any company page content or slug list stored in git is readable on GitHub. | GitHub |

**Static-export implication:** any CMS that assumes a Node server for instant publish must either (a) rebuild static HTML on change, (b) move off `output: "export"`, or (c) use ISR/SSR on a host that supports it. That constraint is shared across vendors. A new `/for/[slug]` page needs a **rebuild** even with a CMS. A CMS publish hook can trigger it but needs a GitHub token (or host deploy hook) stored with the vendor. Phrase this as **"no code change"**, not "no deploy".

**Content volume to migrate:** six essays under `content/essays/`, post metadata and slides in `blogPosts.ts`, page and post MP3s under `site/public/audio/`, and the TMAY page (copy in `LeadersEssay.tsx`, hero in `LeadersHero.tsx`, audio in `LeadersAudio.tsx`).

**Phone preview (deciding factor):** Pages deploys only from `main`. Every option (git and SaaS) needs a **preview host** before Tyler can approve on his phone. See [Preview host caveat](#preview-host-caveat) and the summary table.

---

## Scoring keys

### Clair marketing needs (from Clair)

Scored for each option as **Y** (yes on a usable free or low-cost path for one editor), **P** (partial / needs custom glue), **N** (not native), **$** (possible but paid-only for that need). A single need can be both **P** and **$**.

Scores below are labeled **Scored against Clair's needs** (Bón scored each row against these six needs; Clair agrees with the scores).

1. **Bots as authors** - agents create or update content via API, SDK, or MCP as an *unpublished draft* Tyler publishes. For git options, bot authoring happens through **cloud agents opening PRs**, not a bare partial score alone.
2. **Draft preview links** - private, shareable preview Tyler can open on a phone and approve before live. Requires a preview host for every option while Pages stays main-only.
3. **Pages for one company** - spin up a company or engineering-manager story page without a *code* change; retire later. For SaaS, **Y** means **Y once a `/for/[slug]` route and a rebuild webhook exist** (still a rebuild on static export).
4. **Link tracking** - company-page links carry `utm_source` (`linkedin` or `email`) and `utm_content` = Tinker person or opportunity id (never a name). Works with any vendor via existing Firebase. Site has no UTM code today; automatic `utm_*` capture is **Unverified** until tested.
5. **Link previews** - per-page title, description, Open Graph image for LinkedIn and email unfurls.
6. **Migration effort** - move existing blog posts and the TMAY `/time` page with audio; estimate from the repo (Low / Medium / High).

### Wallenby real costs (from Wallenby)

For each option, capture in the same place as pros:

- Monthly price for **one editor** on a low-traffic site
- **TOTAL monthly cost** for one editor at Tyler's traffic: ~**$10 / mo** baseline + plan + **preview host** + database / hosting / storage. Every option needs a preview host, SaaS included.
- What pushes into a paid tier
- Free-tier limits (seats, API calls, bandwidth, locales, preview environments)
- Which of Clair's needs are **paid-only**
- Hidden costs for self-hosted or build-our-own (hosting, database) in dollars
- Annual contract required? API behind a sales call?
- MCP server or connector installable today (**Unverified** unless confirmed)

**Flag:** options that need a **$99+ / month** plan to meet Tyler's goal (flexible content + design that follows the message) relative to the current ~$10 / month baseline. Marked with **COST FLAG $99+**.

This research **recommends nothing**.

### Preview host caveat

"Free Vercel preview project" is **not safely free** for commercial use.

| Host | Notes | Source (accessed 2026-10-01) |
| --- | --- | --- |
| Vercel Hobby | Non-commercial personal use only. Commercial needs **Pro $20 / user / mo**. | https://vercel.com/docs/limits/fair-use-guidelines |
| Cloudflare Pages Free | Unlimited preview deployments; **500 builds / mo**. | https://developers.cloudflare.com/pages/platform/limits/ |
| Netlify Free | Personal private repos allowed (org private repos need Pro $20 / mo); 300 credits / mo; production deploy costs 15 credits (~20 publishes / mo before bandwidth draws on the same pool). | https://www.netlify.com/pricing/ |

Rough **TOTAL monthly** bands (baseline ~$10 + plan + preview host + infra), from Wallenby:

| Band | Options (approx) |
| --- | --- |
| ~$10 (baseline) + $0 host | **Recommended home-rolled path:** private repo + Cloudflare Pages Free (**$0 added** preview + production). Waiting on Tyler. |
| ~$10-30 | Plain files, Tina, Keystatic, Decap, and free tiers of Sanity, Prismic, Storyblok, Hygraph (with a free or low-cost preview host) |
| ~$50 | Builder.io with private (password-protected) previews |
| ~$15-55 | Payload, Strapi, or Directus self-hosted |
| $310+ | Contentful Lite |
| €149+ on top of baseline | DatoCMS Professional |

---

## Comparison table (summary)

Legend for **One-off pages:** SaaS **Y** = Y once `/for/[slug]` + rebuild webhook exist (still a rebuild; no app-code change). Git options stay **P** (rebuild always).

| Option | Hosting | 1-editor plan | TOTAL $/mo (rough) | COST FLAG $99+? | Preview host gap | Content out of public repo? | MCP / connector | Bots | Preview | One-off pages | Tracking | OG/meta | Migrate | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Sanity | SaaS | Free; Growth $15/seat | ~$10-30 on Free | No for core | Need preview host (~$0-20) | Y (content in Sanity) | **Unverified** | Y (Free Agent Actions) | Y | Y* | P | Y | Medium | Free roles: Admin + Viewer only |
| Contentful | SaaS | Free; Lite ~$300 | Free ~$10-30; Lite **$310+** | **Yes** if leaving Free | Need preview host | Y | **Unverified** | Y | Y | Y* | P | Y | Medium-High | Free "test and learn" may conflict with production |
| Payload | Self-host | $0 + host | ~$15-55 | Hosting can hit $99+ | Need preview host | Y (DB) | **Unverified** | Y | P | Y* | P | Y | Medium-High | Cloud paused for new |
| Storyblok | SaaS | Starter free; Growth $99 | Free ~$10-30; Growth $99+ | **Yes** for Growth | Need preview host; Starter 2 preview URLs | Y | **Unverified** | Y | Y | Y* | P | Y / $ SEO app Growth | Medium | Agents Growth-only; annual $90.75 **Unverified** |
| Builder.io | SaaS | Free; Pro $24; Team $40 | ~$50 with private previews | No at Pro | Private preview = Team only | Y | Built-in MCP from Pro; custom MCP Team | Y / $ credits | Y / $ private | Y* | P | Y | Medium-High | Free/Pro previews are public |
| TinaCMS | Git + Cloud | Free (2 users); Team $24 | ~$10-30 | No | Need preview host (Pages main-only) | N unless private repo or content elsewhere | **Unverified** | P (cloud-agent PRs) | P | P | P | Y | Low-Medium | Public repo exposes pages |
| Keystatic | Git / Cloud | Free; Cloud Pro $10 | ~$10-30 | No | Need preview host | N unless private repo or content elsewhere | **Unverified** | P (cloud-agent PRs) | P | P | P | Y | Low | Public repo exposes pages |
| Prismic | SaaS | Free; Starter $10; Small $25 (annual) | Free ~$10-30 | No until Medium $150 | Need preview host | Y | **Unverified** | Y | Y | Y* | P | Y | Medium | Starter/Small annual-billed; Free locks at caps |
| Hygraph | SaaS | Hobby free; Growth $199 | Free ~$10-30 | **Yes** for Growth | Need preview host | Y | **Unverified** | Y | Y | Y* | P | Y | Medium | Assets count toward 1k Hobby entries |
| Decap | Git OSS | Free; Turbo Pro €19 | ~$10-30 | No | Need preview host | N unless private repo or content elsewhere | **Unverified** | P (cloud-agent PRs) | P | P | P | Y | Low-Medium | Public repo exposes pages |
| Directus | Self-host / Cloud | Core $0; Cloud +$99 | Self-host ~$15-55 | **Yes** for Cloud add-on | Need preview host | Y | **Unverified** | Y | P | Y* | P | Y | Medium-High | |
| Strapi | Self-host / Cloud | Community $0; Cloud $35+ | Self-host ~$15-55 | Cloud+Growth can exceed | Need preview host | Y | **Unverified** | Y | Y / $ live Growth | Y* | P | Y | Medium-High | |
| DatoCMS | SaaS | Free; Pro €149-€199 | Free ~$10-30; Pro €149+ | **Yes** for Professional | Need preview host | Y | **Unverified** | Y | Y | Y* | P | Y | Medium | |
| Plain MDX/files | Repo | $0 (+ Pages free) | ~$10-30 | No | Need preview host | N unless private repo | n/a (agents via PRs) | P (cloud-agent PRs) | P | N / P | P (today) | Y (today) | None | Public repo exposes pages |
| Build our own | Custom | Eng time + host | ~$10-30 if scoped | Can exceed $99 | Need preview host (you design) | Y if designed that way | You build it | Y | Y | Y* | Y | Y | High product work | |

\* SaaS / self-host **Y** = once `/for/[slug]` + rebuild webhook exist.

**Link tracking (Clair #4)** is **P** for almost every CMS: attribution is in the Next.js / Firebase layer, not inside the CMS. Company-page links should carry `utm_source` (`linkedin` or `email`) and `utm_content` = Tinker person or opportunity id. Works with any vendor via existing Firebase. Automatic `utm_*` recording on page views is **Unverified** until tested.

---

## Keeping company pages private

Published pages are always public at their URL. Privacy choices only hide **source** and the **list of slugs**.

**Recommendation for the home-rolled path (waiting on Tyler; see LL-81 / LL-82):** make `tlindow/lindowlabs` **private** on GitHub's free plan, host on **Cloudflare Pages Free** (commercial use allowed, **$0 added**). Replaces GitHub Pages. Required order and URL parity check live in the architecture / tech-spec docs. Public commit history stays readable even after a page is removed; going private later does not help with copies already made, so the repo must be private **before** any company page is added.

| Path | Cost and constraint | Sources (accessed 2026-10-01) |
| --- | --- | --- |
| **Recommended: private repo + Cloudflare Pages Free** | GitHub free + Cloudflare Pages Free. **$0 added**. 500 builds / mo (previews count); unlimited preview deployments. Commercial use allowed. | https://developers.cloudflare.com/pages/platform/limits/ |
| **GitHub Pages from a private repo** | Needs **GitHub Pro** on a personal account: **$4 / mo** or **$48 / yr**. Site is still served publicly. Private Pages needs an org on **Enterprise Cloud ($21 / user / mo)**. Private-repo Actions minutes count against Pro's **3,000 / mo**. | https://docs.github.com/en/get-started/learning-about-github/githubs-plans ; https://github.com/pricing |
| **Private repo on other free hosts** | **Vercel Hobby** deploys private personal repos but is non-commercial only; private-repo commits must be authored by the Hobby owner, which may block bot-authored commits (https://vercel.com/docs/git). **Netlify Free** allows personal private repos (org private repos need Pro $20 / mo); 300 credits / mo; production deploy costs 15 (~20 publishes / mo). | https://vercel.com/docs/git ; https://www.netlify.com/pricing/ |
| **Content outside the repo** | Hosted CMS or separate store; costs in vendor rows. Summary column "Content out of public repo?" = **Y**. | Vendor pricing rows |
| **What privacy actually does** | Repo privacy hides source and the list of slugs (a public repo lists every `/for/` slug). **Noindex** plus a **random slug** is what keeps a live page unlisted. The published page is still public at its URL. | Architecture / tech-spec siblings |
| **Ops / security** | A CMS-triggered rebuild of a GitHub Actions deploy needs a **GitHub token** stored with the vendor: scope to this one repo, give it an expiry, rotate on a schedule (**Wallenby owns rotation**). Host deploy hooks (Vercel, Netlify, Cloudflare) avoid the GitHub token, but the hook URL is itself a secret. Home-rolled on Cloudflare prefers the native Pages git integration. | Wallenby |

With any git-based option (plain files, Tina, Keystatic, Decap, build-our-own writing files), a company page is readable on GitHub if content lives in the public repo, regardless of random URL or noindex. Content must live **outside the public repo**, or the **repo goes private** (recommended path above for home-rolled).

---

## Vendor notes

### 1. Sanity

**Summary.** Headless content platform with a real-time content lake, GROQ, and Sanity Studio. Portable Text for structured rich text. Strong Next.js ecosystem and visual editing / Presentation tool.

**Pros / cons vs criteria**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Portable Text + custom object types; Presentation visual editing; clear component mapping. |
| Fit with stack | Excellent with Next.js; adapters exist. Static export needs rebuild or host change. |
| AI / NL authoring | Agent Actions, Content Agent, and compute are on **Free** (1,000 AI credits / mo). AI Assist, scheduled drafts, and comments are Growth. Bot drafts are not paid-only. |
| Previews | Live preview and visual editing listed on Free and paid. Still need a preview host for phone approve while Pages is main-only. |
| Self-host vs SaaS | Managed content DB (SaaS). Studio can be self-hosted. |
| Lock-in / export | Documents exportable via APIs; Portable Text is structured JSON. |
| DX | Schema-as-code, TypeGen, strong docs. |
| Editor UX | Studio is mature; Presentation for visual context. |
| Performance | CDN API; Free hard caps, Growth overages. |
| Maturity | High; widely used in production. |
| MCP / connector | **Unverified** whether a first-party MCP server is installable today. |

**Wallenby costs (from Wallenby)**  
Sources: [sanity.io/pricing](https://www.sanity.io/pricing) (Rev 2 corrections accessed **2026-10-01**).

- **1 editor low traffic:** Free $0 forever.
- **TOTAL monthly (rough):** ~$10-30 (baseline + Free plan + preview host).
- **Paid push:** Growth at **$15 / seat / month** for Editor roles, private datasets, scheduled drafts, AI Assist, comments/tasks, pay-as-you-go overages.
- **Free limits:** Free has only **Administrator** and **Viewer** roles (not full Editor). 2 public datasets; 10k documents; 1M API CDN req/mo; 250k API req/mo; 100 GB assets and bandwidth; Live Preview included; 1,000 AI credits / mo for Agent Actions / Content Agent / compute.
- **Clair needs paid-only:** AI Assist, scheduled drafts, comments on Growth. Bot drafts via Agent Actions are on Free (drop prior "$" on bots for AI draft path).
- **Hidden costs:** Studio hosting if self-hosted; preview host (~$0-20). No separate DB bill on Free.
- **Annual / sales:** Growth billing **monthly only**, no minimum term. Enterprise custom / sales.
- **COST FLAG $99+?** No for Free/Growth at one seat.

**Scored against Clair's needs:** bots **Y** (Management API + Agent Actions → drafts on Free); preview **Y** (plus preview host); one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y** (fields → `generateMetadata`); migrate **Medium** (map essays + audio assets + slides).

---

### 2. Contentful

**Summary.** Mature SaaS headless CMS with CMA/CDA/CPA, GraphQL, and optional Studio / AI Actions on higher tiers.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Strong structured content; rich text and references; Studio for visual composition on paid/enterprise packaging. |
| Fit with stack | Official Next.js examples; static sites use build-time fetch. |
| AI / NL | AI Actions exist; packaging often paid / Enterprise. MCP-native connector **Unverified**. |
| Previews | Content Preview API on Free. Still need a preview host for phone approve. |
| Self-host vs SaaS | SaaS only for core product. |
| Lock-in / export | CMA export; migration tooling exists; proprietary rich text. |
| DX | Excellent SDKs; heavier model ceremony than git CMS. |
| Editor UX | Polished; roles and workflows scale up. |
| Performance | CDN delivery; Free pauses delivery at quota (changelog Dec 2025). |
| Maturity | Very high. |
| Free plan ToS | Free plan "test and learn" terms may conflict with production use (summary table). |

**Wallenby costs (from Wallenby)**  
Sources: [contentful.com/pricing](https://www.contentful.com/pricing/) (official page fetch blocked in Rev 2); third-party reads from Sept 2026 still show Lite **$300 / mo** with same Free limits. Row stands as **cross-checked** (accessed **2026-10-01** for Rev 2). Mark USD as **cross-checked, not always shown on page**.

- **1 editor:** Free $0 (up to 10 users). Lite paid ~**$300 / mo** or **€300 / mo**.
- **TOTAL monthly (rough):** Free path ~$10-30; Lite path **$310+** (Lite + baseline + preview host).
- **Paid push:** commercial use beyond Free's "test and learn" terms; higher API/CDN; comments, tasks, scheduled publishing called out on Lite packaging in secondary sources.
- **Free limits:** 1 Starter Space; 10 users; 2 roles; 2 locales; 100k API calls/mo; 50 GB CDN; 25 content types; 2 environments; 10k records; no overages (delivery pauses).
- **Clair needs paid-only:** Studio / Personalization / AI Actions packaging often Enterprise or add-on [unverified exact Free AI availability]. Commercial production may conflict with Free ToS.
- **Hidden costs:** none for DB; engineering for sync; preview host.
- **Annual / sales:** Lite self-serve in recent packaging; Enterprise sales. API on Free is self-serve (CMA available).
- **COST FLAG $99+?** **Yes** if Free is not enough for production goals.

**Scored against Clair's needs:** bots **Y** (CMA drafts); preview **Y**; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium-High**.

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
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Sources: [payloadcms.com/get-started](https://payloadcms.com/get-started); community cost writeups noting Cloud pause (accessed 2026-10-02).

- **1 editor:** $0 license.
- **TOTAL monthly (rough):** ~$15-55 (baseline + VPS/DB + preview host).
- **Paid push:** Enterprise support / visual editing / SSO (sales).
- **Free limits:** none on software; infra is yours.
- **Clair needs paid-only:** advanced visual editing / SSO often Enterprise [unverified exact split].
- **Hidden costs (dollars):** small VPS or Fly/Railway ~**$5-25 / mo**; managed Postgres ~**$0-15 / mo** (Neon/Supabase free tiers exist); object storage for MP3s ~**$0-5 / mo**; preview host; your time for backups and upgrades. Can stay under $99. A hardened always-on stack with backups can approach or exceed **$99 / mo**.
- **Annual / sales:** Enterprise sales for support tiers.
- **COST FLAG $99+?** Not required; possible if you over-provision.

**Scored against Clair's needs:** bots **Y** (drafts via Local API / REST); preview **P**; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium-High** (new collections + asset pipeline + keep static export or split services).

---

### 4. Storyblok

**Summary.** Visual component CMS aimed at marketers; stories composed from blocs that map to frontend components.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Visual editor + nestable blok schema; strong component mapping story. |
| Fit with stack | Next.js SDK; works with SSG rebuilds. |
| AI / NL | Agents are **Growth only**. |
| Previews | Visual preview is a core product story. Starter allows only **2 preview URLs**. Still need a preview host for phone approve. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | Stories JSON exportable; blok model is Storyblok-shaped. |
| DX | Good SDKs; schema discipline required. |
| Editor UX | Excellent for non-devs. |
| Performance | CDN; Starter caps API/traffic. |
| Maturity | High in marketing CMS segment. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Source: [storyblok.com/pricing](https://www.storyblok.com/pricing) (Rev 2 corrections accessed **2026-10-01**).

- **1 editor:** Starter **Free** (1 seat, max 2).
- **TOTAL monthly (rough):** Free path ~$10-30; Growth path $99 + baseline + preview host.
- **Paid push:** Growth **$99 / mo** confirmed. The **$90.75 / mo annual** figure is **not on the live page** (**Unverified**).
- **Free limits (Starter):** 1 space; 1 seat (max 2); 100k API req/mo; ~100 GB traffic; 20k stories; 2 locales; **2 preview URLs**.
- **Clair needs paid-only:** SEO Meta Tags app and Agents are **Growth only** (custom OG fields still work on Starter); richer AI / ideation on Growth; higher seat counts.
- **Hidden costs:** rebuild CI minutes on GitHub Actions (usually free at this traffic); preview host.
- **Annual / sales:** Growth self-serve; Premium/Elite sales. Uptime SLA rows appear on paid tiers (do not treat SLA % as a buying reason here).
- **COST FLAG $99+?** **Yes** for Growth. Starter may cover a solo editor if Free limits fit.

**Scored against Clair's needs:** bots **Y** (Management API); preview **Y**; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y** (custom fields on Starter; SEO Meta Tags app **$** Growth); migrate **Medium**.

---

### 5. Builder.io

**Summary.** Visual page builder plus GenAI / agent credits; maps sections to registered React components.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Visual first; components registered from code. |
| Fit with stack | First-class React/Next integration. |
| AI / NL | Agent credits central to pricing. |
| Previews | Built-in preview of visual pages. **Password-protected (private) previews are Team only ($40 / user / mo).** Free and Pro previews are **public**, so private preview is paid-only. |
| Self-host vs SaaS | SaaS content. |
| Lock-in / export | Content in Builder; export paths exist but model is proprietary. |
| DX | Fast for landing pages; can fight highly bespoke motion (Framer scroll morph). |
| Editor UX | Strong for marketers. |
| Performance | Runtime fetch or build-time; watch client JS. |
| Maturity | Established in composable commerce / landing pages. |
| MCP / connector | Built-in MCP servers start at **Pro ($24)**; custom MCP at **Team**. |

**Wallenby costs (from Wallenby)**  
Source: [builder.io/pricing](https://www.builder.io/pricing) (Rev 2 corrections accessed **2026-10-01**).

- **1 editor:** Free $0 (1 user included, up to 5; 60 monthly Agent Credits / 15 daily).
- **TOTAL monthly (rough):** ~**$50** with private (Team) previews; lower if public Free/Pro previews are acceptable.
- **Paid push:** Pro **$24 / user / mo**; Team **$40 / user / mo**; extra 500 credits **$25 / mo**.
- **Free limits:** 1 space; seat caps; agent credit caps. The "15 publishes/month" Free limit is **not on the live page**; dropped here (was previously marked verify / Unverified).
- **Clair needs paid-only:** private / password-protected previews (**$** Team); heavy AI authoring burns Free credits quickly (**$**); built-in MCP from Pro, custom MCP Team.
- **Hidden costs:** possible client-side Builder SDK weight on performance budget; preview host for site shell if needed.
- **Annual / sales:** Pro/Team self-serve; Enterprise sales.
- **COST FLAG $99+?** No at one Pro seat; possible if many seats + credit packs.

**Scored against Clair's needs:** bots **Y** / **$** (APIs + agents); preview **Y** / **$** (private = Team); one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium-High** (rebuild bespoke pages as Builder sections).

---

### 6. TinaCMS

**Summary.** Git-backed CMS with optional Tina Cloud; edits markdown/MDX/JSON in the repo through a contextual UI.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Schema-defined collections over files; MDX components possible. |
| Fit with stack | Natural for Next + markdown already in `content/`. |
| AI / NL | AI features listed on higher Tina Cloud plans ("Coming Soon" / beta language on pricing). Bots author via **cloud agents opening PRs**. |
| Previews | Branch / editorial workflow on paid; Free relies on git + deploy previews you wire. Pages is main-only today, so a preview host is required. |
| Self-host vs SaaS | OSS self-host or Tina Cloud. |
| Lock-in / export | Content stays in git. Very portable. Public repo exposes company pages unless content leaves the repo or the repo goes private. |
| DX | Good for this repo's PR-based content workflow (`content/README.md`). |
| Editor UX | Better than raw git for non-devs; less than Storyblok visual. |
| Performance | Static files; same as today. |
| Maturity | Solid for git CMS; smaller than Contentful/Sanity. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Source: [tina.io/pricing](https://tina.io/pricing) (accessed 2026-10-02).

- **1 editor:** Free $0 (2 users, 2 roles). Self-host also $0.
- **TOTAL monthly (rough):** ~$10-30 (baseline + Free + preview host). Private-repo path adds GitHub Pro ($4 / mo) if using private git (see [Keeping company pages private](#keeping-company-pages-private)).
- **Paid push:** Team **$24 / project / mo** ($290 / year); Team Plus $41; Business $249.
- **Free limits:** 2 users; community support.
- **Clair needs paid-only:** Editorial Workflow (Team Plus+); AI features Business / higher.
- **Hidden costs:** GitHub Actions build minutes; optional auth hosting if self-hosting backend; preview host.
- **Annual / sales:** listed prices are annual-billed project fees; Enterprise custom.
- **COST FLAG $99+?** No until Business.

**Scored against Clair's needs:** bots **P** (cloud-agent PRs / Tina APIs; draft = branch or unpublished commit); preview **P** (needs preview host; site is on Pages today); one-off pages **P** (still a rebuild; no code change if shell exists); tracking **P**; OG **Y**; migrate **Low-Medium**.

---

### 7. Keystatic

**Summary.** Thinkmill OSS CMS over Markdown/JSON/YAML in the repo; Admin UI; Markdoc/MDX; optional Keystatic Cloud for auth and extras.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Collections + document fields; you own rendering. |
| Fit with stack | Aligns with `content/essays` and typed front matter. |
| AI / NL | No first-party NL agent [unverified]. Bots = **cloud agents opening PRs**. |
| Previews | Same as git/SSG story; preview host required. |
| Self-host vs SaaS | Local or GitHub mode free; Cloud optional. |
| Lock-in / export | Files in repo. Public repo exposes company pages unless content leaves the repo or the repo goes private. |
| DX | TypeScript config; Reader API. |
| Editor UX | Clean Admin UI for structured markdown. |
| Performance | Static. |
| Maturity | Younger than Decap/Tina; active Thinkmill backing. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Source: [keystatic.com/docs/cloud](https://keystatic.com/docs/cloud) (accessed 2026-10-02).

- **1 editor:** Free (local or GitHub). Cloud Free up to 3 users/team.
- **TOTAL monthly (rough):** ~$10-30.
- **Paid push:** Cloud Pro **$10 / mo** (+ $5 / user beyond 3) for multiplayer/images extras.
- **Free limits:** 3 Cloud users/team; GitHub auth users need GitHub accounts.
- **Clair needs paid-only:** Cloud Images / multiplayer on Pro.
- **Hidden costs:** none beyond current Pages (~$0 host) plus preview host.
- **Annual / sales:** no; self-serve Cloud.
- **COST FLAG $99+?** No.

**Scored against Clair's needs:** bots **P** (cloud-agent PRs); preview **P**; one-off pages **P**; tracking **P**; OG **Y**; migrate **Low**.

---

### 8. Prismic

**Summary.** Hosted CMS with Slice Machine: slices map to components; Migration API; visual page builder on Free.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Slice-based composition. |
| Fit with stack | Next.js + Slice Machine. |
| AI / NL | [unverified depth of NL agents on Free]. Management API for bots. |
| Previews | Preview links are a documented workflow. Still need a preview host for phone approve. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | Migration API included on Free; slice model is Prismic-shaped. |
| DX | Slice Machine is opinionated. |
| Editor UX | Strong for page assembly. |
| Performance | CDN; Free locks at hard caps. |
| Maturity | High. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Source: [prismic.io/pricing](https://prismic.io/pricing) (Rev 2 corrections accessed **2026-10-01**). Prices per repository.

- **1 editor:** Free $0 (1 user). Starter **$10** and Small **$25** are billed **annually** ($120 / yr and $300 / yr up front), so they carry the **annual-contract** flag.
- **TOTAL monthly (rough):** Free path ~$10-30.
- **Paid push:** more users/locales; Medium **$150 / mo** for larger API/CDN and roles.
- **Free limits:** 1 user; 2 locales; 4M API calls/mo; 100 GB CDN; unlimited documents/types/assets (as published). Free **locks at its caps**; automatic upgrades apply only to **paid** plans at max overage.
- **Clair needs paid-only:** multi-editor collaboration beyond 1 user (Starter/Small).
- **Hidden costs:** low; preview host.
- **Annual / sales:** Starter/Small annual-billed; Enterprise sales.
- **COST FLAG $99+?** No until Medium/Platinum.

**Scored against Clair's needs:** bots **Y**; preview **Y**; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium**.

---

### 9. Hygraph

**Summary.** GraphQL-native headless CMS (ex-GraphCMS) with content stages, remote sources on Growth, AI tokens on plans.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Components + models; less "visual landing builder" than Storyblok. |
| Fit with stack | GraphQL fetch at build time fits static export. |
| AI / NL | AI tokens on Hobby/Growth; depth [partially unverified]. |
| Previews | Live preview listed on Hobby. Still need a preview host for phone approve. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | GraphQL content exportable; proprietary. |
| DX | Strong GraphQL schema story. |
| Editor UX | Solid structured editor. |
| Performance | GraphQL CDN; Hobby hard caps; Hobby **blocks usage at quota**. |
| Maturity | Established mid-market. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Sources: [hygraph.com/pricing](https://hygraph.com/pricing); [hygraph.com/docs/.../update-billing](https://hygraph.com/docs/getting-started/update-billing) (Rev 2 corrections accessed **2026-10-01**).

- **1 editor:** Hobby $0 (3 seats).
- **TOTAL monthly (rough):** Free path ~$10-30.
- **Paid push:** Growth **$199 / mo**.
- **Free limits:** 1k entries; 500k API calls; 100 GB asset traffic; 3 seats; 2 locales; 20 models; 10 components; 2 content stages; 1 environment. **Assets (MP3s, images) count against the 1,000-entry Hobby cap.** Hobby blocks usage at quota.
- **Clair needs paid-only:** remote sources, version retention, higher quotas on Growth.
- **Hidden costs:** overages on Growth ($0.20 per 10k API ops and per GB asset traffic per pricing FAQ language; confirm live); preview host.
- **Annual / sales:** Growth self-serve; Enterprise sales.
- **COST FLAG $99+?** **Yes** for Growth. Hobby may suffice if under 1k entries (counting assets).

**Scored against Clair's needs:** bots **Y**; preview **Y**; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium**.

---

### 10. Decap CMS (formerly Netlify CMS)

**Summary.** MIT git-based admin UI over GitHub/GitLab/etc. Optional Decap Turbo managed proxy.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Config-driven collections; widgets; less typed than Keystatic. |
| Fit with stack | Fits static export + markdown. |
| AI / NL | None first-party. Bots = **cloud agents opening PRs**. |
| Previews | Editorial workflow branches; deploy status on Turbo. Preview host required. |
| Self-host vs SaaS | OSS free; Turbo optional. |
| Lock-in / export | Git files. Public repo exposes company pages unless content leaves the repo or the repo goes private. |
| DX | Simple YAML config; older UI stack. |
| Editor UX | Familiar for static sites; dated vs Sanity Studio. |
| Performance | Static. |
| Maturity | Long history; Turbo is newer. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Sources: [decapcms.org](https://decapcms.org/); [decapcms.org/turbo](https://decapcms.org/turbo/) (accessed 2026-10-02).

- **1 editor:** Free OSS. Turbo Free: 1 site, 1 seat. Turbo Pro **€19 / mo** (tax-included language on site).
- **TOTAL monthly (rough):** ~$10-30.
- **Paid push:** Turbo Pro add-ons (sites, seats, roles).
- **Free limits:** Turbo Free fair-use request caps (e.g. 2,500 requests/day on Free per billing docs).
- **Clair needs paid-only:** managed proxy conveniences on Turbo Pro.
- **Hidden costs:** OAuth app / Git Gateway setup time; CI rebuilds; preview host.
- **Annual / sales:** month-to-month Turbo; Enterprise contact.
- **COST FLAG $99+?** No.

**Scored against Clair's needs:** bots **P** (cloud-agent PRs); preview **P**; one-off pages **P**; tracking **P**; OG **Y**; migrate **Low-Medium**.

---

### 11. Directus

**Summary.** Database wrapper CMS (Studio + API) over Postgres/etc. Core free with seat/collection caps; Cloud hosting add-on.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Relational collections; flexible but not Portable Text-first. |
| Fit with stack | Separate API service; Next fetches at build or runtime. |
| AI / NL | AI Assistant listed on Core marketing. |
| Previews | You build preview routes against draft items; preview host required. |
| Self-host vs SaaS | Both; Cloud optional. |
| Lock-in / export | You own SQL; good portability. |
| DX | Instant API from schema; ops burden if self-hosting. |
| Editor UX | Strong data studio; less page-visual. |
| Performance | Depends on DB/host. |
| Maturity | High in open-data-platform niche. License model evolved (MSCL / grant language). Verify license fit. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Source: [directus.com/pricing](https://www.directus.com/pricing) (accessed 2026-10-02).

- **1 editor:** Core $0 (3 seats hard limit, 25 collections, 5 flows). Self-host free under Core/grant rules.
- **TOTAL monthly (rough):** self-host ~$15-55; Cloud add-on path $99+ baseline.
- **Paid push:** Cloud hosting add-on **$99 / mo**; Team **$499 / mo** annual ($599 monthly) with SSO seats.
- **Free limits:** 3 seats; 25 collections; 5 flows.
- **Clair needs paid-only:** SSO (Team); managed Cloud ($99).
- **Hidden costs:** self-host VPS+DB ~**$5-30 / mo**; preview host.
- **Annual / sales:** Team annual discount; Enterprise sales.
- **COST FLAG $99+?** **Yes** for Cloud add-on or Team. Self-host Core can stay under.

**Scored against Clair's needs:** bots **Y**; preview **P**; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium-High**.

---

### 12. Strapi

**Summary.** Popular Node CMS. Community MIT self-host; Growth CMS license for collaboration features; separate Strapi Cloud hosting plans.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Dynamic zones / components map well to blocks. |
| Fit with stack | Headless REST/GraphQL into Next build. |
| AI / NL | Strapi AI credits on Growth. |
| Previews | Static Preview free on all CMS plans; Live Preview on Growth. Preview host still needed for phone approve against this site. |
| Self-host vs SaaS | Both. |
| Lock-in / export | Transfer/export tools; self-host owns DB. |
| DX | Fast to start; plugin ecosystem. |
| Editor UX | Good admin; marketing visual less than Storyblok. |
| Performance | Self-host or Cloud; Starter sleeps when idle. |
| Maturity | Very high OSS adoption. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Sources: [strapi.io/pricing-cms](https://strapi.io/pricing-cms); [strapi.io/pricing-cloud](https://strapi.io/pricing-cloud) (accessed 2026-10-02).

- **1 editor:** Community CMS $0 + self-host. Cloud Starter **$35 / project / mo** (annual ~$29). Growth CMS **$45 / mo** (3 seats min, +$15/seat). Cloud Pro **$90**.
- **TOTAL monthly (rough):** self-host ~$15-55.
- **Paid push:** Live Preview, Releases, Content History, AI → Growth CMS; always-on / backups → Cloud Pro+.
- **Free limits:** Community unlimited seats on self-host [as published]; Cloud no free plan for new projects (historical Free removed per Strapi blog).
- **Clair needs paid-only:** Live Preview (**$** Growth); Strapi AI (**$** Growth).
- **Hidden costs:** self-host DB+compute ~**$5-30 / mo**; preview host.
- **Annual / sales:** Cloud annual discount; Enterprise sales.
- **COST FLAG $99+?** Cloud Pro is $90 (under); Cloud Pro + Growth CMS can exceed **$99**. Flag when combining.

**Scored against Clair's needs:** bots **Y** (draft & publish via API); preview **Y** static / **$** live; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium-High**.

---

### 13. DatoCMS

**Summary.** SaaS CMS with strong GraphQL, assets/video pipeline, and granular overages on Professional.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Modular blocks + structured models. |
| Fit with stack | Next.js examples; build-time GraphQL. |
| AI / NL | [unverified first-party NL agent depth]. CMA for bots. |
| Previews | Preview links / environments. Preview host still needed for phone approve. |
| Self-host vs SaaS | SaaS. |
| Lock-in / export | Export APIs; proprietary. |
| DX | Excellent GraphQL DX. |
| Editor UX | Polished. |
| Performance | CDN; Free hard-stops. |
| Maturity | High. |
| MCP / connector | **Unverified**. |

**Wallenby costs (from Wallenby)**  
Source: [datocms.com/pricing](https://www.datocms.com/pricing) (accessed 2026-10-02). Prices in €.

- **1 editor:** Free €0 (marketing copy: 2 editors / 300 records / 10 GB traffic / 100k CDA calls). Professional **€149 / mo** annual or **€199 / mo** monthly.
- **TOTAL monthly (rough):** Free path ~$10-30; Professional **€149+** on top of baseline + preview host.
- **Paid push:** Free hard caps / deactivations for inactivity or quota; production traffic usually Professional.
- **Free limits:** 300 records; 10 GB bandwidth; 100k CDA; 25k CMA; 200 MB storage; 3 projects; sandbox environments; history 3 days. Projects can suspend at quota.
- **Clair needs paid-only:** reliable production traffic and collaborator scale (**$** Professional).
- **Hidden costs:** none for infra; watch overage line items on Professional; preview host.
- **Annual / sales:** Professional self-serve; custom contact for large.
- **COST FLAG $99+?** **Yes** for Professional (€149+).

**Scored against Clair's needs:** bots **Y**; preview **Y**; one-off pages **Y** (once `/for/[slug]` + webhook); tracking **P**; OG **Y**; migrate **Medium**.

---

### 14. Plain MDX / files in repo (status quo+)

**Summary.** Keep canonical content in git (`content/`, `site/src/data/*.ts`, `public/audio/`), optionally MDX. Matches the existing PR-as-feed workflow in `content/README.md`.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | You define front matter + block conventions. Maximum control; zero vendor UI. |
| Fit with stack | Exact fit for static export and GitHub Pages. |
| AI / NL | Agents already edit files / open PRs via **cloud agents**; publish = merge. |
| Previews | PR deploy previews need a preview host (Pages is main-only today via `deploy.yml`). |
| Self-host vs SaaS | Neither; just git. |
| Lock-in / export | None. Public repo exposes company page content and slug lists unless content leaves the repo or the repo goes private. |
| DX | Highest for Tyler-as-developer; weakest for non-git editors. |
| Editor UX | VS Code / PRs unless you add Keystatic/Tina/Decap later. |
| Performance | Best case for static. |
| Maturity | Pattern is eternal. |
| MCP / connector | n/a; bot authoring is cloud-agent PRs. |

**Wallenby costs (from Wallenby)**

- **1 editor:** $0 CMS + current ~$10 / mo site ops.
- **TOTAL monthly (rough):** ~$10-30 (baseline + preview host). Private-repo path: + GitHub Pro $4 / mo if using private git for company pages.
- **Paid push:** only if you add a git-CMS UI or paid preview host (Vercel Pro $20 / user / mo for commercial).
- **Free limits:** GitHub and Pages quotas (generous for this traffic).
- **Clair needs paid-only:** none required; phone preview needs a preview host (see [Preview host caveat](#preview-host-caveat)).
- **Hidden costs:** Tyler time; CI minutes; preview host.
- **Annual / sales:** no.
- **COST FLAG $99+?** No.

**Scored against Clair's needs:** bots **P** (cloud-agent PR drafts, not a CMS draft API); preview **P**; one-off pages **N/P** (needs content PR + rebuild; no runtime create; "no code change" once `/for/[slug]` shell exists); tracking **P** (already Firebase; UTM helpers not in site today); OG **Y** (already `generateMetadata`); migrate **None** (already here). Audio and TMAY stay as files.

---

### 15. Build our own

**Summary.** Small content API or file writer + draft store + preview app + publish pipeline tailored to Clair needs and the design-components resolver (see sibling docs).

**Decision note (2026-10-01):** Tyler chose this option. Content changes ship **continuously**: each approved change is merged and deployed on its own, with a preview before it goes live, not batched into scheduled releases. See sibling architecture and tech-spec docs for the assumed continuous content flow. Nothing is built until Tyler approves LL-81 and LL-82.

**Pros / cons**

| Point | Notes |
| --- | --- |
| Flexible vs structured | Exact schemas for intent metadata + blocks. |
| Fit with stack | Can keep static export: bot writes JSON/MD → CI publish. Or add a thin Node preview service. |
| AI / NL | You own the authoring agent contract (MCP, etc.). |
| Previews | Design signed preview tokens + phone-friendly URLs; preview host still required. |
| Self-host vs SaaS | Your choice. |
| Lock-in / export | None if content is git or SQL you own. If writing files into the public repo, same privacy gap as other git options. |
| DX | Full control; you maintain everything. |
| Editor UX | Only as good as you build. |
| Performance | Controllable. |
| Maturity | Starts at zero. |
| MCP / connector | You build / install it. |
| Release model | Continuous integration of content (merge → deploy per change), not a time-based release calendar. |

**Wallenby costs (from Wallenby)**

- **1 editor:** software $0; infra can stay ~**$0-20 / mo** (Pages + free DB tier) if scoped tightly, plus preview host.
- **TOTAL monthly (rough):** ~$10-30 if scoped; higher if overbuilt.
- **Paid push:** managed auth, media CDN, always-on preview, observability.
- **Free limits:** your design.
- **Clair needs paid-only:** none by vendor; maybe paid SMS/auth later.
- **Hidden costs:** engineering hours (largest cost); Postgres ~$0-15; object storage for audio ~$0-5; error tracking; domain already in ~$10 baseline. A "full CMS clone" easily exceeds **$99 / mo** in time-equivalent or infra.
- **Annual / sales:** n/a.
- **COST FLAG $99+?** Avoidable; flag if scope expands to managed multi-tenant CMS.

**Scored against Clair's needs:** all **Y** if built; migrate **High** in product work even if content copy-paste is easy.

---

## Clair needs deep dive (from Clair)

### 1. Bots as authors (unpublished draft)

| Strength | Options |
| --- | --- |
| Native draft APIs + agent products | Sanity (Agent Actions → drafts on Free), Contentful CMA, Storyblok, Prismic, Hygraph, DatoCMS, Strapi, Directus, Payload |
| Git-as-draft (branch/PR via cloud agents) | Tina, Keystatic, Decap, plain files, build-our-own |
| Watch | Builder agent credits; Storyblok Agents on Growth; Sanity AI Assist / scheduled drafts / comments on Growth; Strapi AI on Growth |
| MCP / connector | Mark **Unverified** per vendor unless confirmed. Builder: built-in MCP from Pro, custom MCP at Team. |

### 2. Draft preview links (phone approve)

SaaS preview APIs (Sanity Presentation, Contentful CPA, Storyblok visual, Prismic, Dato, Hygraph) map cleanly, but this site still needs a **preview host** because `.github/workflows/deploy.yml` deploys **main** (and `workflow_dispatch`) only to Pages.  
Git/static path needs **branch preview hosting**. Phone preview is the deciding factor for Tyler. See [Preview host caveat](#preview-host-caveat). Builder private previews are Team-only.

### 3. Pages for one company (no code change)

Requires **content-driven routes** (e.g. `/for/[slug]`) already in the app, then CMS/file entries only.  
None of the vendors remove the need for that route shell in this static Next app. After the shell exists: SaaS **Y** means entries without redeploying *app code* once a rebuild webhook exists. Pure git still triggers a rebuild (not a code change, but still a deploy). Static export always needs a rebuild for a new slug.

### 4. Link tracking

Company-page links carry `utm_source` (`linkedin` or `email`) and `utm_content` = Tinker person or opportunity id (never a name). Keep using lightweight Firebase Analytics (`site/src/lib/firebase/analytics.ts`) plus existing `?variant=` remote-config override. CMS-agnostic. Site has **no UTM code today**; Firebase may record `utm_*` on page views on its own (**Unverified** until tested).

### 5. Link previews (title, description, OG image)

Already patterned: `generateMetadata` on `site/src/app/blog/[slug]/page.tsx`, route metadata on `/time` via `get-your-time-back/page.tsx`, OG image routes like `site/src/app/opengraph-image.tsx`. Any CMS must expose equivalent fields and, for static export, either prebuild OG images or host dynamic OG elsewhere. Storyblok: custom OG fields work on Starter; SEO Meta Tags app is Growth-only.

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

1. **Static export + Pages** favors git-based or build-time headless fetch with webhooks to rebuild. Rebuild ≠ code change.
2. **Audio** is first-class (`PageAudioPlayer`, per-post `audioSrc`). Any CMS must treat MP3 as a first-class asset, not an afterthought. Hygraph Hobby: assets count toward the 1k entry cap.
3. **PR content culture** (`content/README.md`) aligns with Tina/Keystatic/Decap/files, with the public-repo privacy caveat.
4. **Design-follows-message** goal (sibling docs) needs **intent metadata + block schema**, which every option can store; the resolver lives in `site/` regardless of vendor.
5. **Budget:** options whose *necessary* tier is **$99+ / mo** to meet Clair's set are flagged above (Contentful Lite, Storyblok Growth, Hygraph Growth, Directus Cloud add-on, Dato Professional, and stacked Strapi Cloud+Growth). Every option also needs a preview host (see caveat).
6. **Company page privacy:** see [Keeping company pages private](#keeping-company-pages-private).

---

## Sources (URLs + access date)

| Vendor / topic | Pricing / primary | Accessed |
| --- | --- | --- |
| Sanity | https://www.sanity.io/pricing | 2026-10-01 (Rev 2) |
| Contentful | https://www.contentful.com/pricing/ | 2026-10-01 (Rev 2; fetch blocked, third-party cross-check) |
| Payload | https://payloadcms.com/get-started | 2026-10-02 |
| Storyblok | https://www.storyblok.com/pricing | 2026-10-01 (Rev 2) |
| Builder.io | https://www.builder.io/pricing | 2026-10-01 (Rev 2) |
| TinaCMS | https://tina.io/pricing | 2026-10-02 |
| Keystatic | https://keystatic.com/docs/cloud | 2026-10-02 |
| Prismic | https://prismic.io/pricing | 2026-10-01 (Rev 2) |
| Hygraph | https://hygraph.com/pricing | 2026-10-01 (Rev 2) |
| Decap | https://decapcms.org/ ; https://decapcms.org/turbo/ | 2026-10-02 |
| Directus | https://www.directus.com/pricing | 2026-10-02 |
| Strapi | https://strapi.io/pricing-cms ; https://strapi.io/pricing-cloud | 2026-10-02 |
| DatoCMS | https://www.datocms.com/pricing | 2026-10-02 |
| Sanity Agent Actions | https://www.sanity.io/docs/agent-actions/operations | 2026-10-02 |
| Vercel fair use | https://vercel.com/docs/limits/fair-use-guidelines | 2026-10-01 |
| Vercel git | https://vercel.com/docs/git | 2026-10-01 |
| Cloudflare Pages limits | https://developers.cloudflare.com/pages/platform/limits/ | 2026-10-01 |
| Netlify pricing | https://www.netlify.com/pricing/ | 2026-10-01 |
| GitHub plans | https://docs.github.com/en/get-started/learning-about-github/githubs-plans ; https://github.com/pricing | 2026-10-01 |

Secondary USD cross-checks for Contentful Lite used industry pricing mirrors; treat on-page EUR as authoritative where USD is absent (**unverified exact USD** without currency switcher). Official Contentful pricing page fetch was blocked in Rev 2; Lite $300 / mo stands as third-party cross-check from Sept 2026.

---

## Explicit non-goals of this doc

- No vendor recommendation.
- No site code changes.
- No permanent redirects added.
- No SLA percentage shopping (uptime rows exist on some paid plans; ignored as a decision driver here).
