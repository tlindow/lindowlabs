import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  loadAllowedLabels,
  parseLabeledMarkdown,
  renderLabeledParagraphs,
} from "../src/lib/frontMatter.mjs";

// over-index-on-intuition stays unlabeled until Tyler decides what happens to that post.
const UNLABELED_ALLOWED = ["over-index-on-intuition"];

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.join(here, "../..");
const essaysDir = path.join(repoRoot, "content/essays");
const categoriesPath = path.join(repoRoot, "content/categories.md");
const postsPath = path.join(here, "../src/data/blogPosts.ts");
const failures = [];

let LABELS;
try {
  LABELS = loadAllowedLabels(categoriesPath);
} catch (error) {
  console.log("label check: fail");
  console.log(String(error.message || error));
  process.exit(1);
}

const postSlugs = [...readFileSync(postsPath, "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map(
  (match) => match[1]
);

const published = [];

for (const slug of postSlugs) {
  const file = path.join(essaysDir, `${slug}.md`);
  const hasEssay = existsSync(file);
  if (!hasEssay) {
    if (!UNLABELED_ALLOWED.includes(slug)) {
      failures.push(
        `${slug}: no essay in content/essays and not on the unlabeled allow list`
      );
    }
    continue;
  }
  published.push(slug);
}

if (published.length === 0) {
  failures.push("no published case-study essays found in content/essays");
}

if (!existsSync(essaysDir)) {
  failures.push("content/essays is missing");
} else {
  for (const name of readdirSync(essaysDir).filter((n) => n.endsWith(".md")).sort()) {
    const slug = name.slice(0, -3);
    const markdown = readFileSync(path.join(essaysDir, name), "utf8");
    const { paragraphs, errors } = parseLabeledMarkdown(markdown, LABELS);
    for (const error of errors) failures.push(`${slug}: ${error}`);
    for (const paragraph of renderLabeledParagraphs(paragraphs)) {
      if (paragraph.label && !LABELS.includes(paragraph.label)) {
        failures.push(`${slug}: rendered label is not allowed: ${paragraph.label}`);
      }
    }
  }
}

if (failures.length) {
  console.log("label check: fail");
  for (const failure of failures) console.log(failure);
  process.exit(1);
}

console.log("label check: pass");
console.log(`Allowed labels: ${LABELS.join(", ")}`);
console.log(`Unlabeled allow list: ${UNLABELED_ALLOWED.join(", ")}`);
for (const slug of published) {
  const { paragraphs } = parseLabeledMarkdown(
    readFileSync(path.join(essaysDir, `${slug}.md`), "utf8"),
    LABELS
  );
  const rendered = renderLabeledParagraphs(paragraphs);
  const labeled = rendered.filter((p) => p.label).length;
  console.log(
    `${slug}: ${paragraphs.length} source paragraphs, ${rendered.length} rendered (${labeled} labeled)`
  );
}
