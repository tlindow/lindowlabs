/**
 * Minimal Notion block shapes used by the Reading plan parser.
 * Matches the official Notion API block object for the block types we need.
 */

export type NotionRichText = {
  type?: string;
  plain_text?: string;
  href?: string | null;
  text?: { content?: string; link?: { url?: string } | null };
};

export type NotionBlock = {
  id: string;
  type: string;
  has_children?: boolean;
  [key: string]: unknown;
};

export type NotionPageMeta = {
  id: string;
  last_edited_time?: string;
};

export function richTextToPlain(rich: NotionRichText[] | undefined): string {
  if (!rich?.length) return "";
  return rich.map((r) => r.plain_text ?? r.text?.content ?? "").join("");
}

export function richTextToLinks(
  rich: NotionRichText[] | undefined
): { text: string; url: string }[] {
  if (!rich?.length) return [];
  const out: { text: string; url: string }[] = [];
  for (const r of rich) {
    const text = r.plain_text ?? r.text?.content ?? "";
    const url = r.href ?? r.text?.link?.url ?? null;
    if (text && url) out.push({ text, url });
  }
  return out;
}

type BlockPayload = {
  rich_text?: NotionRichText[];
};

function payload(block: NotionBlock): BlockPayload {
  const typed = block[block.type];
  if (typed && typeof typed === "object") return typed as BlockPayload;
  return {};
}

/** Flatten top-level blocks into ordered plain lines with type tags. */
export function blocksToLines(
  blocks: NotionBlock[]
): {
  type: "heading" | "numbered" | "bulleted" | "paragraph" | "other";
  text: string;
  links: { text: string; url: string }[];
  headingLevel?: number;
}[] {
  const lines: {
    type: "heading" | "numbered" | "bulleted" | "paragraph" | "other";
    text: string;
    links: { text: string; url: string }[];
    headingLevel?: number;
  }[] = [];

  for (const block of blocks) {
    const p = payload(block);
    const text = richTextToPlain(p.rich_text).trim();
    const links = richTextToLinks(p.rich_text);
    if (block.type === "heading_1" || block.type === "heading_2" || block.type === "heading_3") {
      const level = Number(block.type.slice(-1));
      lines.push({ type: "heading", text, links, headingLevel: level });
      continue;
    }
    if (block.type === "numbered_list_item") {
      lines.push({ type: "numbered", text, links });
      continue;
    }
    if (block.type === "bulleted_list_item") {
      lines.push({ type: "bulleted", text, links });
      continue;
    }
    if (block.type === "paragraph") {
      if (text) lines.push({ type: "paragraph", text, links });
      continue;
    }
    if (text) lines.push({ type: "other", text, links });
  }
  return lines;
}
