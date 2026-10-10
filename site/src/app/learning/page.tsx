import type { Metadata } from "next";
import { cookies } from "next/headers";
import { LearningNotConfigured } from "@/components/learning/LearningDashboard";
import {
  CurriculumDashboard,
  LearningStarterEmpty,
} from "@/components/learning/CurriculumUI";
import LearningSignIn from "@/components/learning/LearningSignIn";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";
import { readingCurriculumForUser } from "@/lib/learning/learningScope";
import { loadLearningGate } from "@/lib/learning/loadLearningPage";
import {
  PLAYLIST_PROGRESS_COOKIE,
  parsePlaylistProgressCookie,
} from "@/lib/learning/playlistProgress";

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

  const jar = await cookies();
  const initialProgress = parsePlaylistProgressCookie(
    jar.get(PLAYLIST_PROGRESS_COOKIE)?.value,
    gate.userId
  );

  return (
    <CurriculumDashboard
      readingItems={readingItems}
      initialProgress={initialProgress}
      showSignOut={!gate.bypass}
    />
  );
}
