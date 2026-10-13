/**
 * Outreach-style query helpers for click logging.
 * Prefer person-identifying params first (utm_content / tag), then campaign.
 */

const TAG_KEYS = [
  "utm_content",
  "tag",
  "utm_term",
  "utm_campaign",
  "utm_source",
] as const;

/** Query keys surfaced as utm_* / tag values in the log line. */
const UTM_AND_TAG_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "tag",
] as const;

export const UNTAGGED = "(untagged)";

/** Normalize raw location.search or a bare query string. */
export function normalizeQuery(raw: string): string {
  if (!raw) return "";
  return raw.startsWith("?") ? raw.slice(1) : raw;
}

/** Extract present utm_* and tag values from a query string. */
export function extractUtmAndTag(query: string): Record<string, string> {
  const q = normalizeQuery(query);
  const out: Record<string, string> = {};
  if (!q) return out;
  try {
    const params = new URLSearchParams(q);
    for (const key of UTM_AND_TAG_KEYS) {
      const value = params.get(key)?.trim();
      if (value) out[key] = value;
    }
  } catch {
    // fall through
  }
  return out;
}

/** Extract the preferred display/group tag from a query string. */
export function extractTag(query: string): string {
  const q = normalizeQuery(query);
  if (!q) return UNTAGGED;
  try {
    const params = new URLSearchParams(q);
    for (const key of TAG_KEYS) {
      const value = params.get(key)?.trim();
      if (value) return value;
    }
  } catch {
    // fall through
  }
  return UNTAGGED;
}
