import type { Metadata } from "next";

/** Canonical contact page URL for /schedule-time, /time, and /get-your-time-back. */
export const LEADERS_CANONICAL_URL = "https://lindowlabs.dev/schedule-time";

/** Shared meta for contact routes (canonical + og:url always point at /schedule-time). */
export const LEADERS_PAGE_TITLE = "30 minutes with Tyler Lindow";

export const LEADERS_PAGE_DESCRIPTION =
  "Book 30 minutes with an engineering manager for developer experience, platforms, and merchant and partner integrations.";

export const LEADERS_CALENDLY_URL =
  "https://calendly.com/tylerlindow/get-your-time-back";

export const leadersPageMetadata: Metadata = {
  title: LEADERS_PAGE_TITLE,
  description: LEADERS_PAGE_DESCRIPTION,
  alternates: {
    canonical: LEADERS_CANONICAL_URL,
  },
  openGraph: {
    title: LEADERS_PAGE_TITLE,
    description: LEADERS_PAGE_DESCRIPTION,
    url: LEADERS_CANONICAL_URL,
    siteName: "Lindow Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: LEADERS_PAGE_TITLE,
    description: LEADERS_PAGE_DESCRIPTION,
  },
};
