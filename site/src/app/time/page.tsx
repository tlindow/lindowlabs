import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LeadersHero from "@/components/leaders/LeadersHero";
import LeadersEssay from "@/components/leaders/LeadersEssay";
import {
  LEADERS_PAGE_DESCRIPTION,
  LEADERS_PAGE_TITLE,
} from "@/data/leadersPage";

export const metadata: Metadata = {
  title: LEADERS_PAGE_TITLE,
  description: LEADERS_PAGE_DESCRIPTION,
  openGraph: {
    title: LEADERS_PAGE_TITLE,
    description: LEADERS_PAGE_DESCRIPTION,
    url: "https://lindowlabs.dev/time",
    siteName: "Lindow Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: LEADERS_PAGE_TITLE,
    description: LEADERS_PAGE_DESCRIPTION,
  },
};

export default function TimePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between overflow-x-clip">
      <Navbar />

      <div className="no-print w-full">
        <main className="w-full">
          <LeadersHero />
          <LeadersEssay />
        </main>
      </div>
    </div>
  );
}
