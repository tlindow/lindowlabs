import { NextResponse } from "next/server";
import { emitClickLog } from "@/lib/clicks/log";

export const dynamic = "force-dynamic";

type ClickBody = {
  path?: string;
  query?: string;
  referrer?: string;
  userAgent?: string;
};

function parseBody(raw: string): ClickBody | null {
  if (!raw || raw.length > 8_192) return null;
  try {
    return JSON.parse(raw) as ClickBody;
  } catch {
    return null;
  }
}

/**
 * Public ingest for page-view click logging (outreach UTM tags, etc.).
 * Accepts JSON or text/plain JSON (sendBeacon). Writes one structured
 * console.log line for Vercel Runtime Logs; no external store.
 */
export async function POST(req: Request) {
  let raw = "";
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ error: "bad_body" }, { status: 400 });
  }

  const body = parseBody(raw);
  if (!body || typeof body.path !== "string") {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const headerUa = req.headers.get("user-agent") || "";
  const headerRef = req.headers.get("referer") || "";

  emitClickLog({
    path: body.path,
    query: typeof body.query === "string" ? body.query : "",
    referrer:
      typeof body.referrer === "string" && body.referrer
        ? body.referrer
        : headerRef,
    userAgent:
      typeof body.userAgent === "string" && body.userAgent
        ? body.userAgent
        : headerUa,
  });

  return NextResponse.json({ ok: true });
}
