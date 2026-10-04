import LeadersPage from "@/components/leaders/LeadersPage";
import { leadersPageMetadata } from "@/data/leadersPage";

/** Same contact page as /schedule-time; canonical + og:url point there. No redirect. */
export const metadata = leadersPageMetadata;

export default function TimePageRoute() {
  return <LeadersPage />;
}
