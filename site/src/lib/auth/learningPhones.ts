/**
 * Server-side phone allowlist for /learning Stytch SMS OTP.
 * Numbers come from LEARNING_ALLOWED_PHONES (comma/space-separated E.164).
 * Empty / unset → nobody is allowed (fail closed). Never hardcode Tyler's
 * number here so it cannot leak into the static export bundle.
 */

/** Normalize US / E.164 input to +1XXXXXXXXXX. Returns null if invalid. */
export function normalizeE164(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (trimmed.startsWith("+") && digits.length >= 10 && digits.length <= 15) {
    return `+${digits}`;
  }
  return null;
}

/** Parse LEARNING_ALLOWED_PHONES-style env value into a Set of E.164 strings. */
export function parseAllowedPhones(raw: string | undefined | null): Set<string> {
  if (!raw || !raw.trim()) return new Set();
  const out = new Set<string>();
  for (const part of raw.split(/[\s,]+/)) {
    const e164 = normalizeE164(part);
    if (e164) out.add(e164);
  }
  return out;
}

/** Read the allowlist from process.env (server only). */
export function getAllowedPhones(
  envValue: string | undefined = process.env.LEARNING_ALLOWED_PHONES
): Set<string> {
  return parseAllowedPhones(envValue);
}

/** True when the phone (any common US / E.164 form) is on the allowlist. */
export function isLearningPhoneAllowed(
  phone: string | null | undefined,
  envValue: string | undefined = process.env.LEARNING_ALLOWED_PHONES
): boolean {
  const e164 = normalizeE164(phone);
  if (!e164) return false;
  return getAllowedPhones(envValue).has(e164);
}

/** True when any of the given phones is allowlisted. */
export function isLearningPhonesAllowed(
  phones: string[],
  envValue: string | undefined = process.env.LEARNING_ALLOWED_PHONES
): boolean {
  return phones.some((phone) => isLearningPhoneAllowed(phone, envValue));
}

/** Friendly refusal shown to non-allowlisted numbers (no allowlist details). */
export const LEARNING_PHONE_REFUSED_MESSAGE =
  "This number can't sign in here.";
