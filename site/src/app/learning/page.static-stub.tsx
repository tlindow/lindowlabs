/**
 * Static stub for /learning during STATIC_EXPORT builds (GitHub Pages + local checks).
 * The real authenticated dashboard only runs on Vercel SSR.
 */
import type { Metadata } from "next";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";

export const metadata: Metadata = {
  title: "Learning | Lindow Labs",
  robots: { index: false, follow: false },
};

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
          This page is only available with Google sign-in at{" "}
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
