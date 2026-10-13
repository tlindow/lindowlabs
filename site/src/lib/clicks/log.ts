/**
 * Server-side page-view click log for Vercel Runtime Logs.
 * No external store: one structured console line per ingest.
 */

import { extractTag, extractUtmAndTag, normalizeQuery } from "@/lib/clicks/tag";

export type ClickLogInput = {
  path: string;
  query?: string;
  referrer?: string;
  userAgent?: string;
  /** Optional override for tests. */
  timestamp?: string;
};

/** Payload shape printed after the `click` prefix. */
export type ClickLogLine = {
  timestamp: string;
  path: string;
  query: string;
  /** Present utm_* / tag query values (empty object when none). */
  utm: Record<string, string>;
  /** Preferred grouping tag (utm_content → tag → …); "(untagged)" when none. */
  tag: string;
  referrer: string;
  userAgent: string;
};

export function buildClickLogLine(input: ClickLogInput): ClickLogLine {
  const path =
    typeof input.path === "string" && input.path.startsWith("/")
      ? input.path.slice(0, 512)
      : "/";
  const query = normalizeQuery(input.query ?? "").slice(0, 2048);
  const utm = extractUtmAndTag(query);
  return {
    timestamp: input.timestamp ?? new Date().toISOString(),
    path,
    query,
    utm,
    tag: extractTag(query),
    referrer: (input.referrer ?? "").slice(0, 2048),
    userAgent: (input.userAgent ?? "").slice(0, 512),
  };
}

/**
 * Emit one Runtime Logs line: `click` + JSON (filterable by "click" in Vercel).
 */
export function emitClickLog(input: ClickLogInput): ClickLogLine {
  const line = buildClickLogLine(input);
  console.log(`click ${JSON.stringify(line)}`);
  return line;
}
