import { Redis } from "@upstash/redis";
import { extractTag, normalizeQuery } from "@/lib/clicks/tag";
import type { ClickEvent } from "@/lib/clicks/types";
import { isLearningAuthBypass } from "@/lib/auth/learningAuth";

/** Redis list key. Newest at index 0 (LPUSH). */
const CLICKS_KEY = "ll:clicks";

/** Cap retained events (Hobby Upstash free tier is command-limited). */
const MAX_EVENTS = 2000;

/** True when Upstash / Vercel KV REST env is present. */
export function isClickStoreConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL?.trim() && process.env.KV_REST_API_TOKEN?.trim()
  );
}

function redisClient(): Redis {
  const url = process.env.KV_REST_API_URL?.trim();
  const token = process.env.KV_REST_API_TOKEN?.trim();
  if (!url || !token) {
    throw new Error("click_store_unconfigured");
  }
  return new Redis({ url, token });
}

function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export type RecordClickInput = {
  path: string;
  query?: string;
  referrer?: string;
  userAgent?: string;
  /** Optional override for tests / seeding. */
  ts?: string;
};

/** Build a ClickEvent from a request payload. */
export function buildClickEvent(input: RecordClickInput): ClickEvent {
  const path =
    typeof input.path === "string" && input.path.startsWith("/")
      ? input.path.slice(0, 512)
      : "/";
  const query = normalizeQuery(
    typeof input.query === "string" ? input.query.slice(0, 2048) : ""
  );
  const referrer =
    typeof input.referrer === "string" ? input.referrer.slice(0, 2048) : "";
  const userAgent =
    typeof input.userAgent === "string" ? input.userAgent.slice(0, 512) : "";
  const ts =
    typeof input.ts === "string" && input.ts.length > 0
      ? input.ts
      : new Date().toISOString();

  return {
    id: newId(),
    ts,
    path,
    query,
    referrer,
    userAgent,
    tag: extractTag(query),
  };
}

/** Sample rows for local LEARNING_AUTH_BYPASS screenshots when KV is unset/empty. */
export function sampleClickEvents(): ClickEvent[] {
  const now = Date.now();
  const mk = (
    offsetMs: number,
    path: string,
    query: string,
    referrer: string,
    ua: string
  ): ClickEvent =>
    buildClickEvent({
      path,
      query,
      referrer,
      userAgent: ua,
      ts: new Date(now - offsetMs).toISOString(),
    });

  return [
    mk(
      2 * 60_000,
      "/",
      "utm_source=email&utm_medium=outreach&utm_campaign=em-sd&utm_content=alex-chen",
      "https://mail.google.com/",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15"
    ),
    mk(
      15 * 60_000,
      "/resume",
      "utm_source=email&utm_medium=outreach&utm_campaign=em-sd&utm_content=alex-chen",
      "",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15"
    ),
    mk(
      45 * 60_000,
      "/",
      "utm_source=linkedin&utm_medium=dm&utm_campaign=em-sd&utm_content=jordan-lee",
      "https://www.linkedin.com/",
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15"
    ),
    mk(
      3 * 60 * 60_000,
      "/books-ive-read",
      "utm_source=email&utm_medium=outreach&utm_campaign=warm&tag=sam-okonkwo",
      "",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    ),
    mk(5 * 60 * 60_000, "/", "", "https://t.co/abc", "TwitterBot/1.0"),
  ];
}

/**
 * Append one page-view event to Upstash Redis (`KV_REST_API_*`).
 * No in-memory fallback. Returns null when KV env is missing (ingest no-ops).
 */
export async function recordClick(
  input: RecordClickInput
): Promise<ClickEvent | null> {
  if (!isClickStoreConfigured()) {
    return null;
  }

  const event = buildClickEvent(input);
  const redis = redisClient();
  await redis.lpush(CLICKS_KEY, JSON.stringify(event));
  await redis.ltrim(CLICKS_KEY, 0, MAX_EVENTS - 1);
  return event;
}

function parseStored(raw: unknown): ClickEvent | null {
  try {
    const value =
      typeof raw === "string"
        ? (JSON.parse(raw) as ClickEvent)
        : (raw as ClickEvent);
    if (!value || typeof value !== "object") return null;
    if (typeof value.id !== "string" || typeof value.ts !== "string") {
      return null;
    }
    if (typeof value.path !== "string") return null;
    return {
      id: value.id,
      ts: value.ts,
      path: value.path,
      query: typeof value.query === "string" ? value.query : "",
      referrer: typeof value.referrer === "string" ? value.referrer : "",
      userAgent: typeof value.userAgent === "string" ? value.userAgent : "",
      tag:
        typeof value.tag === "string" && value.tag
          ? value.tag
          : extractTag(typeof value.query === "string" ? value.query : ""),
    };
  } catch {
    return null;
  }
}

/**
 * Recent visits from Upstash, newest first.
 * Local screenshots only: when KV is unset/empty and LEARNING_AUTH_BYPASS=1,
 * return sample tagged rows (never used as a production store).
 */
export async function listRecentClicks(limit = 200): Promise<{
  events: ClickEvent[];
  store: "upstash" | "sample" | "unconfigured";
}> {
  const capped = Math.min(Math.max(limit, 1), 500);

  if (!isClickStoreConfigured()) {
    if (isLearningAuthBypass()) {
      return { events: sampleClickEvents(), store: "sample" };
    }
    return { events: [], store: "unconfigured" };
  }

  const redis = redisClient();
  const rows = await redis.lrange<string>(CLICKS_KEY, 0, capped - 1);
  const events = (rows ?? [])
    .map(parseStored)
    .filter((e): e is ClickEvent => e !== null);

  if (events.length > 0) {
    return { events, store: "upstash" };
  }
  if (isLearningAuthBypass()) {
    return { events: sampleClickEvents(), store: "sample" };
  }
  return { events: [], store: "upstash" };
}
