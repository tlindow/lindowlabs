/**
 * Learning dashboard auth helpers shared by the proxy and server pages.
 * Stytch SMS OTP (same project / env names as Tinker).
 */

export const LEARNING_ALLOWED_EMAILS = [
  "tyler.lindow@gmail.com",
  "tyler@lindowlabs.dev",
] as const;

const ALLOWED = new Set(
  LEARNING_ALLOWED_EMAILS.map((email) => email.toLowerCase())
);

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

export function isLearningEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED.has(email.trim().toLowerCase());
}

/** True when any of the Stytch user's emails is on the allowlist. */
export function isLearningUserAllowed(emails: string[]): boolean {
  return emails.some((email) => isLearningEmailAllowed(email));
}

/** Pick a display email: first allowlisted match, else first email, else null. */
export function pickDisplayEmail(emails: string[]): string | null {
  const allowed = emails.find((email) => isLearningEmailAllowed(email));
  if (allowed) return allowed;
  return emails[0] ?? null;
}
