import type { Metadata } from "next";
import VisitorsPage from "@/components/visitors/VisitorsPage";

export const metadata: Metadata = {
  title: "Visitors | Tyler Lindow",
  description:
    "How people find and use this site: where they come from, what they read, and how many go on to book time.",
  openGraph: {
    title: "Visitors | Tyler Lindow",
    description:
      "How people find and use this site: where they come from, what they read, and how many go on to book time.",
    url: "https://lindowlabs.dev/visitors",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visitors | Tyler Lindow",
    description:
      "How people find and use this site: where they come from, what they read, and how many go on to book time.",
  },
};

export default function VisitorsRoute() {
  return <VisitorsPage />;
}
