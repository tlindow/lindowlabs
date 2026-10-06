/**
 * Fallback copy of the /learning static stub used by build-static-export.mjs
 * when the live stub file has already been moved into .ssr-stash.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning | Lindow Labs",
  robots: { index: false, follow: false },
};

const LEARNING_DASHBOARD_URL = "https://lindowlabs.dev/learning";

export default function LearningStaticStub() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full space-y-4 text-center">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-muted">
          Lindow Labs Learning
        </p>
        <h1 className="text-2xl font-bold font-mono text-foreground tracking-tight">
          Private dashboard
        </h1>
        <p className="text-sm font-mono text-muted leading-relaxed">
          This page is only available with Stytch sign-in on the Vercel deploy
          of{" "}
          <a
            href={LEARNING_DASHBOARD_URL}
            className="text-foreground underline underline-offset-2"
          >
            {LEARNING_DASHBOARD_URL}
          </a>
          .
        </p>
      </div>
    </main>
  );
}
