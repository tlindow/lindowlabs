import path from "node:path";

export type ServiceConfig = {
  apiKey: string;
  dataDir: string;
  sitesFile: string;
  host: string;
  port: number;
  authToken?: string;
};

export function loadConfig(cwd = process.cwd()): ServiceConfig {
  const apiKey = process.env.BROWSERBASE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("BROWSERBASE_API_KEY is required.");
  }

  const host = process.env.HOST?.trim() || "127.0.0.1";
  const authToken = process.env.SERVICE_AUTH_TOKEN?.trim() || undefined;
  if (host !== "127.0.0.1" && host !== "localhost" && !authToken) {
    throw new Error(
      "Set SERVICE_AUTH_TOKEN before binding the HTTP server to a non-local host.",
    );
  }

  return {
    apiKey,
    dataDir: path.resolve(cwd, process.env.DATA_DIR?.trim() || "data"),
    sitesFile: path.resolve(cwd, process.env.SITES_FILE?.trim() || "sites.json"),
    host,
    port: Number(process.env.PORT || 8787),
    authToken,
  };
}
