/**
 * Apollo-managed outreach list for the private /learning dashboard.
 * Beacon (or another bot) will keep this in sync later. Until then the list
 * ships empty and the UI shows an empty state. Do not call Apollo from the site.
 */

export type OutreachItem = {
  /** Display name for the person or company. */
  name: string;
  /** Optional company or context line. */
  company?: string;
  /** Optional next step or status note. */
  note?: string;
  /** Optional outbound channel hint (email, linkedin, etc.). */
  channel?: string;
};

/** Current outreach rows. Starts empty; bots append later. */
export const outreachList: OutreachItem[] = [];
