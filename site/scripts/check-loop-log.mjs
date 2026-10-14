#!/usr/bin/env node
/**
 * Validate docs/loop-log.md:
 *   - header has a Check column (6 columns per row)
 *   - every Check cell is `n/a` or backticked npm scripts that exist in
 *     site/package.json
 *   - every outer-loop row names at least one existing script, so a failure
 *     that reached CI always has a pre-push check behind it
 *
 * Usage: node scripts/check-loop-log.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { LOOP_LOG_PATH, SITE_ROOT, parseLoopLog } from "./lib/loop-log.mjs";

const pkg = JSON.parse(fs.readFileSync(path.join(SITE_ROOT, "package.json"), "utf8"));
const scripts = new Set(Object.keys(pkg.scripts || {}));
const rel = path.relative(process.cwd(), LOOP_LOG_PATH);

const { header, rows } = parseLoopLog();
const errors = [];

if (!header || header[5] !== "Check") {
  errors.push(`${rel}: table header must end with a "Check" column, got ${JSON.stringify(header)}`);
}

for (const row of rows) {
  const where = `${rel}:${row.lineNumber}`;
  if (row.cells.length !== 6) {
    errors.push(`${where}: expected 6 columns, got ${row.cells.length}`);
    continue;
  }
  const isNa = row.checkCell === "n/a";
  if (!isNa && row.checks.length === 0) {
    errors.push(`${where}: Check must be \`script\` names or n/a, got "${row.checkCell}"`);
  }
  for (const name of row.checks) {
    if (!scripts.has(name)) {
      errors.push(`${where}: Check names \`${name}\`, which is not a script in site/package.json`);
    }
  }
  if (row.loop.startsWith("outer") && row.checks.length === 0) {
    errors.push(
      `${where}: outer-loop row "${row.failure}" must name the check that now catches it before push (add or extend one)`
    );
  }
}

if (errors.length > 0) {
  console.error(`check-loop-log: ${errors.length} problem(s)`);
  for (const e of errors) console.error(`  ${e}`);
  process.exit(1);
}

const outer = rows.filter((r) => r.loop.startsWith("outer")).length;
console.log(`check-loop-log: ok (${rows.length} rows, ${outer} outer-loop rows all name an existing check)`);
