#!/usr/bin/env node
/**
 * Point git at the committed hooks in <repo>/.githooks (pre-push runs
 * scripts/check.mjs). Runs from `npm install` via the `prepare` script.
 * Never fails the install: skips in CI or outside a git work tree.
 */

import { spawnSync } from "node:child_process";

if (process.env.CI) process.exit(0);

const git = (...args) =>
  spawnSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

const top = git("rev-parse", "--show-toplevel");
if (top.status !== 0) process.exit(0);

const current = git("config", "--get", "core.hooksPath").stdout?.trim();
if (current === ".githooks") process.exit(0);
if (current) {
  // Respect a hooks path someone else configured; just say how to opt in.
  console.log(
    `install-git-hooks: core.hooksPath is "${current}"; leaving it. To use the repo pre-push gate: git config core.hooksPath .githooks`
  );
  process.exit(0);
}

const set = git("config", "core.hooksPath", ".githooks");
if (set.status === 0) {
  console.log("install-git-hooks: core.hooksPath -> .githooks (pre-push runs site checks)");
}
