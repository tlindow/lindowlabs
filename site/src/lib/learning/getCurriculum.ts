/**
 * Load curriculum for /learning: Notion (live) + overlay + short cache.
 * Never exposes the Notion token. Never invents placeholder courses.
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { learningOverlay } from "@/data/learning/overlay";
import { mergeCurriculum } from "@/lib/learning/mergeOverlay";
import { fetchReadingPlanFromNotion, readNotionEnv } from "@/lib/learning/notionClient";
import {
  parseReadingPlanBlocks,
  parseReadingPlanMarkdown,
} from "@/lib/learning/parseReadingPlan";
import { getTinkerSupplementProvider } from "@/lib/learning/tinkerSupplement";
import type { Curriculum } from "@/lib/learning/types";

const CACHE_TTL_MS = 60_000;

type CacheEntry = {
  curriculum: Curriculum;
  expiresAt: number;
};

let memoryCache: CacheEntry | null = null;
let lastGood: Curriculum | null = null;

function fixtureModeEnabled(): boolean {
  return process.env.LEARNING_CURRICULUM_FIXTURE === "1";
}

function loadFixtureMarkdown(): string {
  const file = path.join(
    process.cwd(),
    "src/data/learning/fixtures/reading-plan-page.md"
  );
  return readFileSync(file, "utf8");
}

async function buildFromParsed(
  plan: ReturnType<typeof parseReadingPlanBlocks>,
  source: Curriculum["source"],
  staleAsOf: string | null
): Promise<Curriculum> {
  const tinker = getTinkerSupplementProvider();
  const supplements = new Map();
  const threadNotes = new Map();
  // v1: provider returns null; seam still called so a future client plugs in.
  for (const course of plan.courses) {
    threadNotes.set(course.key, await tinker.getThreadNotes(course.key));
    for (const lesson of course.lessons) {
      if (lesson.key === "cover") continue;
      supplements.set(
        `${course.key}:${lesson.key}`,
        await tinker.getForLesson(course.key, lesson.key)
      );
    }
  }

  return mergeCurriculum(plan, learningOverlay, {
    fetchedAt: new Date().toISOString(),
    staleAsOf,
    source,
    supplements,
    threadNotes,
  });
}

export type CurriculumResult =
  | { status: "ok"; curriculum: Curriculum }
  | { status: "not-connected" };

/**
 * Server entry point for the curriculum.
 * - Fixture mode (LEARNING_CURRICULUM_FIXTURE=1): parse checked-in markdown.
 * - No token: not-connected.
 * - Live Notion with short TTL cache; on failure serve last-good + as-of.
 */
export async function getCurriculum(): Promise<CurriculumResult> {
  if (fixtureModeEnabled()) {
    const md = loadFixtureMarkdown();
    const plan = parseReadingPlanMarkdown(
      md,
      "2026-10-06T21:43:25.133Z"
    );
    const curriculum = await buildFromParsed(plan, "fixture", null);
    return { status: "ok", curriculum };
  }

  if (!readNotionEnv()) {
    return { status: "not-connected" };
  }

  const now = Date.now();
  if (memoryCache && memoryCache.expiresAt > now) {
    return { status: "ok", curriculum: memoryCache.curriculum };
  }

  try {
    const { blocks, pageLastEditedAt } = await fetchReadingPlanFromNotion();
    const plan = parseReadingPlanBlocks(blocks, pageLastEditedAt);
    const curriculum = await buildFromParsed(plan, "notion", null);
    memoryCache = { curriculum, expiresAt: now + CACHE_TTL_MS };
    lastGood = curriculum;
    return { status: "ok", curriculum };
  } catch (err) {
    console.error("[learning] Notion fetch failed:", err);
    if (lastGood) {
      const stale: Curriculum = {
        ...lastGood,
        source: "last-good",
        staleAsOf: lastGood.fetchedAt,
        fetchedAt: new Date().toISOString(),
      };
      return { status: "ok", curriculum: stale };
    }
    // No last-good yet: surface as not-connected-style empty via throw-through
    // by returning not-connected only when never configured; here token exists
    // but fetch failed with no cache — return a minimal stale signal via error page.
    throw err;
  }
}

/** Test helper: clear in-memory cache between cases. */
export function __resetCurriculumCacheForTests() {
  memoryCache = null;
  lastGood = null;
}
