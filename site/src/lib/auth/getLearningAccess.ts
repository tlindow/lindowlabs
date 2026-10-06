import { cookies } from "next/headers";
import {
  isAuthConfigured,
  isLearningAuthBypass,
  isLearningUserAllowed,
  pickDisplayPhone,
  STYTCH_SESSION_COOKIE,
} from "@/lib/auth/learningAuth";
import {
  authenticateSession,
  phonesFromStytchUser,
} from "@/lib/stytch";

export type LearningAccess =
  | { status: "ok"; phone: string | null; bypass: boolean }
  | { status: "not-configured" }
  | { status: "unauthorized"; phone: string | null }
  | { status: "signed-out" };

/**
 * Server-side access gate for /learning.
 * Validates the Stytch session cookie against Stytch's API, then applies
 * the LEARNING_ALLOWED_PHONES allowlist.
 */
export async function getLearningAccess(): Promise<LearningAccess> {
  if (isLearningAuthBypass()) {
    return { status: "ok", phone: "bypass", bypass: true };
  }

  if (!isAuthConfigured()) {
    return { status: "not-configured" };
  }

  const jar = await cookies();
  const token = jar.get(STYTCH_SESSION_COOKIE)?.value;
  if (!token) {
    return { status: "signed-out" };
  }

  try {
    const session = await authenticateSession(token);
    const phones = phonesFromStytchUser(session.user);
    const phone = pickDisplayPhone(phones);

    if (!isLearningUserAllowed(phones)) {
      return { status: "unauthorized", phone };
    }

    return { status: "ok", phone, bypass: false };
  } catch {
    return { status: "signed-out" };
  }
}
