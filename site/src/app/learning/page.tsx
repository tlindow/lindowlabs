import type { Metadata } from "next";
import LearningPage from "@/components/learning/LearningPage";

export const metadata: Metadata = {
  title: "Learning | Tyler Lindow",
  description: "What I'm reading and practicing right now.",
  openGraph: {
    title: "Learning | Tyler Lindow",
    description: "What I'm reading and practicing right now.",
    url: "https://lindowlabs.dev/learning",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learning | Tyler Lindow",
    description: "What I'm reading and practicing right now.",
  },
};

export default function LearningRoute() {
  return <LearningPage />;
}
