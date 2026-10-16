import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import type { ServiceConfig } from "../src/config.js";
import { ServiceError } from "../src/errors.js";
import { startHttpServer } from "../src/http.js";
import { readRegistry, writeRegistry } from "../src/registry.js";
import { hostIsBotProtected, signedInByUrl, siteSchema } from "../src/sites.js";
import { contextName, sessionUrl } from "../src/session.js";
import { errorPayload, listSites, openSession } from "../src/tools.js";

const practiceSite = {
  id: "practice-login",
  label: "Practice login form",
  loginUrl: "https://the-internet.herokuapp.com/login",
  usernameField: "Username",
  passwordField: "Password",
  submitButton: "Login",
  loggedInUrlIncludes: "/secure",
  secrets: {
    username: "op://Browserbase Agent/Practice Login/username",
    password: "op://Browserbase Agent/Practice Login/password",
  },
};

test("site catalog accepts op:// references and rejects raw passwords", () => {
  assert.equal(siteSchema.parse(practiceSite).id, "practice-login");
  assert.throws(() =>
    siteSchema.parse({
      ...practiceSite,
      secrets: { username: "tomsmith", password: "secret" },
    }),
  );
});

test("signed-in detection uses the configured URL fragment", () => {
  assert.equal(signedInByUrl("https://the-internet.herokuapp.com/secure", "/secure"), true);
  assert.equal(signedInByUrl("https://the-internet.herokuapp.com/login", "/secure"), false);
});

test("known bot-protected hosts are flagged before a session starts", () => {
  assert.equal(hostIsBotProtected("https://www.linkedin.com/login"), true);
  assert.equal(hostIsBotProtected("https://the-internet.herokuapp.com/login"), false);
});

test("context names and session links keep the full session id", () => {
  assert.equal(contextName("practice-login"), "login:practice-login");
  assert.equal(
    sessionUrl("11111111-2222-3333-4444-555555555555"),
    "https://www.browserbase.com/sessions/11111111-2222-3333-4444-555555555555",
  );
});

test("registry round-trips site ids to context ids", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "contexts-"));
  await writeRegistry(dir, { contexts: { "practice-login": "ctx_123" } });
  const stored = JSON.parse(await readFile(path.join(dir, "contexts.json"), "utf8")) as {
    contexts: Record<string, string>;
  };
  assert.deepEqual(await readRegistry(dir), stored);
});

test("open_authenticated_session refuses an unknown site before calling Browserbase", async () => {
  const config: ServiceConfig = {
    apiKey: "test-key",
    dataDir: "/tmp/unused",
    sitesFile: "/tmp/unused.json",
    host: "127.0.0.1",
    port: 0,
  };
  await assert.rejects(
    () =>
      openSession(
        {
          config,
          loadSites: async () => [siteSchema.parse(practiceSite)],
          openSession: async () => {
            throw new Error("Browserbase should not be called");
          },
        },
        { siteId: "missing" },
      ),
    (error: unknown) => error instanceof ServiceError && error.code === "unknown_site",
  );
});

test("a protected site returns a free-plan warning and does not open a session", async () => {
  let opened = false;
  const config: ServiceConfig = {
    apiKey: "test-key",
    dataDir: "/tmp/unused",
    sitesFile: "/tmp/unused.json",
    host: "127.0.0.1",
    port: 0,
  };
  const linkedin = siteSchema.parse({
    ...practiceSite,
    id: "linkedin",
    loginUrl: "https://www.linkedin.com/login",
    loggedInUrlIncludes: "/feed",
  });
  await assert.rejects(
    () =>
      openSession(
        {
          config,
          loadSites: async () => [linkedin],
          openSession: async (request) => {
            opened = true;
            return {
              siteId: request.site.id,
              authenticated: true,
              reusedExistingLogin: false,
              contextId: "ctx",
              sessionId: "sess",
              sessionUrl: sessionUrl("sess"),
              contextPersisted: true,
              handoff: {
                summary: "",
                browserbaseMcp: { contextId: "ctx", persist: "true" as const },
              },
            };
          },
        },
        { siteId: "linkedin" },
      ),
    (error: unknown) => error instanceof ServiceError && error.code === "bot_protected",
  );
  assert.equal(opened, false);
});

test("list_sites reports secret references and the protection flag", async () => {
  const sites = await listSites({
    config: {
      apiKey: "test-key",
      dataDir: "/tmp/unused",
      sitesFile: "/tmp/unused.json",
      host: "127.0.0.1",
      port: 0,
    },
    loadSites: async () => [siteSchema.parse(practiceSite)],
  });
  assert.equal(sites[0]?.secrets.username.startsWith("op://"), true);
  assert.equal(sites[0]?.botProtected, false);
});

test("HTTP open session returns the replay link", async () => {
  const server = await startHttpServer({
    config: {
      apiKey: "test-key",
      dataDir: "/tmp/unused",
      sitesFile: "/tmp/unused.json",
      host: "127.0.0.1",
      port: 0,
    },
    loadSites: async () => [siteSchema.parse(practiceSite)],
    openSession: async () => ({
      siteId: "practice-login",
      authenticated: true,
      reusedExistingLogin: false,
      contextId: "ctx_123",
      sessionId: "11111111-2222-3333-4444-555555555555",
      sessionUrl: sessionUrl("11111111-2222-3333-4444-555555555555"),
      contextPersisted: true,
      handoff: {
        summary: "stored",
        browserbaseMcp: { contextId: "ctx_123", persist: "true" },
      },
    }),
  });
  const address = server.address();
  const port = address && typeof address === "object" ? address.port : 0;
  try {
    const response = await fetch(`http://127.0.0.1:${port}/sessions`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ siteId: "practice-login" }),
    });
    assert.equal(response.status, 200);
    const body = (await response.json()) as { sessionUrl: string };
    assert.equal(
      body.sessionUrl,
      "https://www.browserbase.com/sessions/11111111-2222-3333-4444-555555555555",
    );
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
});

test("error payloads keep the service error code", () => {
  assert.deepEqual(errorPayload(new ServiceError("need a token", "missing_onepassword_token")), {
    code: "missing_onepassword_token",
    message: "need a token",
  });
});
