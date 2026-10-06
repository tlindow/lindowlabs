/**
 * Learning dashboard auth helpers shared by the proxy and server pages.
 * Stytch SMS OTP (same project / env names as Tinker).
 * Access is gated by LEARNING_ALLOWED_PHONES (server-side only).
 */

import {
  isLearningPhoneAllowed,
  isLearningPhonesAllowed,
} from "@/lib/auth/learningPhones";

/** httpOnly cookie holding the Stytch session_token. */
export const STYTCH_SESSION_COOKIE = "stytch_session";

/** True when Tinker-compatible Stytch env vars are present. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.STYTCH_PROJECT_ID && process.env.STYTCH_SECRET);
}

/**
 * Local/dev screenshot bypass. Never set on Vercel production.
 * When true, /learning renders the dashboard without Stytch sign-in.
 */
export function isLearningAuthBypass(): boolean {
  return process.env.LEARNING_AUTH_BYPASS === "1";
}

export { isLearningPhoneAllowed, isLearningPhonesAllowed };

/** True when any of the Stytch user's phone numbers is on the allowlist. */
export function isLearningUserAllowed(phones: string[]): boolean {
  return isLearningPhonesAllowed(phones);
}

/** Pick a display phone: first allowlisted match, else first phone, else null. */
export function pickDisplayPhone(phones: string[]): string | null {
  const allowed = phones.find((phone) => isLearningPhoneAllowed(phone));
  if (allowed) return allowed;
  return phones[0] ?? null;
}
