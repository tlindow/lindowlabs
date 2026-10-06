/**
 * Parse Notion Reading plan blocks into courses / lessons / practice.
 * Never invents content: unparseable items surface as raw text.
 */

import {
  blocksToLines,
  type NotionBlock,
} from "@/lib/learning/notionBlocks";
import {
  courseKeyFromTitle,
  lessonKeyFromChapter,
  lessonKeyFromLabel,
} from "@/lib/learning/normalize";
import type {
  ParsedCourse,
  ParsedLessonStub,
  ParsedPractice,
  ParsedReadingPlan,
} from "@/lib/learning/types";

const EXCLUDED_HEADINGS = new Set([
  "sealed",
  "sealed (no reading needed)",
  "already read",
  "dropped",
]);

function headingKey(text: string): string {
  return text
    .replace(/^#+\s*/, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isExcludedSection(heading: string): boolean {
  const key = headingKey(heading);
  if (EXCLUDED_HEADINGS.has(key)) return true;
  // "Sealed (no reading needed)" etc.
  for (const ex of EXCLUDED_HEADINGS) {
    if (key.startsWith(ex)) return true;
  }
  return false;
}

/** Extract bold-ish title: text before first "(" if present, else first clause. */
function splitTitleAuthor(raw: string): {
  title: string;
  author: string | null;
  rest: string;
} {
  // Pattern: Title (Author…). rest  OR  Title (Author, free at url). rest
  const m = raw.match(/^(.+?)\s*\(([^)]+)\)\s*[.:]?\s*(.*)$/);
  if (m) {
    const title = m[1].replace(/^\*+|\*+$/g, "").trim();
    const paren = m[2].trim();
    // Author is the part before ", free at" or first comma-ish clause for TTFT
    let author = paren;
    const freeAt = paren.match(/^(.*?),\s*free at\b/i);
    if (freeAt) author = freeAt[1].trim();
    return { title, author, rest: m[3].trim() };
  }
  const title = raw.split(/[.:]/)[0]?.trim() || raw.trim();
  return { title, author: null, rest: raw.slice(title.length).replace(/^[.:]\s*/, "") };
}

function extractWhy(text: string): { body: string; why: string | null } {
  const idx = text.search(/\bBacks\b/);
  if (idx === -1) return { body: text.trim(), why: null };
  return {
    body: text.slice(0, idx).trim().replace(/[.;]\s*$/, ""),
    why: text.slice(idx).trim(),
  };
}

/** Parse "Ch 3, 4, 6, 14 and 15" into chapter numbers. */
export function parseChapterList(scope: string): number[] {
  const m = scope.match(/\bch(?:apters?)?\s+([0-9,\sand]+)/i);
  if (!m) return [];
  const nums = [...m[1].matchAll(/\d+/g)].map((x) => Number(x[0]));
  return [...new Set(nums)].sort((a, b) => a - b);
}

function parseCurrentlyReading(text: string): ParsedReadingPlan["currentlyReading"] {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const { title } = splitTitleAuthor(trimmed);
  const ch = trimmed.match(/\bch(?:apter)?\s*(\d+)\b/i);
  return {
    courseTitle: title || null,
    lessonLabel: ch ? `Ch ${ch[1]}` : null,
    pageText: trimmed,
  };
}

function lessonsFromScope(
  scope: string,
  links: { text: string; url: string }[],
  currently: ParsedReadingPlan["currentlyReading"],
  courseTitle: string
): ParsedLessonStub[] {
  const isCurrentCourse =
    currently?.courseTitle &&
    courseKeyFromTitle(currently.courseTitle) === courseKeyFromTitle(courseTitle);

  // Cover to cover: page names Ch 1 done / on Ch 2; expand later via overlay.
  if (/\bcover to cover\b/i.test(scope)) {
    const doneMatch = scope.match(/\bch(?:apter)?\s*(\d+)\s*done\b/i);
    const onMatch = scope.match(/\bon\s+ch(?:apter)?\s*(\d+)\b/i);
    const doneN = doneMatch ? Number(doneMatch[1]) : null;
    const onN = onMatch
      ? Number(onMatch[1])
      : currently?.lessonLabel
        ? Number(currently.lessonLabel.replace(/\D/g, "")) || null
        : null;

    const stubs: ParsedLessonStub[] = [];
    // At minimum emit done + current chapter stubs from the page.
    const named = new Set<number>();
    if (doneN) named.add(doneN);
    if (onN) named.add(onN);
    // Signal cover-to-cover with a marker lesson list; overlay expands.
    if (named.size === 0) {
      stubs.push({
        chapterNumber: null,
        label: "Cover to cover",
        url: null,
        status: isCurrentCourse ? "current" : "pending",
        key: "cover",
      });
      return stubs;
    }
    for (const n of [...named].sort((a, b) => a - b)) {
      let status: ParsedLessonStub["status"] = "pending";
      if (doneN === n) status = "done";
      else if (onN === n || (isCurrentCourse && currently?.lessonLabel && lessonKeyFromChapter(n) === lessonKeyFromLabel(currently.lessonLabel, null))) {
        status = "current";
      }
      stubs.push({
        chapterNumber: n,
        label: `Ch ${n}`,
        url: null,
        status,
        key: lessonKeyFromChapter(n),
      });
    }
    // Marker so merge knows to expand full chapter list from overlay.
    stubs.push({
      chapterNumber: null,
      label: "Cover to cover",
      url: null,
      status: "pending",
      key: "cover",
    });
    return stubs;
  }

  const chapters = parseChapterList(scope);
  if (chapters.length) {
    return chapters.map((n) => ({
      chapterNumber: n,
      label: `Ch ${n}`,
      url: null,
      status: "pending" as const,
      key: lessonKeyFromChapter(n),
    }));
  }

  if (links.length) {
    return links.map((link, i) => ({
      chapterNumber: null,
      label: link.text,
      url: link.url,
      status: "pending" as const,
      key: lessonKeyFromLabel(link.text, link.url) || `lesson-${i + 1}`,
    }));
  }

  // Single whole-work lesson (e.g. essay with URL in scope, no sections).
  if (/\bno sections\b/i.test(scope) || scope.length < 80) {
    const url =
      links[0]?.url ||
      scope.match(/https?:\/\/[^\s)]+/)?.[0] ||
      null;
    return [
      {
        chapterNumber: null,
        label: "Whole work",
        url,
        status: "pending",
        key: "essay",
      },
    ];
  }

  return [];
}

function parseReadingOrderItem(
  order: number,
  text: string,
  links: { text: string; url: string }[],
  currently: ParsedReadingPlan["currentlyReading"]
): ParsedCourse | { parseFailed: true; order: number; rawText: string } {
  const cleaned = text.replace(/^\d+\.\s*/, "").trim();
  if (!cleaned) {
    return { parseFailed: true, order, rawText: text };
  }

  const { title, author, rest } = splitTitleAuthor(cleaned);
  // Require real letters so junk like "???" is not treated as a course title.
  if (!title || !/[a-zA-Z]{2,}/.test(title)) {
    return { parseFailed: true, order, rawText: text };
  }

  const { body, why } = extractWhy(rest || cleaned);
  // Scope is body after title/author; may include chapter list or links.
  let scope = body;
  // If splitTitleAuthor consumed the whole string into title, recover rest from cleaned.
  if (!scope && rest) scope = rest;
  if (!scope) {
    // e.g. "Title (Author). Ch 3, 4." when regex put chapters in rest
    const afterParen = cleaned.replace(/^.+?\)\s*[.:]?\s*/, "");
    scope = extractWhy(afterParen).body;
  }

  const courseUrl =
    links.find((l) => /numinous|ttft/i.test(l.url) || /numinous|ttft/i.test(l.text))
      ?.url || null;

  const lessons = lessonsFromScope(scope, links, currently, title);

  return {
    order,
    title,
    author,
    why,
    scopePageText: scope || null,
    url: courseUrl,
    key: courseKeyFromTitle(title),
    lessons,
  };
}

function parsePracticeItem(text: string): ParsedPractice {
  const { body, why } = extractWhy(text);
  const titleMatch = body.match(/^\*{0,2}([^*.,]+)\*{0,2}/);
  const title = (titleMatch?.[1] || body.split(",")[0] || body).trim();
  const notWritten = /to be added|once written|not written/i.test(text);
  return {
    key: `practice_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`.replace(
      /_+/g,
      "_"
    ),
    title,
    pageText: text.trim(),
    why,
    state: notWritten ? "not_written" : "ready",
    url: null,
  };
}

/**
 * Parse a Notion block list (page children) into a Reading plan structure.
 * Excludes Sealed / Already read / Dropped entirely.
 */
export function parseReadingPlanBlocks(
  blocks: NotionBlock[],
  pageLastEditedAt: string | null = null
): ParsedReadingPlan {
  const lines = blocksToLines(blocks);

  type Section = {
    heading: string;
    items: { type: string; text: string; links: { text: string; url: string }[] }[];
  };

  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    if (line.type === "heading") {
      current = { heading: line.text, items: [] };
      sections.push(current);
      continue;
    }
    if (!current) {
      current = { heading: "", items: [] };
      sections.push(current);
    }
    current.items.push({
      type: line.type,
      text: line.text,
      links: line.links,
    });
  }

  let currentlyReading: ParsedReadingPlan["currentlyReading"] = null;
  const courses: ParsedCourse[] = [];
  const unparsedItems: { order: number; rawText: string }[] = [];
  const practice: ParsedPractice[] = [];

  for (const section of sections) {
    const h = headingKey(section.heading);
    if (isExcludedSection(section.heading)) continue;

    if (h === "currently reading") {
      const text = section.items.map((i) => i.text).join(" ").trim();
      currentlyReading = parseCurrentlyReading(text);
      continue;
    }

    if (h === "reading order") {
      let order = 0;
      for (const item of section.items) {
        if (item.type !== "numbered" && item.type !== "paragraph") continue;
        // Skip empty
        if (!item.text.trim()) continue;
        order += 1;
        const parsed = parseReadingOrderItem(
          order,
          item.text,
          item.links,
          currentlyReading
        );
        if ("parseFailed" in parsed && parsed.parseFailed) {
          const rawText = parsed.rawText ?? item.text;
          unparsedItems.push({ order: parsed.order, rawText });
          courses.push({
            order: parsed.order,
            title: "Couldn't parse",
            author: null,
            why: null,
            scopePageText: null,
            url: null,
            key: `unparsed-${parsed.order}`,
            lessons: [],
            parseFailed: true,
            rawText,
          });
          continue;
        }
        courses.push(parsed);
      }
      continue;
    }

    if (h === "practice") {
      for (const item of section.items) {
        if (item.type !== "bulleted" && item.type !== "numbered") continue;
        if (!item.text.trim()) continue;
        practice.push(parsePracticeItem(item.text));
      }
    }
  }

  // Apply current status onto matching course lessons.
  if (currentlyReading?.courseTitle) {
    const ck = courseKeyFromTitle(currentlyReading.courseTitle);
    for (const course of courses) {
      if (course.key !== ck) continue;
      const lessonKey = currentlyReading.lessonLabel
        ? lessonKeyFromLabel(currentlyReading.lessonLabel, null)
        : null;
      for (const lesson of course.lessons) {
        if (lesson.key === "cover") continue;
        if (lesson.status === "done") continue;
        if (lessonKey && lesson.key === lessonKey) lesson.status = "current";
      }
    }
  }

  return {
    currentlyReading,
    courses,
    practice,
    unparsedItems,
    pageLastEditedAt,
  };
}

/**
 * Parse from a simple markdown-ish fixture string (## headings, numbered list).
 * Used by tests alongside block fixtures.
 */
export function parseReadingPlanMarkdown(
  markdown: string,
  pageLastEditedAt: string | null = null
): ParsedReadingPlan {
  const blocks: NotionBlock[] = [];
  let id = 0;
  for (const rawLine of markdown.split(/\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    id += 1;
    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      const type = `heading_${level}`;
      blocks.push({
        id: `b${id}`,
        type,
        [type]: { rich_text: [{ plain_text: heading[2] }] },
      });
      continue;
    }
    const numbered = line.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      blocks.push({
        id: `b${id}`,
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: richTextFromMarkdownSpan(numbered[1]),
        },
      });
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.*)$/);
    if (bullet) {
      blocks.push({
        id: `b${id}`,
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: richTextFromMarkdownSpan(bullet[1]),
        },
      });
      continue;
    }
    blocks.push({
      id: `b${id}`,
      type: "paragraph",
      paragraph: { rich_text: richTextFromMarkdownSpan(line) },
    });
  }
  return parseReadingPlanBlocks(blocks, pageLastEditedAt);
}

function richTextFromMarkdownSpan(text: string): {
  plain_text: string;
  href?: string;
  text: { content: string; link?: { url: string } };
}[] {
  const out: {
    plain_text: string;
    href?: string;
    text: { content: string; link?: { url: string } };
  }[] = [];
  // Strip **bold** markers for plain_text; extract [label](url)
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|[^*[\]]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const chunk = m[1];
    const link = chunk.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      out.push({
        plain_text: link[1],
        href: link[2],
        text: { content: link[1], link: { url: link[2] } },
      });
      continue;
    }
    const plain = chunk.replace(/\*\*/g, "");
    if (!plain) continue;
    out.push({ plain_text: plain, text: { content: plain } });
  }
  if (!out.length) {
    out.push({
      plain_text: text.replace(/\*\*/g, ""),
      text: { content: text.replace(/\*\*/g, "") },
    });
  }
  return out;
}
