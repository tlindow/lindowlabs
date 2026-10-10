/**
 * Links that open a repo exercise the same way Tinker's Exercises page does:
 * GitHub tree for the module (web fallback) plus the Tinker /exercises desk.
 */

import { lindowlabsTreeUrl, openInCursorUrl } from "@/lib/learning/openInCursor";

/** Tinker Exercises desk (owner completes katas here). */
export const TINKER_EXERCISES_URL = "https://tinker.beginner.work/exercises";

export type CurriculumExerciseLinks = {
  /** Folder name under exercises/ (Tinker module id). */
  id: string;
  /** Path in this repo, e.g. exercises/api-design. */
  path: string;
  /** One-line what to do. */
  summary: string;
  /** GitHub tree URL (Tinker web openModule fallback). */
  githubUrl: string;
  /** Cursor deeplink to the same GitHub folder. */
  openInCursorUrl: string;
  /** Open the Tinker Exercises desk to do the kata. */
  openInTinkerUrl: string;
};

/** Build GitHub + Cursor + Tinker links for an exercises/<id> folder. */
export function curriculumExerciseLinks(
  id: string,
  summary: string
): CurriculumExerciseLinks {
  const path = `exercises/${id}`;
  const githubUrl = lindowlabsTreeUrl(path);
  return {
    id,
    path,
    summary,
    githubUrl,
    openInCursorUrl: openInCursorUrl(githubUrl),
    openInTinkerUrl: TINKER_EXERCISES_URL,
  };
}
