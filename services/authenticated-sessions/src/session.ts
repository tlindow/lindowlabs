import { Browserbase, ConflictError, NotFoundError } from "@browserbasehq/sdk";
import { browserbase, Stagehand, type Page } from "@browserbasehq/stagehand";
import { ServiceError } from "./errors.js";
import { resolveLoginSecrets } from "./onepassword.js";
import { readRegistry, writeRegistry } from "./registry.js";
import { hostIsBotProtected, signedInByUrl, type Site } from "./sites.js";

const VIEWPORT = { width: 1280, height: 720 };
/** Browserbase writes context data when the session closes. Give that sync a moment. */
const CONTEXT_SYNC_MS = 3000;

export type OpenSessionRequest = {
  site: Site;
  apiKey: string;
  dataDir: string;
  keepAlive?: boolean;
  contextId?: string;
  allowProtected?: boolean;
};

export type AuthenticatedSession = {
  siteId: string;
  authenticated: true;
  reusedExistingLogin: boolean;
  contextId: string;
  sessionId: string;
  sessionUrl: string;
  liveViewUrl?: string;
  contextPersisted: boolean;
  handoff: {
    summary: string;
    browserbaseMcp:
      | { tool: "start"; sessionId: string }
      | { contextId: string; persist: "true" };
  };
};

export function contextName(siteId: string): string {
  return `login:${siteId}`;
}

export function sessionUrl(sessionId: string): string {
  return `https://www.browserbase.com/sessions/${sessionId}`;
}

export async function openAuthenticatedSession(
  request: OpenSessionRequest,
): Promise<AuthenticatedSession> {
  if (hostIsBotProtected(request.site.loginUrl) && !request.allowProtected) {
    throw new ServiceError(
      `${request.site.label} is on a site with bot protection. A free Browserbase plan does not include Verified sessions or residential proxies, so a plain login usually gets blocked. Pass allowProtected to try anyway, or point this site at a page that does not block cloud browsers.`,
      "bot_protected",
    );
  }

  const bb = new Browserbase({ apiKey: request.apiKey });
  const contextId = await ensureContext(bb, request);

  const browser = await browserbase.launch({
    apiKey: request.apiKey,
    keepAlive: Boolean(request.keepAlive),
    browserSettings: {
      context: { id: contextId, persist: true },
      viewport: VIEWPORT,
    },
    userMetadata: {
      service: "authenticated-sessions",
      siteId: request.site.id,
    },
  });

  const sessionId = browser.sessionId;
  if (!sessionId) {
    await browser.close();
    throw new ServiceError("Browserbase did not return a session id.", "missing_session");
  }

  let stagehand: Stagehand | undefined;
  let reusedExistingLogin = false;
  let outcome: "running" | "persisted" | "failed" = "failed";

  try {
    stagehand = await Stagehand.create({
      browser,
      cache: true,
      logging: { level: "error" },
    });

    const pages = await browser.context.pages();
    const page = pages[0] ?? (await browser.context.newPage());
    await page.setViewportSize(VIEWPORT.width, VIEWPORT.height);
    await page.goto(request.site.loginUrl, { waitUntil: "domcontentloaded" });

    reusedExistingLogin = await alreadySignedIn(page, request.site);
    if (!reusedExistingLogin) {
      await signIn(stagehand, page, request.site);
      const signedIn = await waitUntilSignedIn(page, request.site);
      if (!signedIn) {
        const url = await page.url();
        throw new ServiceError(
          `Login for ${request.site.id} did not reach a signed-in page. Current URL: ${url}`,
          "login_failed",
        );
      }
    }

    const live = await bb.sessions.debug(sessionId);
    const keepAlive = Boolean(request.keepAlive);
    outcome = keepAlive ? "running" : "persisted";

    return {
      siteId: request.site.id,
      authenticated: true,
      reusedExistingLogin,
      contextId,
      sessionId,
      sessionUrl: sessionUrl(sessionId),
      liveViewUrl: keepAlive ? live.debuggerFullscreenUrl : undefined,
      contextPersisted: !keepAlive,
      handoff: handoff(contextId, sessionId, keepAlive),
    };
  } finally {
    await stagehand?.close().catch(() => undefined);
    await browser.close().catch(() => undefined);
    if (outcome === "failed" && request.keepAlive) {
      await bb.sessions.update(sessionId, { status: "REQUEST_RELEASE" }).catch(() => undefined);
    }
    if (outcome === "persisted") {
      await delay(CONTEXT_SYNC_MS);
    }
  }
}

export async function releaseSession(apiKey: string, sessionId: string): Promise<void> {
  const bb = new Browserbase({ apiKey });
  await bb.sessions.update(sessionId, { status: "REQUEST_RELEASE" });
  await delay(CONTEXT_SYNC_MS);
}

function handoff(contextId: string, sessionId: string, keepAlive: boolean): AuthenticatedSession["handoff"] {
  if (keepAlive) {
    return {
      summary:
        "This cloud browser is still open and signed in. Pass sessionId to Browserbase MCP start. Close it with release when finished so the context saves cookies.",
      browserbaseMcp: {
        tool: "start",
        sessionId,
      },
    };
  }
  return {
    summary:
      "The login is stored in this Browserbase context (cookies and site storage). Start a later Browserbase MCP session with this context id and persist enabled. The next run opens already signed in.",
    browserbaseMcp: {
      contextId,
      persist: "true",
    },
  };
}

async function ensureContext(
  bb: Browserbase,
  request: OpenSessionRequest,
): Promise<string> {
  const registry = await readRegistry(request.dataDir);
  const knownId = request.contextId ?? registry.contexts[request.site.id];

  if (knownId) {
    try {
      await bb.contexts.retrieve(knownId);
      registry.contexts[request.site.id] = knownId;
      await writeRegistry(request.dataDir, registry);
      return knownId;
    } catch (error) {
      if (request.contextId || !(error instanceof NotFoundError)) throw error;
    }
  }

  try {
    const created = await bb.contexts.create({ name: contextName(request.site.id) });
    registry.contexts[request.site.id] = created.id;
    await writeRegistry(request.dataDir, registry);
    return created.id;
  } catch (error) {
    if (error instanceof ConflictError) {
      throw new ServiceError(
        `A Browserbase context named ${contextName(request.site.id)} already exists, and this service does not have its id. Pass the contextId returned by an earlier call.`,
        "context_id_required",
      );
    }
    throw error;
  }
}

async function alreadySignedIn(page: Page, site: Site): Promise<boolean> {
  if (signedInByUrl(await page.url(), site.loggedInUrlIncludes)) return true;
  if (!site.loggedInSelector) return false;
  try {
    return await page.waitForSelector(site.loggedInSelector, {
      state: "visible",
      timeout: 2000,
    });
  } catch {
    return false;
  }
}

async function signIn(stagehand: Stagehand, page: Page, site: Site): Promise<void> {
  const secrets = await resolveLoginSecrets(site.secrets);
  if (site.beforePassword) {
    await stagehand.act(site.beforePassword, { page });
    await page.waitForLoadState("domcontentloaded");
  }
  await stagehand.act(`type %username% into the ${site.usernameField} field`, {
    page,
    variables: { username: secrets.username },
    cache: false,
  });
  await stagehand.act(`type %password% into the ${site.passwordField} field`, {
    page,
    variables: { password: secrets.password },
    cache: false,
  });
  if (site.otpField && secrets.otp) {
    await stagehand.act(`type %otp% into the ${site.otpField} field`, {
      page,
      variables: { otp: secrets.otp },
      cache: false,
    });
  }
  await stagehand.act(`click the ${site.submitButton} button`, { page });
}

async function waitUntilSignedIn(page: Page, site: Site): Promise<boolean> {
  const matchedUrl = await page.evaluate(async (needle: string) => {
    const href = () =>
      (globalThis as { location?: { href: string } }).location?.href ?? "";
    const deadline = Date.now() + 20_000;
    while (Date.now() < deadline) {
      if (href().includes(needle)) return true;
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    return href().includes(needle);
  }, site.loggedInUrlIncludes);
  if (matchedUrl) return true;
  if (!site.loggedInSelector) return false;
  try {
    return await page.waitForSelector(site.loggedInSelector, {
      state: "visible",
      timeout: 3000,
    });
  } catch {
    return false;
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
