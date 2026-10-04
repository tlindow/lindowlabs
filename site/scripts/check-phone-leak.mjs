import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Fail if the private phone digits appear anywhere in the static export.
 * Catches HTML, JSON-LD, serialized props, JS bundles, and public assets.
 */
const FORBIDDEN = ["580-5788", "5805788"];

const here = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(here, "../out");

if (!existsSync(outDir)) {
  console.error("phone leak check: site/out is missing (run build first)");
  process.exit(1);
}

function walk(dir, files) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
}

const files = [];
walk(outDir, files);

const hits = [];
for (const file of files) {
  let text;
  try {
    text = readFileSync(file);
  } catch {
    continue;
  }
  // Binary-safe: search UTF-8 string form of the buffer.
  const asString = text.toString("utf8");
  for (const needle of FORBIDDEN) {
    if (asString.includes(needle)) {
      hits.push(`${path.relative(outDir, file)}: contains ${needle}`);
    }
  }
}

if (hits.length) {
  console.error("phone leak check: fail");
  for (const hit of hits) console.error(hit);
  process.exit(1);
}

console.log(`phone leak check: ok (${files.length} files scanned)`);
