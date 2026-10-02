import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// over-index-on-intuition stays excluded until Tyler decides what happens to that post.
const EXCLUDED_POSTS = ["over-index-on-intuition"];

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const repoRoot = path.resolve(siteRoot, "..");
const srcRoot = path.join(siteRoot, "src");
const outDir = path.join(siteRoot, "out");
const appRoot = path.join(srcRoot, "app");
const essaysDir = path.join(repoRoot, "content/essays");
const blogPostsPath = path.join(srcRoot, "data/blogPosts.ts");

const sourceMode = process.argv.includes("--source");

const patterns = [
  { kind: "U+2014", re: /\u2014/g },
  { kind: "&mdash;", re: /&mdash;/gi },
  { kind: "&#8212;", re: /&#8212;/gi },
  { kind: "&#x2014;", re: /&#x2014;/gi },
];

const sourceExts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts"]);

function walk(dir, files, predicate) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files, predicate);
    else if (predicate(full, name)) files.push(full);
  }
}

function resolveImport(fromFile, spec) {
  if (!spec.startsWith("@/") && !spec.startsWith(".")) return null;
  const base = spec.startsWith("@/")
    ? path.join(srcRoot, spec.slice(2))
    : path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    ...[...sourceExts].map((ext) => base + ext),
    ...[...sourceExts].map((ext) => path.join(base, "index" + ext)),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function collectSourceFiles() {
  const entries = [];
  walk(appRoot, entries, (full) => sourceExts.has(path.extname(full)));

  const seen = new Set();
  const queue = [...entries];
  const importRe = /from\s+["']([^"']+)["']/g;

  while (queue.length) {
    const file = queue.pop();
    if (seen.has(file)) continue;
    seen.add(file);
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(importRe)) {
      const resolved = resolveImport(file, match[1]);
      if (resolved && resolved.startsWith(srcRoot)) queue.push(resolved);
    }
  }

  // Published essays that feed the static blog (same exclusion list as HTML check).
  if (existsSync(blogPostsPath)) {
    const postsText = readFileSync(blogPostsPath, "utf8");
    const slugs = [...postsText.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
    for (const slug of slugs) {
      if (EXCLUDED_POSTS.includes(slug)) continue;
      const essay = path.join(essaysDir, `${slug}.md`);
      if (existsSync(essay)) seen.add(essay);
    }
  }

  return [...seen].sort();
}

function excludedSlugFromOut(file) {
  const rel = path.relative(outDir, file).split(path.sep).join("/");
  for (const slug of EXCLUDED_POSTS) {
    if (rel === `blog/${slug}.html` || rel.startsWith(`blog/${slug}/`)) return slug;
  }
  return null;
}

/** Track nearest blogPosts slug so excluded-post bodies can be skipped in source mode. */
function nearestBlogSlug(lines, index) {
  for (let i = index; i >= 0; i -= 1) {
    const match = lines[i].match(/slug:\s*"([^"]+)"/);
    if (match) return match[1];
  }
  return null;
}

function isCommentLine(line, state) {
  const trimmed = line.trim();
  if (state.block) {
    if (trimmed.includes("*/")) state.block = false;
    return true;
  }
  if (trimmed.startsWith("/*") || trimmed.startsWith("{/*")) {
    if (!trimmed.includes("*/")) state.block = true;
    return true;
  }
  if (trimmed.startsWith("//")) return true;
  return false;
}

function scanFile(file, { htmlMode }) {
  const lines = readFileSync(file, "utf8").split(/\n/);
  const state = { block: false };
  const hits = [];
  const excluded = [];
  const relFile = path.relative(repoRoot, file);

  lines.forEach((line, index) => {
    if (!htmlMode && isCommentLine(line, state)) return;

    let skipSlug = null;
    if (htmlMode) skipSlug = excludedSlugFromOut(file);
    else if (file === blogPostsPath) {
      const slug = nearestBlogSlug(lines, index);
      if (slug && EXCLUDED_POSTS.includes(slug)) skipSlug = slug;
    } else if (file.startsWith(essaysDir + path.sep)) {
      const slug = path.basename(file, path.extname(file));
      if (EXCLUDED_POSTS.includes(slug)) skipSlug = slug;
    }

    for (const pattern of patterns) {
      pattern.re.lastIndex = 0;
      let match = pattern.re.exec(line);
      while (match) {
        const hit = {
          file: relFile,
          line: index + 1,
          column: match.index + 1,
          kind: pattern.kind,
          slug: skipSlug,
        };
        if (skipSlug) excluded.push(hit);
        else hits.push(hit);
        match = pattern.re.exec(line);
      }
    }
  });

  return { hits, excluded };
}

let files = [];
if (sourceMode) {
  files = collectSourceFiles();
} else {
  if (!statSync(outDir, { throwIfNoEntry: false })?.isDirectory()) {
    console.error("check-em-dashes: site/out is missing. Run next build first.");
    process.exit(1);
  }
  walk(outDir, files, (_full, name) => name.endsWith(".html"));
}

const hits = [];
const excluded = [];

for (const file of files) {
  const result = scanFile(file, { htmlMode: !sourceMode });
  hits.push(...result.hits);
  excluded.push(...result.excluded);
}

const total = hits.length + excluded.length;
const modeLabel = sourceMode ? "source" : "built HTML";
console.log(`em dash check (${modeLabel})`);
console.log(`em dash hits: ${total}`);
console.log(`excluded: ${excluded.length} (${EXCLUDED_POSTS.join(", ") || "none"})`);
console.log(`remaining: ${hits.length}`);
for (const hit of hits) {
  console.log(`${hit.file}:${hit.line}:${hit.column} ${hit.kind}`);
}
process.exit(hits.length === 0 ? 0 : 1);
