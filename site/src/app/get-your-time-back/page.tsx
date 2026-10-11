import RetreatPage from "@/components/retreat/RetreatPage";
import { retreatPageMetadata } from "@/data/retreatPage";

export const metadata = retreatPageMetadata;

/** Standalone retreat leaf: full-bleed waveform, then Calendly after audio ends. */
export default function GetYourTimeBackRoute() {
  return <RetreatPage />;
}
