/**
 * Parse docs/loop-log.md (the inner/outer loop handoff table).
 *
 * Each row: Date | Loop | Failure type | Fixing PR | Prevention | Check.
 * `Check` lists backticked npm script names from site/package.json, or n/a.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SITE_ROOT = path.resolve(__dirname, "..", "..");
export const LOOP_LOG_PATH = path.resolve(SITE_ROOT, "..", "docs", "loop-log.md");

/** Split a markdown table row on unescaped pipes. */
function splitRow(line) {
  const cells = [];
  let cur = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "\\" && line[i + 1] === "|") {
      cur += "\\|";
      i += 1;
    } else if (ch === "|") {
      cells.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  cells.push(cur.trim());
  // Drop the empty cells outside the leading / trailing pipe.
  return cells.slice(1, -1);
}

export function parseLoopLog(text = fs.readFileSync(LOOP_LOG_PATH, "utf8")) {
  const lines = text.split("\n");
  let header = null;
  const rows = [];
  lines.forEach((line, idx) => {
    if (!line.startsWith("|")) return;
    const cells = splitRow(line);
    if (!header) {
      header = cells;
      return;
    }
    if (cells.every((c) => /^-+$/.test(c))) return;
    const checkCell = cells[5] ?? "";
    rows.push({
      lineNumber: idx + 1,
      raw: line,
      cells,
      date: cells[0],
      loop: cells[1],
      failure: cells[2],
      pr: cells[3],
      prevention: cells[4],
      checkCell,
      checks: [...checkCell.matchAll(/`([^`]+)`/g)].map((m) => m[1]),
    });
  });
  return { header, rows };
}

/** Loop-log rows whose Check column names `script`. */
export function rowsForScript(script) {
  try {
    return parseLoopLog().rows.filter((r) => r.checks.includes(script));
  } catch {
    return [];
  }
}
