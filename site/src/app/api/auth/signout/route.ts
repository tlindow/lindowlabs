import { NextResponse } from "next/server";
import { STYTCH_SESSION_COOKIE } from "@/lib/auth/learningAuth";

export const dynamic = "force-dynamic";

/** POST /api/auth/signout — clear the Stytch session cookie. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: STYTCH_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
