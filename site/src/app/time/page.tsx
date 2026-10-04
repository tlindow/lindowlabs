import type { Metadata } from "next";
import LeadersPage from "@/components/leaders/LeadersPage";
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

export default function TimePageRoute() {
  return <LeadersPage />;
}
