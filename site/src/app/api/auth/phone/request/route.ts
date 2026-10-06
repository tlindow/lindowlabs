import { NextResponse } from "next/server";
import { isAuthConfigured } from "@/lib/auth/learningAuth";
import { sendSmsOtp, StytchError } from "@/lib/stytch";

export const dynamic = "force-dynamic";

/** POST /api/auth/phone/request — same shape as Tinker. */
export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: "Stytch is not configured on this deployment." },
      { status: 503 }
    );
  }

  let body: { phone?: string };
  try {
    body = (await request.json()) as { phone?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phone = body?.phone;
  if (typeof phone !== "string" || !phone.trim()) {
    return NextResponse.json({ error: "phone is required" }, { status: 400 });
  }

  try {
    const stytch = await sendSmsOtp(phone);
    return NextResponse.json({
      phone_id: stytch.phone_id,
      isNew: Boolean(stytch.user_created),
    });
  } catch (err) {
    const status =
      err instanceof StytchError && err.status >= 400 ? err.status : 502;
    const message =
      err instanceof Error ? err.message : "Stytch request failed";
    return NextResponse.json({ error: message }, { status });
  }
}
