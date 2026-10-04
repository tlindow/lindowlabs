import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomepageTheme from "@/components/HomepageTheme";
import LeadersHero from "@/components/leaders/LeadersHero";
import LeadersPaths from "@/components/leaders/LeadersPaths";
import LeadersWho from "@/components/leaders/LeadersWho";
import LeadersReach from "@/components/leaders/LeadersReach";

/** Shared contact-page body for /schedule-time, /time, and /get-your-time-back. */
export default function LeadersPage() {
  return (
    <HomepageTheme>
      <Navbar />
      <div className="no-print w-full">
        <main className="w-full">
          <LeadersHero />
          <LeadersPaths />
          <LeadersWho />
          <LeadersReach />
        </main>
      </div>
      <Footer />
    </HomepageTheme>
  );
}
