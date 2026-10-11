/**
 * Default playlist book progress for the owner when a track has no entry yet.
 * Partial reads stay on the module; they are never seeded onto Already read.
 */

/** Seed applied once per book id when that book is missing from progress. */
export const OWNER_BOOK_PROGRESS_SEED: Record<
  string,
  {
    chaptersRead: number;
    finished: boolean;
    bookmark: { chapter: number; section: string } | null;
  }
> = {
  "site-reliability-engineering": {
    chaptersRead: 0,
    finished: false,
    bookmark: {
      chapter: 3,
      section: "Types of Failures",
    },
  },
};
