import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(siteRoot, "src");

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const rel = specifier.slice(2);
    const candidates = [
      path.join(srcRoot, rel),
      path.join(srcRoot, `${rel}.ts`),
      path.join(srcRoot, `${rel}.tsx`),
      path.join(srcRoot, rel, "index.ts"),
    ];
    for (const candidate of candidates) {
      try {
        return await nextResolve(pathToFileURL(candidate).href, context);
      } catch {
        /* try next */
      }
    }
    return nextResolve(pathToFileURL(path.join(srcRoot, `${rel}.ts`)).href, context);
  }
  return nextResolve(specifier, context);
}
