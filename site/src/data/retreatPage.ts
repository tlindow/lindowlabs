import type { Metadata } from "next";

/**
 * Public retreat page: /get-your-time-back.
 * Visual system ported from beginner-work/tinker (see tinkerRetreatTokens.ts).
 */
export const RETREAT_CANONICAL_URL =
  "https://lindowlabs.dev/get-your-time-back";

export const RETREAT_PAGE_TITLE =
  "A 30-minute retreat for engineering leaders";

export const RETREAT_PAGE_DESCRIPTION =
  "Thirty minutes for engineering leaders. Bring one thing eating your team's time. Leave with one next step you can act on this week.";

/**
 * Same Calendly event the contact leaf uses today.
 * Availability is configured in Calendly (synced to Tyler's Google Calendar),
 * not in this repo. Desired windows: Tue-Thu 9 AM-8 PM, Fri 9 AM-3 PM,
 * Sun 11 AM-12 PM PT, no Mondays. Confirm in Calendly if those hold.
 */
export const RETREAT_CALENDLY_URL =
  "https://calendly.com/tylerlindow/get-your-time-back";

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
