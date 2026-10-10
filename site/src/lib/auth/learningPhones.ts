/**
 * Phone normalization helpers for /learning Stytch SMS OTP.
 * Owner phone lists are read via learningOwner.ts (LEARNING_OWNER_PHONES,
 * falling back to LEARNING_ALLOWED_PHONES). Never hardcode Tyler's number
 * here so it cannot leak into the static export bundle.
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

/** Parse comma/space-separated E.164 phone env values into a Set. */
export function parseAllowedPhones(raw: string | undefined | null): Set<string> {
  if (!raw || !raw.trim()) return new Set();
  const out = new Set<string>();
  for (const part of raw.split(/[\s,]+/)) {
    const e164 = normalizeE164(part);
    if (e164) out.add(e164);
  }
  return out;
}

/** True when the phone matches any entry in the given env-style list. */
export function isLearningPhoneAllowed(
  phone: string | null | undefined,
  envValue: string | undefined
): boolean {
  const e164 = normalizeE164(phone);
  if (!e164) return false;
  return parseAllowedPhones(envValue).has(e164);
}

/** True when any of the given phones matches the env-style list. */
export function isLearningPhonesAllowed(
  phones: string[],
  envValue: string | undefined
): boolean {
  return phones.some((phone) => isLearningPhoneAllowed(phone, envValue));
}
