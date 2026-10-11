import type { Metadata } from "next";

/**
 * Public retreat page: /get-your-time-back.
 * Homepage-hero layout sibling on cream paper (not lavender).
 */
export const RETREAT_CANONICAL_URL =
  "https://lindowlabs.dev/get-your-time-back";

export const RETREAT_PAGE_TITLE = "Empowering engineering leaders";

export const RETREAT_PAGE_DESCRIPTION =
  "Get back your time by getting back to a time where engineering was nothing but fun.";

export const RETREAT_KICKER = "30-minute retreat";

export const RETREAT_HEADLINE = "Empowering engineering leaders";

/** One line below the waveform (homepage subtitle style). */
export const RETREAT_DESCRIPTION = RETREAT_PAGE_DESCRIPTION;

/**
 * Always-visible bottom CTA on the retreat leaf → Calendly /connect.
 * Availability is configured in Calendly (synced to Tyler's Google Calendar).
 */
export const RETREAT_CALENDLY_URL =
  "https://calendly.com/tylerlindow/connect";

export const RETREAT_CTA_LABEL = "Let's get in touch";

export const retreatPageMetadata: Metadata = {
  title: RETREAT_PAGE_TITLE,
  description: RETREAT_PAGE_DESCRIPTION,
  alternates: {
    canonical: RETREAT_CANONICAL_URL,
  },
  openGraph: {
    title: RETREAT_PAGE_TITLE,
    description: RETREAT_PAGE_DESCRIPTION,
    url: RETREAT_CANONICAL_URL,
    siteName: "Lindow Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: RETREAT_PAGE_TITLE,
    description: RETREAT_PAGE_DESCRIPTION,
  },
};
