import { cookies } from "next/headers";
import {
  isAuthConfigured,
  isLearningAuthBypass,
  isLearningAuthBypassOwner,
  STYTCH_SESSION_COOKIE,
} from "@/lib/auth/learningAuth";
import {
  isLearningOwner,
  pickDisplayPhone,
} from "@/lib/auth/learningOwner";
import {
  authenticateSession,
  phonesFromStytchUser,
} from "@/lib/stytch";

export type LearningAccess =
  | {
      status: "ok";
      userId: string;
      phone: string | null;
      isOwner: boolean;
      bypass: boolean;
    }
  | { status: "not-configured" }
  | { status: "signed-out" };

/**
 * Server-side access gate for /learning.
 * Validates the Stytch session cookie against Stytch's API.
 * Any authenticated user is allowed onto their own desk; ownership
 * (personalized curriculum) is resolved separately via env.
 */
export async function getLearningAccess(): Promise<LearningAccess> {
  if (isLearningAuthBypass()) {
    const isOwner = isLearningAuthBypassOwner();
    return {
      status: "ok",
      userId: isOwner ? "bypass-owner" : "bypass-guest",
      phone: "bypass",
      isOwner,
      bypass: true,
    };
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
    const user = session.user;
    if (!user?.user_id) {
      // Fail closed: session without a user id cannot be scoped.
      return { status: "signed-out" };
    }

    const phones = phonesFromStytchUser(user);
    const phone = pickDisplayPhone(phones);
    const isOwner = isLearningOwner({ userId: user.user_id, phones });

    return {
      status: "ok",
      userId: user.user_id,
      phone,
      isOwner,
      bypass: false,
    };
  } catch {
    return { status: "signed-out" };
  }
}
