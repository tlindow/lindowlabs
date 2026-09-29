import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(here, "../../..");
const defaultDir = path.join(repoRoot, "content/essays");
const categoriesPath = path.join(repoRoot, "content/categories.md");

export function loadAllowedLabels(file = categoriesPath) {
  if (!existsSync(file)) {
    throw new Error(`label catalog missing: ${file}`);
  }
  const labels = [];
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^- (.+)$/);
    if (match) labels.push(match[1].trim());
  }
  if (labels.length === 0) {
    throw new Error(`label catalog has no labels: ${file}`);
  }
  return labels;
}

export const LABELS = loadAllowedLabels();

function unquote(raw) {
  const value = raw.trim();
  if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  return value;
}

export function parseFrontMatter(markdown) {
  const result = { redirectFrom: [] };
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return result;

  let mode = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && mode === "redirect") {
      const from = unquote(item[1]);
      if (from) result.redirectFrom.push(from);
      continue;
    }

    const field = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!field) continue;
    mode = field[1] === "redirect_from" ? "redirect" : null;
  }

  return result;
}

export function parseLabeledMarkdown(markdown, allowedLabels = LABELS) {
  const frontMatter = markdown.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  const body = frontMatter ? markdown.slice(frontMatter[0].length) : markdown;
  const lineOffset = frontMatter ? (frontMatter[0].match(/\n/g) || []).length : 0;
  const paragraphs = [];
  const errors = [];

  body.split(/\r?\n/).forEach((line, index) => {
    const lineNo = lineOffset + index + 1;
    if (!line.trim()) return;

    const match = line.match(/^\[([^\]]+)\][ \t]+(\S.*)$/);
    if (!match) {
      // Unlabeled paragraph: a writing gap, not a layout fill-in.
      paragraphs.push({ label: null, text: line.trim(), line: lineNo });
      return;
    }

    const label = match[1];
    const text = match[2];
    if (!allowedLabels.includes(label)) {
      errors.push(`${lineNo}: label is not allowed: ${label}`);
    }
    paragraphs.push({ label, text, line: lineNo });
  });

  return { paragraphs, errors };
}

function splitQuestionRun(text) {
  const matches = [...text.matchAll(/“[^”]*”/g)];
  if (matches.length < 2) return [text];
  if (matches.map((match) => match[0]).join(" ") !== text) return [text];
  return matches.map((match) => match[0]);
}

export function renderLabeledParagraphs(paragraphs) {
  const rendered = [];
  for (const paragraph of paragraphs) {
    for (const text of splitQuestionRun(paragraph.text)) {
      rendered.push({ label: paragraph.label, text, line: paragraph.line });
    }
  }
  return rendered;
}

export function loadAllPostFrontMatter(dir = defaultDir) {
  if (!existsSync(dir)) return {};
  const posts = {};
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".md")) continue;
    const slug = name.slice(0, -3);
    posts[slug] = parseFrontMatter(readFileSync(path.join(dir, name), "utf8"));
  }
  return posts;
}

export function loadPostFrontMatter(slug, dir = defaultDir) {
  return loadAllPostFrontMatter(dir)[slug] ?? { redirectFrom: [] };
}

export function loadRenderedParagraphs(slug, dir = defaultDir) {
  const file = path.join(dir, `${slug}.md`);
  if (!existsSync(file)) return [];
  const parsed = parseLabeledMarkdown(readFileSync(file, "utf8"));
  return renderLabeledParagraphs(parsed.paragraphs);
}

function slugFromRedirect(value) {
  const trimmed = value.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  if (trimmed.startsWith("blog/")) return trimmed.slice("blog/".length);
  return trimmed;
}

export function findRedirectTarget(slug, dir = defaultDir) {
  const posts = loadAllPostFrontMatter(dir);
  for (const [destination, frontMatter] of Object.entries(posts)) {
    for (const from of frontMatter.redirectFrom) {
      if (slugFromRedirect(from) === slug) return destination;
    }
  }
  return null;
}
