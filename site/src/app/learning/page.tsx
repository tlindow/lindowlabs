import type { Metadata } from "next";
import { LearningNotConfigured } from "@/components/learning/LearningDashboard";
import {
  CurriculumDashboard,
  LearningStarterEmpty,
} from "@/components/learning/CurriculumUI";
import LearningSignIn from "@/components/learning/LearningSignIn";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";
import { readingCurriculumForUser } from "@/lib/learning/learningScope";
import { loadLearningGate } from "@/lib/learning/loadLearningPage";

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

export const dynamic = "force-dynamic";

export default async function LearningPage() {
  if (process.env.STATIC_EXPORT === "1") {
    return <LearningSignIn staticHost />;
  }

  const gate = await loadLearningGate();

  if (gate.status === "not-configured") {
    return <LearningNotConfigured />;
  }
  if (gate.status === "signed-out") {
    return <LearningSignIn />;
  }

  // Per-user scoping: only the owner identity receives Tyler's curriculum.
  const readingItems = readingCurriculumForUser(gate.isOwner);
  if (!gate.isOwner || readingItems.length === 0) {
    return <LearningStarterEmpty showSignOut={!gate.bypass} />;
  }

  return (
    <CurriculumDashboard
      readingItems={readingItems}
      showSignOut={!gate.bypass}
    />
  );
}
