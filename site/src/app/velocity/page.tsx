import type { Metadata } from "next";
import VelocityPage from "@/components/velocity/VelocityPage";

export const metadata: Metadata = {
  title: "Velocity | Tyler Lindow",
  description:
    "What shipped each week across my repos, and how long each change took to go live.",
  openGraph: {
    title: "Velocity | Tyler Lindow",
    description:
      "What shipped each week across my repos, and how long each change took to go live.",
    url: "https://lindowlabs.dev/velocity",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Velocity | Tyler Lindow",
    description:
      "What shipped each week across my repos, and how long each change took to go live.",
  },
};

export default function VelocityRoute() {
  return <VelocityPage />;
}
