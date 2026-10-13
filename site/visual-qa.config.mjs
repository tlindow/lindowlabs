/**
 * Visual QA config (LL-86): public routes + one-per-page primary CTAs.
 *
 * Routes are derived from src/app page.tsx files and blog post metadata.
 * `/learning` (and anything under it) is excluded — it sits behind login.
 *
 * Beacon owns keeping primaryButtons current as logged-out CTAs change.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = __dirname;
const appRoot = path.join(siteRoot, "src", "app");
const blogPostsPath = path.join(siteRoot, "src", "data", "blogPosts.ts");

/** Viewports exercised on every public route. */
export const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1024, height: 768 },
  { name: "mobile", width: 375, height: 812 },
];

/**
 * Primary CTAs that must not exceed `max` visible matches per page.
 * Schedule time is allowed twice (hero + Let's talk) on the homepage.
 */
export const primaryButtons = [
  { label: "Let's get in touch", max: 1 },
  { label: "Download resume", max: 1 },
  { label: "Schedule time", max: 2 },
];

/** Route prefixes skipped even if a page.tsx exists under src/app. */
export const excludeRoutePrefixes = ["/learning"];

/**
 * Parse slug + optional canonicalPath from blogPosts.ts without a TS loader.
 * @returns {{ slug: string, canonicalPath?: string }[]}
 */
function readBlogPostRoutes() {
  if (!fs.existsSync(blogPostsPath)) return [];
  const src = fs.readFileSync(blogPostsPath, "utf8");
  const posts = [];
  // Each post object starts with id/slug; grab slug and optional canonicalPath.
  const blocks = src.split(/^\s*\{\s*$/m).slice(1);
  for (const block of blocks) {
    const slugMatch = block.match(/\bslug:\s*"([^"]+)"/);
    if (!slugMatch) continue;
    const canonicalMatch = block.match(/\bcanonicalPath:\s*"([^"]+)"/);
    posts.push({
      slug: slugMatch[1],
      canonicalPath: canonicalMatch?.[1],
    });
  }
  return posts;
}

/**
 * Walk src/app for page.tsx files → URL paths.
 * Dynamic `[param]` segments are expanded only for known blog slugs.
 */
function scanAppRoutes() {
  const routes = new Set();

  function walk(dir, urlParts) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "api") continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        // Route groups "(name)" do not appear in the URL.
        if (entry.name.startsWith("(") && entry.name.endsWith(")")) {
          walk(full, urlParts);
          continue;
        }
        walk(full, [...urlParts, entry.name]);
        continue;
      }
      if (entry.name !== "page.tsx" && entry.name !== "page.jsx") continue;
      const segs = urlParts.filter(Boolean);
      if (segs.length === 0) {
        routes.add("/");
        continue;
      }
      // Expand blog/[slug] from post metadata; skip other dynamic folders.
      if (segs.some((s) => s.startsWith("[") && s.endsWith("]"))) {
        if (segs[0] === "blog" && segs[1] === "[slug]" && segs.length === 2) {
          for (const post of readBlogPostRoutes()) {
            if (post.canonicalPath) {
              routes.add(post.canonicalPath);
            } else {
              routes.add(`/blog/${post.slug}`);
            }
          }
        }
        continue;
      }
      routes.add(`/${segs.join("/")}`);
    }
  }

  walk(appRoot, []);
  return [...routes];
}

/**
 * Public routes under test. Derived from the repo; `/learning*` omitted.
 * @returns {string[]}
 */
export function derivePublicRoutes() {
  const raw = scanAppRoutes();
  // Blog index is a real page; ensure it stays even if scan order varies.
  const withBlogIndex = new Set(raw);
  if (fs.existsSync(path.join(appRoot, "blog", "page.tsx"))) {
    withBlogIndex.add("/blog");
  }
  return [...withBlogIndex]
    .filter(
      (route) =>
        !excludeRoutePrefixes.some(
          (prefix) => route === prefix || route.startsWith(`${prefix}/`)
        )
    )
    .sort((a, b) => a.localeCompare(b));
}

/** Snapshot used by the check + workflow (always derived at load time). */
export const routes = derivePublicRoutes();
