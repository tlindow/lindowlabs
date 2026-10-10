/**
 * Learning dashboard auth helpers shared by the proxy and server pages.
 * Stytch SMS OTP (same project / env names as Tinker).
 * Any valid phone can sign in; curriculum ownership is separate
 * (see learningOwner.ts / LEARNING_OWNER_PHONES).
 */

/** httpOnly cookie holding the Stytch session_token. */
export const STYTCH_SESSION_COOKIE = "stytch_session";

/** True when Tinker-compatible Stytch env vars are present. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.STYTCH_PROJECT_ID && process.env.STYTCH_SECRET);
}

/**
 * Local/dev screenshot bypass. Never set on Vercel production.
 * When true, /learning renders without Stytch sign-in.
 * LEARNING_AUTH_BYPASS_OWNER=0 → non-owner empty desk (for screenshots).
 */
export function isLearningAuthBypass(): boolean {
  return process.env.LEARNING_AUTH_BYPASS === "1";
}

/** Bypass role: owner curriculum vs empty starter. Default owner. */
export function isLearningAuthBypassOwner(): boolean {
  return process.env.LEARNING_AUTH_BYPASS_OWNER !== "0";
}
