import { existsSync, mkdirSync, renameSync, rmSync, cpSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

/**
 * Build a static export for GitHub Pages + pre-push HTML checks.
 * Stytch auth (proxy, API routes, dynamic /learning) only runs on Vercel SSR,
 * so those paths are stashed for the export build and restored afterward.
 *
 * Important: never call process.exit while paths are stashed; always restore
 * in a finally block first.
 */

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const stashRoot = path.join(siteRoot, ".ssr-stash");
const srcRoot = path.join(siteRoot, "src");

const STASH_ITEMS = [
  { from: path.join(srcRoot, "proxy.ts"), to: path.join(stashRoot, "proxy.ts") },
  {
    from: path.join(srcRoot, "app", "api"),
    to: path.join(stashRoot, "api"),
  },
  {
    from: path.join(srcRoot, "app", "learning"),
    to: path.join(stashRoot, "learning"),
  },
];

const stubFallback = path.join(here, "learning-static-stub.tsx");

function stash() {
  mkdirSync(stashRoot, { recursive: true });
  for (const item of STASH_ITEMS) {
    if (!existsSync(item.from)) continue;
    if (existsSync(item.to)) rmSync(item.to, { recursive: true, force: true });
    renameSync(item.from, item.to);
    console.log(`stash ${path.relative(siteRoot, item.from)}`);
  }

  const learningDir = path.join(srcRoot, "app", "learning");
  mkdirSync(learningDir, { recursive: true });
  const stubFrom = existsSync(path.join(stashRoot, "learning", "page.static-stub.tsx"))
    ? path.join(stashRoot, "learning", "page.static-stub.tsx")
    : stubFallback;
  if (!existsSync(stubFrom)) {
    throw new Error("learning static stub missing");
  }
  cpSync(stubFrom, path.join(learningDir, "page.tsx"));
  console.log("wrote static /learning stub");
}

function restore() {
  const learningDir = path.join(srcRoot, "app", "learning");
  if (existsSync(learningDir)) {
    rmSync(learningDir, { recursive: true, force: true });
  }

  for (const item of STASH_ITEMS) {
    if (!existsSync(item.to)) continue;
    const parent = path.dirname(item.from);
    mkdirSync(parent, { recursive: true });
    if (existsSync(item.from)) rmSync(item.from, { recursive: true, force: true });
    renameSync(item.to, item.from);
    console.log(`restore ${path.relative(siteRoot, item.from)}`);
  }

  if (existsSync(stashRoot)) {
    rmSync(stashRoot, { recursive: true, force: true });
  }
}

function run(command, args, env = {}) {
  const result = spawnSync(command, args, {
    cwd: siteRoot,
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: false,
  });
  if (result.status !== 0) {
    const error = new Error(
      `${command} ${args.join(" ")} failed with status ${result.status}`
    );
    error.exitCode = result.status ?? 1;
    throw error;
  }
}

let stashed = false;
let exitCode = 0;
try {
  stash();
  stashed = true;
  run("node", ["scripts/sync-resume-data.mjs"]);
  run("npx", ["next", "build"], { STATIC_EXPORT: "1" });
  run("node", ["scripts/write-redirects.mjs"]);
} catch (error) {
  console.error(error?.message || error);
  exitCode = error?.exitCode || 1;
} finally {
  if (stashed) {
    try {
      restore();
    } catch (restoreError) {
      console.error("failed to restore SSR paths:", restoreError);
      exitCode = exitCode || 1;
    }
  }
}

process.exit(exitCode);
