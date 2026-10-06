import { NextResponse } from "next/server";
import {
  isAuthConfigured,
  STYTCH_SESSION_COOKIE,
} from "@/lib/auth/learningAuth";
import { authenticateOtp, StytchError } from "@/lib/stytch";

export const dynamic = "force-dynamic";

const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days, matches Tinker

/** POST /api/auth/phone/verify — same shape as Tinker; sets httpOnly cookie. */
export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Stytch is not configured on this deployment." },
      { status: 503 }
    );
  }

  let body: { phone_id?: string; pin?: string; code?: string };
  try {
    body = (await request.json()) as {
      phone_id?: string;
      pin?: string;
      code?: string;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phoneId = body?.phone_id;
  const pin = body?.pin || body?.code;

  try {
    const stytch = await authenticateOtp(String(phoneId || ""), String(pin || ""));
    if (!stytch.session_token) {
      return NextResponse.json(
        { error: "Stytch returned no session token." },
        { status: 502 }
      );
    }

    const isNew = looksFreshlyCreated(stytch.user?.created_at);
    const response = NextResponse.json({
      token: stytch.session_token,
      isNew,
    });

    response.cookies.set({
      name: STYTCH_SESSION_COOKIE,
      value: stytch.session_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
    });

    return response;
  } catch (err) {
    const status =
      err instanceof StytchError && err.status >= 400 ? err.status : 502;
    const message =
      err instanceof Error ? err.message : "Stytch verify failed";
    return NextResponse.json({ error: message }, { status });
  }
}

function looksFreshlyCreated(createdAt: string | undefined): boolean {
  if (!createdAt) return false;
  const ms = Date.parse(createdAt);
  if (Number.isNaN(ms)) return false;
  return Date.now() - ms < 2 * 60 * 1000;
}
