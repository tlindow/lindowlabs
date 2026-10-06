import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  isAuthConfigured,
  isLearningAuthBypass,
  isLearningEmailAllowed,
} from "@/lib/auth/learningAuth";

/**
 * Next.js 16 proxy (formerly middleware). Protects /learning on the server.
 * When auth env vars are missing, requests pass through so the page can show
 * "sign-in not configured yet" instead of crashing.
 */
export const proxy = auth((req) => {
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

  const email = req.auth?.user?.email;
  if (req.auth && !isLearningEmailAllowed(email)) {
    const unauthorized = new URL("/learning/unauthorized", req.nextUrl.origin);
    return NextResponse.redirect(unauthorized);
  }

  if (!req.auth) {
    const signInUrl = new URL("/api/auth/signin/google", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/learning", "/learning/:path*"],
};
