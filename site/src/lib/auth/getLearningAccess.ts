import { cookies } from "next/headers";
import {
  isAuthConfigured,
  isLearningAuthBypass,
  isLearningUserAllowed,
  pickDisplayEmail,
  STYTCH_SESSION_COOKIE,
} from "@/lib/auth/learningAuth";
import {
  authenticateSession,
  emailsFromStytchUser,
} from "@/lib/stytch";

export type LearningAccess =
  | { status: "ok"; email: string | null; bypass: boolean }
  | { status: "not-configured" }
  | { status: "unauthorized"; email: string | null }
  | { status: "signed-out" };

/**
 * Server-side access gate for /learning.
 * Validates the Stytch session cookie against Stytch's API, then apply
 * the email allowlist (same addresses as before).
 */
export async function getLearningAccess(): Promise<LearningAccess> {
  if (isLearningAuthBypass()) {
    return { status: "ok", email: "bypass@local", bypass: true };
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
    const emails = emailsFromStytchUser(session.user);
    const email = pickDisplayEmail(emails);

    if (!isLearningUserAllowed(emails)) {
      return { status: "unauthorized", email };
    }

    return { status: "ok", email, bypass: false };
  } catch {
    return { status: "signed-out" };
  }
}
