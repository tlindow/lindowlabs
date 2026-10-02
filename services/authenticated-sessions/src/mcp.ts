import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { loadConfig } from "./config.js";
import { errorPayload, listContexts, listSites, openSession, release, type ToolDeps } from "./tools.js";

const instructions = [
  "This service signs a Browserbase cloud browser into sites whose credentials live in 1Password.",
  "Call open_authenticated_session with a site id from list_sites.",
  "A Browserbase context stores the resulting cookies and site storage. Pass the returned contextId to a later Browserbase MCP session with persist enabled, and that browser opens already signed in.",
  "Pass keepAlive true only when another agent must attach to this same session immediately. Then call release_session so the context is saved.",
  "Never ask for or invent a Browserbase project id. The API key identifies the project.",
].join(" ");

export function createMcpServer(deps: ToolDeps): McpServer {
  const server = new McpServer(
    { name: "authenticated-sessions", version: "1.0.0" },
    { instructions },
  );

  server.registerTool(
    "list_sites",
    {
      title: "List login sites",
      description: "List sites this service can sign into. Credentials are op:// references, not passwords.",
      inputSchema: {},
    },
    async () => textResult(await listSites(deps)),
  );

  server.registerTool(
    "list_contexts",
    {
      title: "List saved login contexts",
      description: "Map each site id to the Browserbase context id that holds its saved login.",
      inputSchema: {},
    },
    async () => textResult(await listContexts(deps)),
  );

  server.registerTool(
    "open_authenticated_session",
    {
      title: "Open an authenticated browser session",
      description:
        "Open a Browserbase session for a configured site. Reuse the saved context when the browser is already signed in. Otherwise resolve 1Password op:// references and sign in. Returns the context id and session replay link.",
      inputSchema: {
        siteId: z.string(),
        keepAlive: z.boolean().optional(),
        contextId: z.string().optional(),
        allowProtected: z.boolean().optional(),
      },
    },
    async (input) => {
      try {
        return textResult(await openSession(deps, input));
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "release_session",
    {
      title: "Release a kept-alive session",
      description:
        "End a session opened with keepAlive so Browserbase writes cookies back to the context.",
      inputSchema: { sessionId: z.string() },
    },
    async ({ sessionId }) => {
      try {
        return textResult(await release(deps, sessionId));
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  return server;
}

function textResult(value: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }] };
}

function errorResult(error: unknown) {
  return {
    isError: true,
    content: [{ type: "text" as const, text: JSON.stringify(errorPayload(error), null, 2) }],
  };
}

async function main(): Promise<void> {
  const server = createMcpServer({ config: loadConfig() });
  await server.connect(new StdioServerTransport());
}

if (process.argv[1]?.endsWith("mcp.ts")) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
