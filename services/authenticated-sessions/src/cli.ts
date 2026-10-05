import { loadConfig } from "./config.js";
import { runSmoke } from "./smoke.js";
import { errorPayload, openSession, release } from "./tools.js";

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);
  if (command === "smoke") {
    const config = loadConfig();
    const result = await runSmoke(config.apiKey);
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (command === "login") {
    const config = loadConfig();
    const siteId = flag(args, "--site");
    if (!siteId) throw new Error("Pass --site <id>.");
    const result = await openSession(
      { config },
      {
        siteId,
        keepAlive: args.includes("--keep-alive"),
        contextId: flag(args, "--context"),
        allowProtected: args.includes("--allow-protected"),
      },
    );
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (command === "release") {
    const config = loadConfig();
    const sessionId = flag(args, "--session");
    if (!sessionId) throw new Error("Pass --session <id>.");
    console.log(JSON.stringify(await release({ config }, sessionId), null, 2));
    return;
  }
  throw new Error("Usage: tsx src/cli.ts <smoke|login|release>");
}

function flag(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}

main().catch((error: unknown) => {
  console.error(JSON.stringify(errorPayload(error)));
  process.exit(1);
});
