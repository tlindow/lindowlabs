import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { isLearningEmailAllowed } from "@/lib/auth/learningAuth";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";

/**
 * Auth.js (NextAuth v5) for the private /learning dashboard.
 * Google reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET at request time.
 * Pages and the proxy call isAuthConfigured() so missing env shows a
 * calm message instead of attempting sign-in.
 *
 * Route protection lives in src/proxy.ts (not an authorized callback) so
 * unauthenticated visitors redirect to Google instead of looping on /learning.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  pages: {
    error: "/learning/unauthorized",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const email =
        typeof profile?.email === "string" ? profile.email : undefined;
      const verified =
        typeof profile === "object" &&
        profile !== null &&
        "email_verified" in profile &&
        Boolean((profile as { email_verified?: boolean }).email_verified);
      if (!verified) return false;
      return isLearningEmailAllowed(email);
    },
  },
  trustHost: true,
});

/** Canonical callback URL helpers for docs / setup instructions. */
export const LEARNING_AUTH_CALLBACK_PATH = "/api/auth/callback/google";
export const LEARNING_AUTH_CALLBACK_URL = new URL(
  LEARNING_AUTH_CALLBACK_PATH,
  LEARNING_DASHBOARD_URL
).toString();
