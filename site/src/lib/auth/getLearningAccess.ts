import {
  isAuthConfigured,
  isLearningAuthBypass,
  isLearningEmailAllowed,
} from "@/lib/auth/learningAuth";

export type LearningAccess =
  | { status: "ok"; email: string | null; bypass: boolean }
  | { status: "not-configured" }
  | { status: "unauthorized"; email: string | null }
  | { status: "signed-out" };

/**
 * Server-side access gate for /learning.
 * Call from Server Components; do not rely on the proxy alone.
 */
export async function getLearningAccess(): Promise<LearningAccess> {
  if (isLearningAuthBypass()) {
    return { status: "ok", email: "bypass@local", bypass: true };
  }

  if (!isAuthConfigured()) {
    return { status: "not-configured" };
  }

  // Dynamic import keeps static-export builds from requiring a live session.
  const { auth } = await import("@/auth");
  const session = await auth();
  const email = session?.user?.email ?? null;

  if (!session?.user) {
    return { status: "signed-out" };
  }

  if (!isLearningEmailAllowed(email)) {
    return { status: "unauthorized", email };
  }

  return { status: "ok", email, bypass: false };
}
