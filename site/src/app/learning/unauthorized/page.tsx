import type { Metadata } from "next";
import { LearningUnauthorized } from "@/components/learning/LearningDashboard";
import { getLearningAccess } from "@/lib/auth/getLearningAccess";

export const metadata: Metadata = {
  title: "Not authorized | Lindow Labs Learning",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function LearningUnauthorizedPage() {
  const access = await getLearningAccess();
  const email =
    access.status === "unauthorized" || access.status === "ok"
      ? access.email
      : null;
  return <LearningUnauthorized email={email} />;
}
