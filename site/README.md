# Tyler Lindow — Personal Website

Built with [Next.js](https://nextjs.org/), TypeScript, and Tailwind CSS.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## Learning dashboard retired

The former `/learning` dashboard, course/lesson pages, and dedicated login and
progress APIs have been removed. Old URLs return the normal site 404. Notion is
the source of truth for learning. No redirect exposes the private Notion page.

Curriculum data, exercises, and Git history are retained for reference. Existing
Stytch accounts, remote data, and browser progress cookies are not deleted.
The public Other books page is unchanged.

Run `npm run check:retired-learning` after a static build to verify that neither
the dashboard nor its login fallback is published.
