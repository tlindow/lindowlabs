/**
 * Per-user learning desk scoping. Server-only decision helpers.
 * Tyler's personalized reading curriculum is never returned for non-owners.
 */

import {
  readingCurriculum,
  type ReadingCurriculumItem,
} from "@/data/learning/readingCurriculum";
import type { CurriculumResult } from "@/lib/learning/getCurriculum";

/** Owner-only reading list. Non-owners always get []. Fail closed. */
export function readingCurriculumForUser(
  isOwner: boolean
): ReadingCurriculumItem[] {
  if (!isOwner) return [];
  return readingCurriculum;
}

/**
 * Whether course/lesson Notion curriculum may be loaded for this user.
 * Non-owners must never receive course payloads from any route.
 */
export function mayLoadOwnerCurriculum(isOwner: boolean): boolean {
  return isOwner === true;
}

/**
 * Pure helper for tests/pages: which desk payload a signed-in user may see.
 * Non-owners always get starter (no curriculum items).
 */
export function deskPayloadForUser(args: {
  isOwner: boolean;
  curriculum: CurriculumResult | null;
}): "starter" | "owner-curriculum" | "owner-not-connected" {
  if (!args.isOwner) return "starter";
  if (!args.curriculum || args.curriculum.status === "not-connected") {
    return "owner-not-connected";
  }
  return "owner-curriculum";
}
