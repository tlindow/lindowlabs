/**
 * Default playlist book progress for the owner when a track has no entry yet.
 * Partial reads stay on the module; they are never seeded onto Already read.
 *
 * Empty on purpose: Tyler has not started the current reliability reading
 * (Kleppmann Ch 7-9). Google SRE must not be seeded onto Already read.
 */

/** Seed applied once per book id when that book is missing from progress. */
export const OWNER_BOOK_PROGRESS_SEED: Record<
  string,
  {
    chaptersRead: number;
    finished: boolean;
    bookmark: { chapter: number; section: string } | null;
  }
> = {};
