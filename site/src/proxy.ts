import { NextResponse, type NextRequest } from "next/server";
import {
  isAuthConfigured,
  isLearningAuthBypass,
  isLearningUserAllowed,
  STYTCH_SESSION_COOKIE,
} from "@/lib/auth/learningAuth";
import {
  authenticateSession,
  phonesFromStytchUser,
} from "@/lib/stytch";

/**
 * Next.js 16 proxy. Protects /learning on the server using the same Stytch
 * session cookie the phone OTP verify route sets. Missing env vars pass
 * through so the page can show "sign-in not configured yet".
 *
 * Signed-out visitors reach /learning (phone sign-in UI). Authenticated
 * but not-allowlisted visitors are sent to /learning/unauthorized.
 */
export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/learning")) {
    return NextResponse.next();
  }

  if (!isAuthConfigured() || isLearningAuthBypass()) {
    return NextResponse.next();
  }

  if (path.startsWith("/learning/unauthorized")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(STYTCH_SESSION_COOKIE)?.value;
  if (!token) {
    // Page renders the SMS OTP gate.
    return NextResponse.next();
  }

  try {
    const session = await authenticateSession(token);
    const phones = phonesFromStytchUser(session.user);
    if (!isLearningUserAllowed(phones)) {
      return NextResponse.redirect(
        new URL("/learning/unauthorized", req.nextUrl.origin)
      );
    }
    return NextResponse.next();
  } catch {
    // Expired/invalid cookie: clear and show the sign-in gate.
    const response = NextResponse.next();
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
}

export const config = {
  matcher: ["/learning", "/learning/:path*"],
};
