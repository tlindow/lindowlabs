import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LeadersHero from "@/components/leaders/LeadersHero";
import LeadersEssay from "@/components/leaders/LeadersEssay";

const PAGE_TITLE = "Get your time back | Lindow Labs";
const PAGE_DESCRIPTION =
  "A space to practice saying the honest thing and thinking it through with rigor.";

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
          <LeadersEssay />
        </main>
      </div>
    </div>
  );
}
