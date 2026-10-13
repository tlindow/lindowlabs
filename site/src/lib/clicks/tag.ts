/**
 * Pick a stable grouping tag from an outreach-style query string.
 * Prefer person-identifying params first (utm_content / tag), then campaign.
 */

const TAG_KEYS = [
  "utm_content",
  "tag",
  "utm_term",
  "utm_campaign",
  "utm_source",
] as const;

export const UNTAGGED = "(untagged)";

/** Normalize raw location.search or a bare query string. */
export function normalizeQuery(raw: string): string {
  if (!raw) return "";
  return raw.startsWith("?") ? raw.slice(1) : raw;
}

/** Extract the display/group tag from a query string. */
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
