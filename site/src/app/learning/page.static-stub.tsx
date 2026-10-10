/**
 * Static stub for /learning during STATIC_EXPORT builds (GitHub Pages + local checks).
 * Points Login traffic at the Vercel SSR host (Stytch + owner desk). Dashboard
 * data is never imported here, so it stays out of the Pages bundle.
 */
import type { Metadata } from "next";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";

export const metadata: Metadata = {
  title: "Learning | Lindow Labs",
  robots: { index: false, follow: false },
};

export default function LearningStaticStub() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center font-mono">
      <meta httpEquiv="refresh" content={`0;url=${LEARNING_DASHBOARD_URL}`} />
      <h1 className="text-2xl font-black tracking-tight text-foreground">
        Continue to Learning
      </h1>
      <p className="mt-3 text-sm text-muted max-w-md">
        SMS sign-in and your curriculum run on the Vercel deploy.
      </p>
      <a
        href={LEARNING_DASHBOARD_URL}
        className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold bg-foreground text-background hover:bg-foreground/90"
      >
        Open Lindow Labs Learning
      </a>
    </main>
  );
}
