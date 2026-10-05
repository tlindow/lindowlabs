import { ServiceError } from "./errors.js";
import { releaseSession, openAuthenticatedSession, type AuthenticatedSession } from "./session.js";
import { hostIsBotProtected, loadCatalog, publicSite, type Site } from "./sites.js";
import { readRegistry } from "./registry.js";
import type { ServiceConfig } from "./config.js";

export type ToolDeps = {
  config: ServiceConfig;
  loadSites?: () => Promise<Site[]>;
  openSession?: typeof openAuthenticatedSession;
  release?: typeof releaseSession;
};

export async function listSites(deps: ToolDeps) {
  const sites = await (deps.loadSites ?? (() => loadCatalog(deps.config.sitesFile)))();
  return sites.map(publicSite);
}

export async function listContexts(deps: ToolDeps) {
  const registry = await readRegistry(deps.config.dataDir);
  return registry.contexts;
}

export async function openSession(
  deps: ToolDeps,
  input: { siteId: string; keepAlive?: boolean; contextId?: string; allowProtected?: boolean },
): Promise<AuthenticatedSession> {
  const sites = await (deps.loadSites ?? (() => loadCatalog(deps.config.sitesFile)))();
  const site = sites.find((candidate) => candidate.id === input.siteId);
  if (!site) {
    throw new ServiceError(
      `Unknown site "${input.siteId}". Known sites: ${sites.map((item) => item.id).join(", ")}`,
      "unknown_site",
    );
  }
  if (hostIsBotProtected(site.loginUrl) && !input.allowProtected) {
    throw new ServiceError(
      `${site.label} is on a site with bot protection. A free Browserbase plan does not include Verified sessions or residential proxies, so a plain login usually gets blocked. Pass allowProtected to try anyway, or point this site at a page that does not block cloud browsers.`,
      "bot_protected",
    );
  }
  const open = deps.openSession ?? openAuthenticatedSession;
  return open({
    site,
    apiKey: deps.config.apiKey,
    dataDir: deps.config.dataDir,
    keepAlive: input.keepAlive,
    contextId: input.contextId,
    allowProtected: input.allowProtected,
  });
}

export async function release(deps: ToolDeps, sessionId: string): Promise<{ sessionId: string; released: true }> {
  const run = deps.release ?? releaseSession;
  await run(deps.config.apiKey, sessionId);
  return { sessionId, released: true };
}

export function errorPayload(error: unknown): { code: string; message: string } {
  if (error instanceof ServiceError) return { code: error.code, message: error.message };
  if (error instanceof Error) {
    const code =
      "code" in error && typeof error.code === "string" && error.code !== ""
        ? error.code
        : "error";
    return { code, message: error.message };
  }
  return { code: "error", message: "Unknown error" };
}
