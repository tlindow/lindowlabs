import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LeadersHero from "@/components/leaders/LeadersHero";
import LeadersValueProps from "@/components/leaders/LeadersValueProps";
import LeadersTopics from "@/components/leaders/LeadersTopics";
import LeadersHost from "@/components/leaders/LeadersHost";
import LeadersFooterCta from "@/components/leaders/LeadersFooterCta";

const PAGE_TITLE = "Get your spark back | Lindow Labs";
const PAGE_DESCRIPTION =
  "Your off-the-record thinking partner. Say the hard stuff out loud and work through it together.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://lindowlabs.dev/spark",
    siteName: "Lindow Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function LeadersPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between overflow-x-clip">
      <Navbar />

      <div className="no-print w-full">
        <main className="w-full">
          <LeadersHero />
          <LeadersValueProps />
          <LeadersTopics />
          <LeadersHost />
        </main>
      </div>

      <LeadersFooterCta />
    </div>
  );
}
