import type { Metadata } from "next";
import {
  LearningNotConfigured,
  LearningUnauthorized,
} from "@/components/learning/LearningDashboard";
import {
  CurriculumDashboard,
  ReadingPlanNotConnected,
} from "@/components/learning/CurriculumUI";
import LearningSignIn from "@/components/learning/LearningSignIn";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";
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
  if (gate.status === "unauthorized") {
    return <LearningUnauthorized phone={gate.phone} />;
  }
  if (gate.status === "signed-out") {
    return <LearningSignIn />;
  }

  if (gate.curriculum.status === "not-connected") {
    return <ReadingPlanNotConnected />;
  }

  return <CurriculumDashboard curriculum={gate.curriculum.curriculum} />;
}
