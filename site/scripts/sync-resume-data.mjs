import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(projectRoot, "..");

const mdPath = path.join(repoRoot, "content", "resume.md");
const targetTsPath = path.join(projectRoot, "src", "data", "resumeMarkdown.ts");

export function syncResumeMarkdownToTs() {
  if (!fs.existsSync(mdPath)) {
    console.error(`❌ Could not find ${mdPath}`);
    return;
  }

  const rawMarkdown = fs.readFileSync(mdPath, "utf-8");
  // Escape backticks and backslashes for JS template literal
  const escapedMarkdown = rawMarkdown
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\${/g, "\\${");

  const tsContent = `// AUTO-GENERATED from content/resume.md - DO NOT EDIT DIRECTLY
// Edit content/resume.md to update your resume and trigger instant hot reloading.

import { parseResumeMarkdown, ParsedResume } from "@/lib/parseResumeMarkdown";

export const rawResumeMarkdown = \`${escapedMarkdown}\`;

export const parsedResume: ParsedResume = parseResumeMarkdown(rawResumeMarkdown);
`;

  // Only write if changed to avoid unnecessary re-triggers
  if (fs.existsSync(targetTsPath)) {
    const existing = fs.readFileSync(targetTsPath, "utf-8");
    if (existing === tsContent) {
      return;
    }
  }

  fs.writeFileSync(targetTsPath, tsContent, "utf-8");
  console.log(`⚡ [Hot Reload] Synced content/resume.md -> src/data/resumeMarkdown.ts`);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  syncResumeMarkdownToTs();
}
