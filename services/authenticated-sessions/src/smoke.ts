import { Browserbase } from "@browserbasehq/sdk";
import { browserbase } from "@browserbasehq/stagehand";
import { sessionUrl } from "./session.js";

const VIEWPORT = { width: 1280, height: 720 };

export async function runSmoke(apiKey: string): Promise<{ sessionId: string; sessionUrl: string; title: string; status: string }> {
  const bb = new Browserbase({ apiKey });
  const context = await bb.contexts.create({
    name: `smoke-${Date.now()}`,
  });

  const browser = await browserbase.launch({
    apiKey,
    browserSettings: {
      context: { id: context.id, persist: true },
      viewport: VIEWPORT,
    },
    userMetadata: { service: "authenticated-sessions", purpose: "smoke" },
  });

  const sessionId = browser.sessionId;
  if (!sessionId) {
    await browser.close();
    throw new Error("Browserbase did not return a session id.");
  }

  try {
    const pages = await browser.context.pages();
    const page = pages[0] ?? (await browser.context.newPage());
    await page.setViewportSize(VIEWPORT.width, VIEWPORT.height);
    await page.goto("https://example.com", { waitUntil: "domcontentloaded" });
    const title = await page.title();
    await browser.close();
    const session = await bb.sessions.retrieve(sessionId);
    await bb.contexts.delete(context.id);
    return {
      sessionId,
      sessionUrl: sessionUrl(sessionId),
      title,
      status: session.status,
    };
  } catch (error) {
    await browser.close().catch(() => undefined);
    await bb.contexts.delete(context.id).catch(() => undefined);
    throw error;
  }
}
