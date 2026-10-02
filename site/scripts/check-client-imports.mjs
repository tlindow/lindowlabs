import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Fail when a server module imports a non-component (camelCase) named export
 * from a "use client" file. That pattern breaks static prerendering
 * (see docs/loop-log.md: pageAudioLabel from the audio player module).
 *
 * Default imports and PascalCase named imports are treated as components and allowed.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const srcRoot = path.join(siteRoot, "src");
const exts = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".mts"]);

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else if (exts.has(path.extname(full))) files.push(full);
  }
  return files;
}

function isClientFile(text) {
  return /^["']use client["'];?\s*$/m.test(text.split(/\n/).slice(0, 5).join("\n"));
}

function resolveImport(fromFile, spec) {
  if (!spec.startsWith("@/") && !spec.startsWith(".")) return null;
  const base = spec.startsWith("@/")
    ? path.join(srcRoot, spec.slice(2))
    : path.resolve(path.dirname(fromFile), spec);
  const candidates = [
    base,
    ...[...exts].map((ext) => base + ext),
    ...[...exts].map((ext) => path.join(base, "index" + ext)),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

function namedExports(text) {
  const names = new Set();
  for (const match of text.matchAll(
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g
  )) {
    names.add(match[1]);
  }
  for (const match of text.matchAll(
    /export\s+(?:const|let|var|class|type|interface)\s+([A-Za-z_$][\w$]*)/g
  )) {
    names.add(match[1]);
  }
  for (const match of text.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const part of match[1].split(",")) {
      const bits = part.trim().split(/\s+as\s+/);
      const exported = (bits[1] || bits[0] || "").trim();
      if (exported && exported !== "default") names.add(exported);
    }
  }
  return names;
}

function isComponentName(name) {
  return /^[A-Z]/.test(name);
}

const files = walk(srcRoot);
const clientNamed = new Map(); // file -> Set of camelCase helper export names

for (const file of files) {
  const text = readFileSync(file, "utf8");
  if (!isClientFile(text)) continue;
  const helpers = [...namedExports(text)].filter((name) => !isComponentName(name));
  if (helpers.length) clientNamed.set(file, new Set(helpers));
}

const namedImportRe =
  /import\s*\{([^}]+)\}\s*from\s*["']([^"']+)["']/g;

const failures = [];

for (const file of files) {
  const text = readFileSync(file, "utf8");
  if (isClientFile(text)) continue;

  for (const match of text.matchAll(namedImportRe)) {
    const spec = match[2];
    const resolved = resolveImport(file, spec);
    if (!resolved || !clientNamed.has(resolved)) continue;

    const helpers = clientNamed.get(resolved);
    const imported = match[1].split(",").map((part) => {
      const bits = part.trim().split(/\s+as\s+/);
      return (bits[0] || "").trim();
    });

    for (const name of imported) {
      if (!name || name === "type" || name.startsWith("type ")) continue;
      const raw = name.replace(/^type\s+/, "");
      if (helpers.has(raw)) {
        failures.push({
          file: path.relative(siteRoot, file),
          helper: raw,
          from: path.relative(siteRoot, resolved),
        });
      }
    }
  }
}

if (failures.length === 0) {
  console.log("client import check: ok");
  process.exit(0);
}

console.log("client import check: fail");
for (const failure of failures) {
  console.log(
    `${failure.file} imports non-component '${failure.helper}' from client module ${failure.from}`
  );
  console.log(
    "  Move shared helpers to site/src/data or site/src/lib (not a \"use client\" file)."
  );
}
process.exit(1);
