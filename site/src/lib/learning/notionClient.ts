/**
 * Server-only Notion API client for the Reading plan page.
 * Token never leaves the server (NOTION_READING_PLAN_TOKEN).
 */

import type { NotionBlock, NotionPageMeta } from "@/lib/learning/notionBlocks";

const NOTION_VERSION = "2022-06-28";
const API = "https://api.notion.com/v1";

export const DEFAULT_READING_PLAN_PAGE_ID =
  "3f049cb4-8293-8124-82e8-f6e2aa6fc21e";

export function readNotionEnv(): {
  token: string;
  pageId: string;
} | null {
  const token = process.env.NOTION_READING_PLAN_TOKEN?.trim();
  if (!token) return null;
  const pageId =
    process.env.NOTION_READING_PLAN_PAGE_ID?.trim() ||
    DEFAULT_READING_PLAN_PAGE_ID;
  return { token, pageId };
}

async function notionFetch(
  token: string,
  path: string
): Promise<Response> {
  return fetch(`${API}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
}

export async function fetchPageMeta(
  token: string,
  pageId: string
): Promise<NotionPageMeta> {
  const res = await notionFetch(token, `/pages/${pageId}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Notion page ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = (await res.json()) as {
    id: string;
    last_edited_time?: string;
  };
  return { id: json.id, last_edited_time: json.last_edited_time };
}

/** Fetch all direct children blocks (paginated). */
export async function fetchBlockChildren(
  token: string,
  blockId: string
): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;
  do {
    const qs = new URLSearchParams({ page_size: "100" });
    if (cursor) qs.set("start_cursor", cursor);
    const res = await notionFetch(
      token,
      `/blocks/${blockId}/children?${qs.toString()}`
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`Notion blocks ${res.status}: ${body.slice(0, 200)}`);
    }
    const json = (await res.json()) as {
      results: NotionBlock[];
      has_more?: boolean;
      next_cursor?: string | null;
    };
    blocks.push(...(json.results || []));
    cursor = json.has_more && json.next_cursor ? json.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

export async function fetchReadingPlanFromNotion(): Promise<{
  blocks: NotionBlock[];
  pageLastEditedAt: string | null;
}> {
  const env = readNotionEnv();
  if (!env) {
    throw new Error("Notion Reading plan is not configured.");
  }
  const meta = await fetchPageMeta(env.token, env.pageId);
  const blocks = await fetchBlockChildren(env.token, env.pageId);
  return {
    blocks,
    pageLastEditedAt: meta.last_edited_time ?? null,
  };
}
