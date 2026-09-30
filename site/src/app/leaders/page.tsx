import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LeadersHero from "@/components/leaders/LeadersHero";
import LeadersValueProps from "@/components/leaders/LeadersValueProps";
import LeadersExhibits from "@/components/leaders/LeadersExhibits";
import LeadersHost from "@/components/leaders/LeadersHost";
import LeadersFooterCta from "@/components/leaders/LeadersFooterCta";

const PAGE_TITLE = "Get your spark back | Lindow Labs";
const PAGE_DESCRIPTION =
  "A hands-on museum for engineering managers. Come hang out, explore, and leave feeling like a kid again.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://lindowlabs.dev/leaders",
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
          <LeadersExhibits />
          <LeadersHost />
        </main>
      </div>

      <LeadersFooterCta />
    </div>
  );
}
