## Agent Instructions

This repository contains **Tyler Lindow's workspace**, organized into three core pillars:
1. **`exercises/`** — Hands-on technical exercises and tutorials exclusively for personal learning and deep practice.
2. **`content/`** — Personal journal entries, essays, and polished post repository (public and private drafts).
3. **`site/`** — The living Next.js application powering Tyler's personal website and interactive portfolio.

### Inner vs outer loop

- **Inner loop (Cursor agents):** pre-push work. Catch CI failures locally before anything hits `main`.
- **Outer loop (GitHub Copilot coding agent):** post-push CI fix-ups. See `.github/copilot-instructions.md`.
- Hand off through the repo only. Read [`docs/loop-log.md`](docs/loop-log.md) before starting site work. When you add or change a check, append one line to that log and name the npm script in its `Check` column.

### Pre-push checks (required)

One pipeline, defined once in `site/scripts/check-manifest.mjs` and run by `site/scripts/check.mjs`. `npm run check`, the pre-push hook, PR CI (`.github/workflows/site-check.yml`) and the Pages deploy (`.github/workflows/deploy.yml`) all run it. Add or change a step there, never in a workflow or this file.

```bash
nvm use            # Node from .nvmrc (CI uses the same file)
cd site
npm ci             # also points git at .githooks (pre-push gate)
npx playwright install chromium   # once; every browser check uses Playwright Chromium
npm run check      # every tier; npm run check:fast for the fast tier only
```

Tiers (`node scripts/check.mjs --list` prints the exact steps):

1. **fast**: lint (includes a no-em-dash rule for all `src/` copy), typecheck, test, `check:client-imports`, `check:em-dashes -- --source`, `check:loop-log`
2. **build**: `build:static` (no network: fonts are self-hosted in `src/app/fonts/`)
3. **artifact**: `check:labels`, `check:em-dashes` (built HTML), `check:locations`
4. **browser**: `check:mobile-nav` (reduced motion), `check:profile-photo`, `check:scroll-handoff` (motion on), `check:visual-qa`. Each retries once; a pass on retry prints **FLAKY** and must be fixed by waiting for a settled state (`waitForStable` in `scripts/lib/browser.mjs`), never by adding a sleep.

The committed `.githooks/pre-push` runs the fast tier on every push and the full pipeline when the pushed commits touch `site/` or `docs/loop-log.md`. Do not push with `--no-verify`; PR CI runs the same steps and blocks the merge. If `core.hooksPath` was already set, run `git config core.hooksPath .githooks`.

On failure, `check.mjs` prints the `docs/loop-log.md` rows whose `Check` column names the failing script. Start there.

### Shared helpers (client vs server)

Keep pure helpers (formatters, labels, data) in `site/src/data/` or `site/src/lib/`, not in `"use client"` component files. Server pages may render client components, but must not import non-component exports from them.

### Planning mode

The first prompt of the session should always enter a planning mode, unless otherwise stated.

When planning, treat Markdown notes as the primary source of intent before relying on anything user-facing in the app.

Planning priority order:

1. `content/*.md` entries and essays, especially core philosophy documents and reflections
2. `README.md`, `exercises/README.md`, and other repository Markdown explaining direction or constraints
3. The current frontend implementation in `site/src/components/` and `site/src/app/`

Planning questions should be concise, synthesis-oriented, and based on the underlying thoughts captured in Markdown files. Do not simply restate or overfit to the exact wording currently printed on the frontend unless the task is explicitly about UI copy or presentation.

When there is tension between written reflections and the current UI, assume the Markdown captures broader intent and use the UI as the current expression of that intent rather than the sole source of truth.

### Formation exercises: two-agent workflow

IDL-critique-style exercises (when present) follow a
**two-agent split**, separated by the git push boundary:

1. **Inner-loop agent (pre-push, local, uncommitted work in progress)**
   - Helps Tyler progress through writing the `.proto`/IDL step by step.
   - Never writes the fix directly. Reviews Tyler's in-progress draft against
     open critique points and asks leading questions to close gaps in his own
     words.
   - Operates entirely before anything is pushed to GitHub — this is private
     practice/scratch work, not yet a public artifact.

2. **Outer-loop agent (post-push, translation only)**
   - Activates once Tyler's draft is pushed/committed to GitHub.
   - Translates Tyler's code **back into the original exercise's domain and
     IDL style** (e.g. back into the weather-service wording used by the
     source LLM chat) so he can copy/paste it there.
   - Translates *as-is*, including mistakes — it does not fix, correct, or
     improve Tyler's design during translation. If the draft still has gaps,
     the translation should faithfully carry those same gaps into the
     original domain rather than silently resolving them.
   - Only after producing the faithful translation may it separately note
     (not fix) which open critique points still look unresolved, if asked.

Do not blend these roles: an inner-loop review must not slip into finishing
the design, and an outer-loop translation must not slip into fixing it.

Whenever a domain term used in an exercise file (fintech jargon, abbreviations,
etc.) isn't clear to Tyler, add a short glossary/definition directly in that
file's comments — don't leave clarifications only in chat. Keep the file the
single source of truth for anything needed to work the exercise.

Whenever Tyler asks a clarifying question about an exercise (terminology,
syntax, concepts, "what's the difference between X and Y", hints on how to
proceed, etc.), write the answer as a comment directly in the relevant
exercise file rather than as a chat response. Chat replies should stay brief
and simply point to what was added in the file.

Keep those comments short and placed inline, on or right next to the
specific code line they explain — not as large standalone paragraph blocks.
Prefer a trailing `// short note` on the line itself, or a one-line comment
immediately above it, over multi-paragraph explanations.

Exception: broader "how/why does this technology work" learning questions
(e.g. "what is RPC", "why do enums start at 0") that aren't tied to fixing
a specific TODO/FIXME in the current draft belong in the chat response, not
the exercise file. Reserve file comments for clarifications and hints that
are part of reviewing/unblocking the draft itself.

### Content publishing workflow

The `content/` workspace uses a **PR-based workflow**: 
- Publishing new essays, journal entries, or significant updates is performed via Pull Requests.
- GitHub activity serves as a public "feed" / posting mechanism that followers can discover and read into.
- Agent tasks involving new content drafts should support this PR-centric broadcasting flow.

### Project structure

- `exercises/` — Hands-on technical learning exercises (for Tyler's personal learning)
  - `exercises/api-design/` — OpenAPI by hand for Merchant, Order, and Refund
- `content/` — Journal entries, essay drafts, and master resume source
  - `typing_is_learning.md` — Philosophy essay on typing and hands-on coding
  - `resume.md` — Canonical resume markdown
- `site/` — The Next.js web application
  - `src/app/` — App Router pages and layout
  - `src/components/` — React components (Navbar, Hero, About, Portfolio, Speaking, Mentoring, Content, TechStack, Footer)
  - `src/components/animations/` — Reusable animation components (ScrollReveal, AnimatedText, CountUp, FloatingOrbs, GradientBeam, MagneticButton)
  - `public/` — Static assets (favicon, images, exported documents)
- `README.md` — GitHub profile README and workspace root index

### Environment setup

```bash
cd site
npm install
```

### Running the dev server

```bash
cd site
npm run dev
```

The site runs at `http://localhost:3000`.

### Building for production

```bash
cd site
npm run build
npm start
```

### Linting

```bash
cd site
npm run lint
```

### Testing

- No automated test suite is configured yet.
- Manual testing: run the dev server and verify pages render correctly in the browser.
- Run `npm run build` in the `site/` directory to verify the build passes.

### Tech stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (scroll-triggered animations, gestures, spring physics)
- **lucide-react** (icons)

### Animation architecture

The site uses a composable animation system built on Framer Motion:

- `ScrollReveal` — fade/slide-in on scroll with configurable direction, delay, and blur
- `StaggerContainer` / `StaggerItem` — stagger children animations on scroll
- `AnimatedText` — word-by-word text reveal
- `CountUp` — animated number counter on scroll
- `FloatingOrbs` — ambient drifting gradient blobs with grid overlay
- `GradientBeam` — slow-rotating radial gradient with pulse
- `MagneticButton` — cursor-following spring-based button effect

All animation components are client components (`"use client"`) and are located in `site/src/components/animations/`.
