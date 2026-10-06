import { existsSync, mkdirSync, renameSync, rmSync, cpSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

/**
 * Build a static export for GitHub Pages + pre-push HTML checks.
 * Auth.js (proxy, API routes, dynamic /learning) only runs on Vercel SSR, so
 * those paths are stashed for the export build and restored afterward.
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
  { from: path.join(srcRoot, "auth.ts"), to: path.join(stashRoot, "auth.ts") },
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

const AUTH_STUB = `/** Static-export stub. Real Auth.js config is restored after the build. */
export const handlers = {
  GET: async () => new Response("not available on static export", { status: 404 }),
  POST: async () => new Response("not available on static export", { status: 404 }),
};
export const auth = async (): Promise<{ user?: { email?: string | null } } | null> => null;
export const signIn = async () => {};
export const signOut = async (_options?: { redirectTo?: string }) => {};
export const LEARNING_AUTH_CALLBACK_PATH = "/api/auth/callback/google";
export const LEARNING_AUTH_CALLBACK_URL =
  "https://lindowlabs.dev/api/auth/callback/google";
`;

function stash() {
  mkdirSync(stashRoot, { recursive: true });
  for (const item of STASH_ITEMS) {
    if (!existsSync(item.from)) continue;
    if (existsSync(item.to)) rmSync(item.to, { recursive: true, force: true });
    renameSync(item.from, item.to);
    console.log(`stash ${path.relative(siteRoot, item.from)}`);
  }

  // Keep a no-op auth module so leftover server helpers still typecheck.
  writeFileSync(path.join(srcRoot, "auth.ts"), AUTH_STUB, "utf8");
  console.log("wrote auth stub");

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

  // Remove auth stub before restoring the real file.
  const authPath = path.join(srcRoot, "auth.ts");
  if (existsSync(authPath) && !existsSync(path.join(stashRoot, "auth.ts"))) {
    // Unexpected: leave alone
  } else if (existsSync(authPath)) {
    rmSync(authPath, { force: true });
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
    const error = new Error(`${command} ${args.join(" ")} failed with status ${result.status}`);
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
