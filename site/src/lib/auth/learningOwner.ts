/**
 * Server-side ownership for the /learning desk.
 * Anyone with a valid Stytch session can sign in; only the owner account
 * receives Tyler's personalized curriculum. Ownership is mapped from env
 * (never hardcoded phone strings in the client bundle):
 *   LEARNING_OWNER_PHONES  — preferred; falls back to LEARNING_ALLOWED_PHONES
 *   LEARNING_OWNER_USER_IDS — optional Stytch user_id list
 * Fail closed: empty / unset owner env → nobody is owner.
 */

import {
  isLearningPhonesAllowed,
  normalizeE164,
  parseAllowedPhones,
} from "@/lib/auth/learningPhones";

/** Prefer LEARNING_OWNER_PHONES; reuse LEARNING_ALLOWED_PHONES when unset. */
export function readOwnerPhonesEnv(
  env: NodeJS.ProcessEnv = process.env
): string | undefined {
  const owner = env.LEARNING_OWNER_PHONES;
  if (owner && owner.trim()) return owner;
  const legacy = env.LEARNING_ALLOWED_PHONES;
  if (legacy && legacy.trim()) return legacy;
  return undefined;
}

export function getOwnerPhones(
  env: NodeJS.ProcessEnv = process.env
): Set<string> {
  return parseAllowedPhones(readOwnerPhonesEnv(env));
}

export function parseOwnerUserIds(raw: string | undefined | null): Set<string> {
  if (!raw || !raw.trim()) return new Set();
  const out = new Set<string>();
  for (const part of raw.split(/[\s,]+/)) {
    const id = part.trim();
    if (id) out.add(id);
  }
  return out;
}

export function getOwnerUserIds(
  env: NodeJS.ProcessEnv = process.env
): Set<string> {
  return parseOwnerUserIds(env.LEARNING_OWNER_USER_IDS);
}

export type LearningOwnerIdentity = {
  userId: string | null | undefined;
  phones: string[];
};

/**
 * True when this Stytch identity owns the personalized curriculum.
 * Matches LEARNING_OWNER_USER_IDS first, then owner phone env. Fail closed.
 */
export function isLearningOwner(
  identity: LearningOwnerIdentity,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const ownerIds = getOwnerUserIds(env);
  const ownerPhones = getOwnerPhones(env);
  if (ownerIds.size === 0 && ownerPhones.size === 0) return false;

  const userId = identity.userId?.trim();
  if (userId && ownerIds.has(userId)) return true;

  if (ownerPhones.size === 0) return false;
  return isLearningPhonesAllowed(identity.phones, readOwnerPhonesEnv(env));
}

/** Display phone: first owner match, else first phone, else null. */
export function pickDisplayPhone(
  phones: string[],
  env: NodeJS.ProcessEnv = process.env
): string | null {
  const ownerEnv = readOwnerPhonesEnv(env);
  const owners = parseAllowedPhones(ownerEnv);
  for (const phone of phones) {
    const e164 = normalizeE164(phone);
    if (e164 && owners.has(e164)) return phone;
  }
  return phones[0] ?? null;
}
