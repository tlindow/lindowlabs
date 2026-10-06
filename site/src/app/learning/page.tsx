import type { Metadata } from "next";
import LearningDashboard, {
  LearningNotConfigured,
  LearningUnauthorized,
} from "@/components/learning/LearningDashboard";
import LearningSignIn from "@/components/learning/LearningSignIn";
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
    return <LearningSignIn />;
  }

  return <LearningDashboard email={access.email} bypass={access.bypass} />;
}
