import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadAllPostFrontMatter } from "../src/lib/frontMatter.mjs";

const outDir = path.resolve(process.cwd(), "out");
const base = (process.env.BASE_PATH || "").replace(/\/$/, "");

function destinationHref(slug) {
  return `${base}/blog/${slug}`;
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
  const sampleFlat = path.join(outDir, "blog", "securing-500k-gmv-win.html");
  const sampleNested = path.join(outDir, "blog", "securing-500k-gmv-win", "index.html");
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
  console.error("write-redirects: site/out is missing. Run next build first.");
  process.exit(1);
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

console.log(`write-redirects: ${count} redirect(s)`);
