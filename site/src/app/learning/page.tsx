import type { Metadata } from "next";
import LearningDashboard, {
  LearningNotConfigured,
  LearningSignedOutHint,
  LearningUnauthorized,
} from "@/components/learning/LearningDashboard";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";
import { getLearningAccess } from "@/lib/auth/getLearningAccess";

export const metadata: Metadata = {
  title: "Learning | Lindow Labs",
  description: "Private Lindow Labs learning dashboard.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Learning | Lindow Labs",
    description: "Private Lindow Labs learning dashboard.",
    url: LEARNING_DASHBOARD_URL,
    siteName: "Lindow Labs",
    type: "website",
  },
};

// SSR on Vercel. Static-export builds stash this route (see build-static-export.mjs).
export const dynamic = "force-dynamic";

export default async function LearningPage() {
  // Static-export CI builds set STATIC_EXPORT=1 and never ship this page live.
  if (process.env.STATIC_EXPORT === "1") {
    return <LearningNotConfigured />;
  }

  const access = await getLearningAccess();

  if (access.status === "not-configured") {
    return <LearningNotConfigured />;
  }

  if (access.status === "unauthorized") {
    return <LearningUnauthorized email={access.email} />;
  }

  if (access.status === "signed-out") {
    return <LearningSignedOutHint />;
  }

  return <LearningDashboard email={access.email} bypass={access.bypass} />;
}
