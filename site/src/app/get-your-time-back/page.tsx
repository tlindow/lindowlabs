import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import LeadersHero from "@/components/leaders/LeadersHero";
import LeadersEssay from "@/components/leaders/LeadersEssay";

const PAGE_TITLE =
  "Get your time back | 30 minutes with a fintech engineering manager";
const PAGE_DESCRIPTION =
  "30 focused minutes with a fintech engineering manager. Bring the integration, incident or team problem that's eating your week.";

const HERO_SUBTITLE =
  "A working session with a fintech engineering manager. Bring the integration, incident or team problem that's eating your week.";

const ESSAY_PARAGRAPHS = [
  "My name is Tyler Lindow. I'm an engineering manager for fintech platforms and merchant and partner integrations. I spent 6+ years at Affirm, most recently leading the engineering team that owned Merchant Portal, and then founded Beginner Work.",
  "In 30 minutes, we pick one thing that's costing you time, like a partner integration that keeps slipping, an on-call rotation that wears your team out, or a reliability gap nobody owns. You leave with a next step you can act on this week.",
  "If that sounds useful, choose a time above. And if your team needs an engineering manager, say so.",
];

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: "https://lindowlabs.dev/get-your-time-back",
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
          <LeadersHero subtitle={HERO_SUBTITLE} />
          <LeadersEssay paragraphs={ESSAY_PARAGRAPHS} />
        </main>
      </div>
    </div>
  );
}
