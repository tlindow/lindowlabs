#!/usr/bin/env node
/**
 * Run the check pipeline defined in scripts/check-manifest.mjs.
 *
 * Usage (from site/):
 *   node scripts/check.mjs                      # every tier (= npm run check)
 *   node scripts/check.mjs --tier fast          # one or more tiers, comma-separated
 *   node scripts/check.mjs --only mobile-nav    # specific step ids
 *   node scripts/check.mjs --skip visual-qa     # drop step ids
 *   node scripts/check.mjs --strict-flaky       # fail when a browser step only passes on retry
 *   node scripts/check.mjs --list               # print the pipeline and exit
 *
 * On failure it prints the docs/loop-log.md rows whose Check column names the
 * failing script, so the fix starts from the known history.
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TIERS, TIER_ORDER } from "./check-manifest.mjs";
import { rowsForScript } from "./lib/loop-log.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(__dirname, "..");
const inCi = process.env.GITHUB_ACTIONS === "true";

function listFlag(name) {
  const idx = process.argv.indexOf(name);
  if (idx < 0) return null;
  const value = process.argv[idx + 1];
  if (!value || value.startsWith("--")) {
    console.error(`check: ${name} needs a comma-separated value`);
    process.exit(2);
  }
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

const tiers = listFlag("--tier") ?? [...TIER_ORDER];
const only = listFlag("--only");
const skip = new Set(listFlag("--skip") ?? []);
const strictFlaky = process.argv.includes("--strict-flaky");

for (const tier of tiers) {
  if (!TIERS[tier]) {
    console.error(`check: unknown tier "${tier}" (known: ${TIER_ORDER.join(", ")})`);
    process.exit(2);
  }
}

const allIds = new Set(TIER_ORDER.flatMap((t) => TIERS[t].map((s) => s.id)));
for (const id of [...(only ?? []), ...skip]) {
  if (!allIds.has(id)) {
    console.error(`check: unknown step "${id}" (known: ${[...allIds].join(", ")})`);
    process.exit(2);
  }
}

const plan = TIER_ORDER.filter((t) => tiers.includes(t)).flatMap((tier) =>
  TIERS[tier]
    .filter((step) => (only ? only.includes(step.id) : true))
    .filter((step) => !skip.has(step.id))
    .map((step) => ({ ...step, tier }))
);

function commandFor(step) {
  const args = ["run", step.script];
  if (step.args?.length) args.push("--", ...step.args);
  return args;
}

if (process.argv.includes("--list")) {
  for (const step of plan) {
    console.log(`${step.tier.padEnd(8)} ${step.id.padEnd(18)} npm ${commandFor(step).join(" ")}`);
  }
  process.exit(0);
}

function runOnce(step) {
  const result = spawnSync("npm", commandFor(step), {
    cwd: siteRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  return result.status === 0;
}

function printLoopLogHint(step) {
  const rows = rowsForScript(step.script);
  if (rows.length === 0) {
    console.error(
      `  No docs/loop-log.md row names \`${step.script}\` yet. If this is a new failure type, add a row (with a Check) in the fix PR.`
    );
    return;
  }
  console.error(`  Known history in docs/loop-log.md for \`${step.script}\`:`);
  for (const row of rows.slice(-5)) {
    console.error(`    L${row.lineNumber} ${row.date} | ${row.loop} | ${row.failure}`);
  }
}

const results = [];
const started = Date.now();

for (const step of plan) {
  const label = `[${step.tier}] ${step.id}`;
  if (inCi) console.log(`::group::${label}`);
  else console.log(`\n=== ${label}: npm ${commandFor(step).join(" ")}`);

  const t0 = Date.now();
  let ok = runOnce(step);
  let attempts = 1;
  while (!ok && attempts <= (step.retry ?? 0)) {
    console.log(`--- ${label} failed; retrying (${attempts}/${step.retry})`);
    attempts += 1;
    ok = runOnce(step);
  }
  const status = ok ? (attempts > 1 ? "flaky" : "pass") : "fail";
  const seconds = ((Date.now() - t0) / 1000).toFixed(1);
  results.push({ ...step, status, seconds, attempts });

  if (inCi) console.log("::endgroup::");

  if (status === "flaky") {
    const msg = `${label} passed only on retry (FLAKY). Make it wait for a settled state; do not treat this as green.`;
    console.log(inCi ? `::warning title=Flaky check::${msg}` : `WARNING: ${msg}`);
    if (strictFlaky) break;
  }
  if (status === "fail") {
    const msg = `${label} failed (npm ${commandFor(step).join(" ")})`;
    console.error(inCi ? `::error title=Check failed::${msg}` : `\nFAILED: ${msg}`);
    printLoopLogHint(step);
    break;
  }
}

const icon = { pass: "ok", flaky: "FLAKY", fail: "FAIL" };
const lines = results.map(
  (r) => `${icon[r.status].padEnd(5)} ${r.tier.padEnd(8)} ${r.id.padEnd(18)} ${r.seconds}s${r.attempts > 1 ? ` (${r.attempts} attempts)` : ""}`
);
const remaining = plan.length - results.length;
console.log(`\ncheck summary (${((Date.now() - started) / 1000).toFixed(0)}s):`);
for (const line of lines) console.log(`  ${line}`);
if (remaining > 0) console.log(`  (${remaining} step(s) not run)`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const md = [
    `### check.mjs: ${tiers.join(", ")}`,
    "| Status | Tier | Step | Time |",
    "| --- | --- | --- | --- |",
    ...results.map((r) => `| ${icon[r.status]} | ${r.tier} | \`${r.id}\` | ${r.seconds}s |`),
    "",
  ].join("\n");
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${md}\n`);
}

const failed = results.some((r) => r.status === "fail");
const flakyFail = strictFlaky && results.some((r) => r.status === "flaky");
process.exit(failed || flakyFail ? 1 : 0);
