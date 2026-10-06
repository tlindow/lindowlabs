/**
 * Seam for Tinker reading-thread supplements (DDD notes + pre-read questions).
 * v1: null provider — no server credential confirmed for Tinker.
 */

import type {
  TinkerLessonSupplement,
  TinkerSupplementProvider,
} from "@/lib/learning/types";

/** No-op provider used in v1. Swap for a real Tinker client later. */
export const nullTinkerSupplementProvider: TinkerSupplementProvider = {
  async getForLesson(): Promise<TinkerLessonSupplement | null> {
    return null;
  },
  async getThreadNotes(): Promise<string | null> {
    return null;
  },
};

export function getTinkerSupplementProvider(): TinkerSupplementProvider {
  // Future: if TINKER_* server credentials appear, return a real client here.
  return nullTinkerSupplementProvider;
}
