import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type ContextRegistry = {
  contexts: Record<string, string>;
};

function emptyRegistry(): ContextRegistry {
  return { contexts: {} };
}

export function registryPath(dataDir: string): string {
  return path.join(dataDir, "contexts.json");
}

export async function readRegistry(dataDir: string): Promise<ContextRegistry> {
  try {
    const raw = await readFile(registryPath(dataDir), "utf8");
    const parsed = JSON.parse(raw) as ContextRegistry;
    if (!parsed || typeof parsed.contexts !== "object" || parsed.contexts === null) {
      return emptyRegistry();
    }
    return { contexts: parsed.contexts };
  } catch (error) {
    if (isNotFound(error)) return emptyRegistry();
    throw error;
  }
}

export async function writeRegistry(dataDir: string, registry: ContextRegistry): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await writeFile(registryPath(dataDir), `${JSON.stringify(registry, null, 2)}\n`, "utf8");
}

function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  );
}
