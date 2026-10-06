import type { Metadata } from "next";
import { LearningUnauthorized } from "@/components/learning/LearningDashboard";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Not authorized | Lindow Labs Learning",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function LearningUnauthorizedPage() {
  const session = await auth();
  return <LearningUnauthorized email={session?.user?.email ?? null} />;
}
