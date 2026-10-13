import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LearningNotConfigured } from "@/components/learning/LearningDashboard";
import ClicksDashboard from "@/components/learning/ClicksDashboard";
import LearningSignIn from "@/components/learning/LearningSignIn";
import { groupClicksByTag } from "@/lib/clicks/group";
import { listRecentClicks } from "@/lib/clicks/store";
import { getLearningAccess } from "@/lib/auth/getLearningAccess";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";

export const metadata: Metadata = {
  title: "Clicks | Lindow Labs Learning",
  description: "Private outreach click log for Lindow Labs.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    title: "Clicks | Lindow Labs Learning",
    description: "Private outreach click log for Lindow Labs.",
    url: `${LEARNING_DASHBOARD_URL}/clicks`,
    siteName: "Lindow Labs",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function LearningClicksPage() {
  if (process.env.STATIC_EXPORT === "1") {
    return <LearningSignIn staticHost />;
  }

  const access = await getLearningAccess();

  if (access.status === "not-configured") {
    return <LearningNotConfigured />;
  }
  if (access.status === "signed-out") {
    return <LearningSignIn />;
  }

  // Outreach click intel stays owner-only (any phone can OTP, only owner reads).
  if (!access.isOwner) {
    redirect("/learning");
  }

  const { events, store } = await listRecentClicks(200);
  const groups = groupClicksByTag(events);

  return (
    <ClicksDashboard
      groups={groups}
      store={store}
      showSignOut={!access.bypass}
    />
  );
}
