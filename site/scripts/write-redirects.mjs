import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadAllPostFrontMatter } from "../src/lib/frontMatter.mjs";

const outDir = path.resolve(process.cwd(), "out");
const base = (process.env.BASE_PATH || "").replace(/\/$/, "");

/** Posts moved off `/blog/[slug]`; emit HTML redirects at the old blog path. */
const PATH_MOVES = [
  {
    oldBlogSlug: "building-teams-as-raising-funds",
    href: "/how-i-lead-teams/building-teams-as-raising-funds",
  },
];

function destinationHref(slug) {
  return `${base}/blog/${slug}`;
}

function absoluteHref(href) {
  if (href.startsWith("http")) return href;
  return `${base}${href.startsWith("/") ? href : `/${href}`}`;
}

function redirectHtml(href) {
  const safeHref = href.replace(/"/g, "%22");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<link rel="canonical" href="${safeHref}">
<meta http-equiv="refresh" content="0; url=${safeHref}">
<title>Redirect</title>
<script>location.replace(${JSON.stringify(href)});</script>
</head>
<body>
<p><a href="${safeHref}">Continue</a></p>
</body>
</html>
`;
}

function writeRedirect(oldSlug, href) {
  const flat = path.join(outDir, "blog", `${oldSlug}.html`);
  const nestedDir = path.join(outDir, "blog", oldSlug);
  const sampleFlat = path.join(outDir, "blog", "building-product-as-system-architecture.html");
  const sampleNested = path.join(outDir, "blog", "building-product-as-system-architecture", "index.html");
  const html = redirectHtml(href);
  const wrote = [];

  if (existsSync(sampleNested) || !existsSync(sampleFlat)) {
    mkdirSync(nestedDir, { recursive: true });
    const nested = path.join(nestedDir, "index.html");
    writeFileSync(nested, html);
    wrote.push(nested);
  }
  if (existsSync(sampleFlat) || !existsSync(sampleNested)) {
    mkdirSync(path.dirname(flat), { recursive: true });
    writeFileSync(flat, html);
    wrote.push(flat);
  }
  return wrote;
}

if (!existsSync(outDir)) {
  // SSR / Vercel builds have no site/out; redirects are unused there.
  console.log("write-redirects: site/out missing (SSR build); skipping.");
  process.exit(0);
}

const posts = loadAllPostFrontMatter();
let count = 0;
for (const [slug, frontMatter] of Object.entries(posts)) {
  const href = destinationHref(slug);
  for (const from of frontMatter.redirectFrom) {
    const oldSlug = from.trim().replace(/^\/+/, "").replace(/^blog\//, "").replace(/\/+$/, "");
    if (!oldSlug || oldSlug === slug) continue;
    const files = writeRedirect(oldSlug, href);
    count += 1;
    for (const file of files) {
      console.log(`redirect ${from} -> ${href} (${path.relative(outDir, file)})`);
    }
  }
}

for (const move of PATH_MOVES) {
  const href = absoluteHref(move.href);
  const files = writeRedirect(move.oldBlogSlug, href);
  count += 1;
  for (const file of files) {
    console.log(
      `redirect /blog/${move.oldBlogSlug} -> ${href} (${path.relative(outDir, file)})`
    );
  }
}

console.log(`write-redirects: ${count} redirect(s)`);
