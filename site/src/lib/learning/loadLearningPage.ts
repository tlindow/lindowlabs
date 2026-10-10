import { redirect } from "next/navigation";
import { getLearningAccess } from "@/lib/auth/getLearningAccess";
import { getCurriculum, type CurriculumResult } from "@/lib/learning/getCurriculum";
import { mayLoadOwnerCurriculum } from "@/lib/learning/learningScope";
import type { Curriculum } from "@/lib/learning/types";

export type LearningGate =
  | { status: "signed-out" }
  | { status: "not-configured" }
  | {
      status: "ok";
      userId: string;
      phone: string | null;
      bypass: boolean;
      isOwner: boolean;
      /** Owner-only personalized curriculum; null for every other user. */
      curriculum: CurriculumResult | null;
    };

/**
 * Shared auth + per-user curriculum load for /learning routes.
 * Non-owners never receive Tyler's curriculum payload (fail closed).
 */
export async function loadLearningGate(): Promise<LearningGate> {
  if (process.env.STATIC_EXPORT === "1") {
    return { status: "signed-out" };
  }

  const access = await getLearningAccess();
  if (access.status === "not-configured") return { status: "not-configured" };
  if (access.status === "signed-out") return { status: "signed-out" };

  if (!access.isOwner) {
    return {
      status: "ok",
      userId: access.userId,
      phone: access.phone,
      bypass: access.bypass,
      isOwner: false,
      curriculum: null,
    };
  }

  try {
    const curriculum = await getCurriculum();
    return {
      status: "ok",
      userId: access.userId,
      phone: access.phone,
      bypass: access.bypass,
      isOwner: true,
      curriculum,
    };
  } catch {
    // Token present but Notion failed and no last-good yet.
    return {
      status: "ok",
      userId: access.userId,
      phone: access.phone,
      bypass: access.bypass,
      isOwner: true,
      curriculum: { status: "not-connected" },
    };
  }
}

/**
 * Owner-only curriculum for course/lesson routes.
 * Signed-out → /learning (login). Non-owner → /learning (empty desk).
 * Never returns another user's curriculum.
 */
export async function requireCurriculum(): Promise<{
  userId: string;
  phone: string | null;
  bypass: boolean;
  curriculum: Curriculum;
} | null> {
  const gate = await loadLearningGate();
  if (gate.status === "signed-out") {
    redirect("/learning");
  }
  if (gate.status === "not-configured") {
    redirect("/learning");
  }
  if (!mayLoadOwnerCurriculum(gate.isOwner) || gate.curriculum === null) {
    redirect("/learning");
  }
  if (gate.curriculum.status === "not-connected") {
    return null;
  }
  return {
    userId: gate.userId,
    phone: gate.phone,
    bypass: gate.bypass,
    curriculum: gate.curriculum.curriculum,
  };
}
