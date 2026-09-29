import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

// over-index-on-intuition stays excluded until Tyler decides what happens to that post.
const EXCLUDED_POSTS = ["over-index-on-intuition"];

const outDir = path.resolve(process.cwd(), "out");
const patterns = [
  { kind: "U+2014", re: /\u2014/g },
  { kind: "&mdash;", re: /&mdash;/gi },
  { kind: "&#8212;", re: /&#8212;/gi },
  { kind: "&#x2014;", re: /&#x2014;/gi },
];

function walk(dir, files) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (name.endsWith(".html")) files.push(full);
  }
}

if (!statSync(outDir, { throwIfNoEntry: false })?.isDirectory()) {
  console.error("check-em-dashes: site/out is missing. Run next build first.");
  process.exit(1);
}

function excludedSlug(file) {
  const rel = path.relative(outDir, file).split(path.sep).join("/");
  for (const slug of EXCLUDED_POSTS) {
    if (rel === `blog/${slug}.html` || rel.startsWith(`blog/${slug}/`)) return slug;
  }
  return null;
}

const files = [];
walk(outDir, files);
const hits = [];
const excluded = [];

for (const file of files) {
  const skip = excludedSlug(file);
  const lines = readFileSync(file, "utf8").split(/\n/);
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      pattern.re.lastIndex = 0;
      let match = pattern.re.exec(line);
      while (match) {
        const hit = {
          file: path.relative(path.resolve(outDir, "..", ".."), file),
          line: index + 1,
          column: match.index + 1,
          kind: pattern.kind,
          slug: skip,
        };
        if (skip) excluded.push(hit);
        else hits.push(hit);
        match = pattern.re.exec(line);
      }
    }
  });
}

const total = hits.length + excluded.length;
console.log(`em dash hits: ${total}`);
console.log(`excluded: ${excluded.length} (${EXCLUDED_POSTS.join(", ") || "none"})`);
console.log(`remaining: ${hits.length}`);
for (const hit of hits) {
  console.log(`${hit.file}:${hit.line}:${hit.column} ${hit.kind}`);
}
process.exit(hits.length === 0 ? 0 : 1);
