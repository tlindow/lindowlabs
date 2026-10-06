/**
 * Map "@/…" imports to site/src for node:test without a bundler.
 */
import { register } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

register("./ts-path-loader.mjs", pathToFileURL(path.join(siteRoot, "scripts/")));
