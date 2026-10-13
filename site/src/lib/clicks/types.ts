/** One recorded page view for outreach click logging. */

export type ClickEvent = {
  /** Opaque id (timestamp + random). */
  id: string;
  /** ISO-8601 UTC timestamp. */
  ts: string;
  /** Pathname only, e.g. `/resume`. */
  path: string;
  /** Full query string without leading `?`. Empty when none. */
  query: string;
  /** Document referrer URL (may be empty). */
  referrer: string;
  /** Client user-agent string. */
  userAgent: string;
  /**
   * Grouping key derived from query tags (utm_content, tag, etc.).
   * `(untagged)` when no known tag is present.
   */
  tag: string;
};

export type ClickTagGroup = {
  tag: string;
  /** Newest first within the group. */
  visits: ClickEvent[];
};
