import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { loadConfig } from "./config.js";
import { errorPayload, listContexts, listSites, openSession, release, type ToolDeps } from "./tools.js";

type Json = Record<string, unknown>;

export function startHttpServer(deps: ToolDeps) {
  const server = createServer(async (req, res) => {
    try {
      if (!authorized(req, deps.config.authToken)) {
        send(res, 401, { code: "unauthorized", message: "Send Authorization: Bearer <SERVICE_AUTH_TOKEN>." });
        return;
      }
      const url = new URL(req.url ?? "/", "http://127.0.0.1");
      if (req.method === "GET" && url.pathname === "/health") {
        send(res, 200, { ok: true });
        return;
      }
      if (req.method === "GET" && url.pathname === "/sites") {
        send(res, 200, { sites: await listSites(deps) });
        return;
      }
      if (req.method === "GET" && url.pathname === "/contexts") {
        send(res, 200, { contexts: await listContexts(deps) });
        return;
      }
      if (req.method === "POST" && url.pathname === "/sessions") {
        const body = await readJson(req);
        const result = await openSession(deps, {
          siteId: stringField(body, "siteId"),
          keepAlive: booleanField(body, "keepAlive"),
          contextId: optionalString(body, "contextId"),
          allowProtected: booleanField(body, "allowProtected"),
        });
        send(res, 200, result);
        return;
      }
      const releaseMatch = url.pathname.match(/^\/sessions\/([^/]+)\/release$/);
      if (req.method === "POST" && releaseMatch) {
        send(res, 200, await release(deps, decodeURIComponent(releaseMatch[1])));
        return;
      }
      send(res, 404, { code: "not_found", message: "Not found" });
    } catch (error) {
      const payload = errorPayload(error);
      const status = clientError(payload.code) ? 400 : 500;
      send(res, status, payload);
    }
  });

  return new Promise<ReturnType<typeof createServer>>((resolve) => {
    server.listen(deps.config.port, deps.config.host, () => resolve(server));
  });
}

function clientError(code: string): boolean {
  return (
    code === "unknown_site" ||
    code === "bad_request" ||
    code === "bot_protected" ||
    code === "missing_onepassword_token" ||
    code === "context_id_required"
  );
}

function authorized(req: IncomingMessage, token: string | undefined): boolean {
  if (!token) return true;
  return req.headers.authorization === `Bearer ${token}`;
}

function send(res: ServerResponse, status: number, body: unknown): void {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

async function readJson(req: IncomingMessage): Promise<Json> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > 1_000_000) throw Object.assign(new Error("Request body is too large."), { code: "bad_request" });
    chunks.push(buffer);
  }
  if (chunks.length === 0) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("JSON body must be an object.");
    }
    return parsed as Json;
  } catch (error) {
    if (error instanceof Error && "code" in error) throw error;
    throw Object.assign(new Error("Request body must be JSON."), { code: "bad_request" });
  }
}

function stringField(body: Json, key: string): string {
  const value = body[key];
  if (typeof value !== "string" || value.trim() === "") {
    throw Object.assign(new Error(`${key} is required.`), { code: "bad_request" });
  }
  return value;
}

function optionalString(body: Json, key: string): string | undefined {
  const value = body[key];
  if (value === undefined) return undefined;
  if (typeof value !== "string" || value.trim() === "") {
    throw Object.assign(new Error(`${key} must be a string.`), { code: "bad_request" });
  }
  return value;
}

function booleanField(body: Json, key: string): boolean | undefined {
  const value = body[key];
  if (value === undefined) return undefined;
  if (typeof value !== "boolean") {
    throw Object.assign(new Error(`${key} must be a boolean.`), { code: "bad_request" });
  }
  return value;
}

async function main(): Promise<void> {
  const config = loadConfig();
  const server = await startHttpServer({ config });
  const address = server.address();
  const port = address && typeof address === "object" ? address.port : config.port;
  console.log(`Authenticated sessions listening on http://${config.host}:${port}`);
}

if (process.argv[1]?.endsWith("http.ts")) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
