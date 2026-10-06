import { redirect } from "next/navigation";
import { getLearningAccess } from "@/lib/auth/getLearningAccess";
import { getCurriculum, type CurriculumResult } from "@/lib/learning/getCurriculum";
import type { Curriculum } from "@/lib/learning/types";

export type LearningGate =
  | { status: "signed-out" }
  | { status: "not-configured" }
  | { status: "unauthorized"; phone: string | null }
  | {
      status: "ok";
      phone: string | null;
      bypass: boolean;
      curriculum: CurriculumResult;
    };

/** Shared auth + curriculum load for /learning routes. */
export async function loadLearningGate(): Promise<LearningGate> {
  if (process.env.STATIC_EXPORT === "1") {
    return { status: "signed-out" };
  }

  const access = await getLearningAccess();
  if (access.status === "not-configured") return { status: "not-configured" };
  if (access.status === "unauthorized") {
    return { status: "unauthorized", phone: access.phone };
  }
  if (access.status === "signed-out") return { status: "signed-out" };

  try {
    const curriculum = await getCurriculum();
    return {
      status: "ok",
      phone: access.phone,
      bypass: access.bypass,
      curriculum,
    };
  } catch {
    // Token present but Notion failed and no last-good yet.
    return {
      status: "ok",
      phone: access.phone,
      bypass: access.bypass,
      curriculum: { status: "not-connected" },
    };
  }
}

export async function requireCurriculum(): Promise<{
  phone: string | null;
  bypass: boolean;
  curriculum: Curriculum;
} | null> {
  const gate = await loadLearningGate();
  if (gate.status === "signed-out") {
    redirect("/learning");
  }
  if (gate.status === "not-configured" || gate.status === "unauthorized") {
    redirect("/learning");
  }
  if (gate.curriculum.status === "not-connected") {
    return null;
  }
  return {
    phone: gate.phone,
    bypass: gate.bypass,
    curriculum: gate.curriculum.curriculum,
  };
}
