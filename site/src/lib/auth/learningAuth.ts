/**
 * Learning dashboard auth helpers.
 * Pure config (no NextAuth imports) so server pages and the proxy can share it.
 */

export const LEARNING_ALLOWED_EMAILS = [
  "tyler.lindow@gmail.com",
  "tyler@lindowlabs.dev",
] as const;

const ALLOWED = new Set(
  LEARNING_ALLOWED_EMAILS.map((email) => email.toLowerCase())
);

/** True when Google OAuth env vars are present enough to attempt sign-in. */
export function isAuthConfigured(): boolean {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.AUTH_GOOGLE_ID &&
      process.env.AUTH_GOOGLE_SECRET
  );
}

/**
 * Local/dev screenshot bypass. Never set on Vercel production.
 * When true, /learning renders the dashboard without Google sign-in.
 */
export function isLearningAuthBypass(): boolean {
  return process.env.LEARNING_AUTH_BYPASS === "1";
}

export function isLearningEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return ALLOWED.has(email.trim().toLowerCase());
}
