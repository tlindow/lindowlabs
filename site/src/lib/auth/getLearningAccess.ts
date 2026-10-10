import { cookies } from "next/headers";
import {
  isAuthConfigured,
  isLearningAuthBypass,
  isLearningAuthBypassOwner,
  STYTCH_SESSION_COOKIE,
} from "@/lib/auth/learningAuth";
import {
  getOwnerPhones,
  getOwnerUserIds,
  isLearningOwner,
  pickDisplayPhone,
  readOwnerPhonesEnv,
} from "@/lib/auth/learningOwner";
import {
  authenticateSession,
  resolveUserPhonesForAccess,
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
 * Temporary non-PII owner-gate diagnostics for production runtime logs.
 * Booleans/counts only — never phone numbers or user ids.
 */
function logOwnerGateDiag(diag: {
  hasUserId: boolean;
  phonesFromUserCount: number;
  phonesFromFactorsCount: number;
  usersGetCalled: boolean;
  usersGetOk: boolean;
  phonesFoundCount: number;
  ownerEnvPresent: boolean;
  ownerEnvCount: number;
  ownerUserIdsPresent: boolean;
  ownerUserIdsCount: number;
  matched: boolean;
}) {
  console.info("[learning-owner-gate]", JSON.stringify(diag));
}

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

    // sessions/authenticate may omit user.phone_numbers; resolveUserPhonesForAccess
    // reads phone_number_factor from factors, then users.get(user_id).
    const { phones, diag: phoneDiag } =
      await resolveUserPhonesForAccess(session);
    const phone = pickDisplayPhone(phones);
    const isOwner = isLearningOwner({ userId: user.user_id, phones });

    const ownerPhones = getOwnerPhones();
    const ownerUserIds = getOwnerUserIds();
    logOwnerGateDiag({
      hasUserId: true,
      phonesFromUserCount: phoneDiag.phonesFromUserCount,
      phonesFromFactorsCount: phoneDiag.phonesFromFactorsCount,
      usersGetCalled: phoneDiag.usersGetCalled,
      usersGetOk: phoneDiag.usersGetOk,
      phonesFoundCount: phoneDiag.phonesFoundCount,
      ownerEnvPresent: Boolean(readOwnerPhonesEnv()?.trim()),
      ownerEnvCount: ownerPhones.size,
      ownerUserIdsPresent: ownerUserIds.size > 0,
      ownerUserIdsCount: ownerUserIds.size,
      matched: isOwner,
    });

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
