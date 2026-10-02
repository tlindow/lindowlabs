# GitHub Copilot Instructions for Tyler Lindow's Repository

This repository powers **Tyler Lindow's workspace**, organized into three core pillars:
1. **`exercises/`** - Hands-on technical exercises and tutorials exclusively for personal learning and deep practice.
2. **`content/`** - Personal journal entries, essays, and published post repository (public and private drafts).
3. **`site/`** - The living Next.js application powering Tyler's personal website and interactive portfolio.

Full project rules for Cursor agents live in [`AGENTS.md`](../AGENTS.md). Shared failure history lives in [`docs/loop-log.md`](../docs/loop-log.md).

## Outer loop (CI / post-push)

You own **post-push CI fix-ups**. Cursor agents own the **pre-push inner loop**. Communicate only through the repo.

### Before opening a CI fix PR

- Read `docs/loop-log.md`. If the same failure type already has prevention (or an open/inner-loop fix in progress), **do not open a duplicate fix PR**.
- Leave existing Copilot fix PRs alone unless you are the author updating your own work.

### When you open a CI fix PR

1. Add one line to `docs/loop-log.md`: date, `outer: Copilot`, failure type, this PR number, and prevention (`none yet` if you only fixed the symptom).
2. In the PR body, include a short **prevention idea for the inner loop** (what Cursor agents should run or where shared helpers should live) so the next pre-push checklist can absorb it.
3. Prefer minimal copy/behavior changes. Do not add permanent redirects unless asked.

## Repository Structure

- `exercises/` - Hands-on technical learning exercises (for Tyler's personal learning)
  - `exercises/proto-learning/` - Protobuf and gRPC B2B fintech settlement exercises
- `content/` - Journal entries, essay drafts, and master resume source
  - `typing_is_learning.md` - Philosophy essay on typing and hands-on coding
  - `resume.md` - Canonical resume markdown
- `site/` - Next.js 16 (App Router) frontend application
  - `src/app/` - Pages (`/`, `/brand`, `/resume`, `/blog`), layout, and global styles
  - `src/components/` - Feature sections (Navbar, Hero, About, Portfolio, Speaking, Mentoring, Content, TechStack, Footer)
  - `src/components/animations/` - Composable Framer Motion building blocks
  - `src/components/brand/` - Brand marks gallery, previews, and download logic
  - `public/` - Static assets, brand SVGs, PNG exports, and downloadable resume files
- `.github/workflows/` - CI/CD workflows for GitHub Pages static deployments

## Core Tech Stack & Patterns

- **Next.js 16** with static export (`output: "export"` in `next.config.ts`)
- **React 19**
- **TypeScript** (Strict mode)
- **Tailwind CSS 4**
- **Framer Motion** for scroll-triggered reveals, spring physics, and micro-interactions
- **lucide-react** for iconography

## Design & Code Conventions

1. **Aesthetic Philosophy**: Warm, editorial, and tactile. Clean typography with physics-based motion.
2. **Animation Architecture**: Client components (`"use client"`) using reusable primitives in `src/components/animations/`.
3. **Static Export Friendly**: Do not use server-only features that break `output: "export"`.
4. **Shared helpers**: Keep pure helpers (formatters, labels) in `site/src/data/` or `site/src/lib/`, not in `"use client"` component files.
5. **Learning Exercises**: When working on `exercises/`, foster active typing, scaffolding, and pedagogical depth.
6. **PR-Based Content Publishing**: The `content/` directory is managed via Pull Requests so new content broadcasts as a GitHub activity feed.
