import RetreatPage from "@/components/retreat/RetreatPage";
import { engineeringLeadersPageMetadata } from "@/data/engineeringLeadersPage";

export const metadata = engineeringLeadersPageMetadata;

/**
 * Engineering-leaders leaf: homepage-hero sibling (coin + play morph into nav),
 * shared credentials strip, leader sections, Calendly connect Let's talk CTA.
 */
export default function EngineeringLeadersRoute() {
  return <RetreatPage />;
}
