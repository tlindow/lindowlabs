import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const retired of [
  "src/app/learning",
  "src/app/api/learning",
  "src/app/api/auth",
  "scripts/learning-static-stub.tsx",
  "out/learning",
  "out/learning.html",
]) {
  assert.equal(existsSync(path.join(root, retired)), false, `${retired} must remain retired`);
}

const out = path.join(root, "out");
assert.ok(existsSync(out), "Run npm run build:static before this check");
function checkHtml(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) checkHtml(file);
    else if (entry.name.endsWith(".html")) {
      const html = readFileSync(file, "utf8");
      assert.doesNotMatch(html, /(?:href|action)=["'][^"']*\/learning(?:[/?#"'])/i,
        `${file} links to the retired dashboard`);
    }
  }
}
checkHtml(out);
console.log("Retired learning routes and links are absent from source and static export.");
