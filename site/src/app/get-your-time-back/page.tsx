import RetreatPage from "@/components/retreat/RetreatPage";
import { retreatPageMetadata } from "@/data/retreatPage";

export const metadata = retreatPageMetadata;

/** Standalone 30-minute engineering leader retreat (audio first, then Calendly). */
export default function GetYourTimeBackRoute() {
  return <RetreatPage />;
}
