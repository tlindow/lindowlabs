/**
 * Owner playlist progress helpers (pure). Persistence is a signed-in cookie
 * keyed by Stytch user_id until Vercel KV / Redis is available.
 */

import {
  OWNER_ALREADY_READ_SEED,
  type AlreadyReadEntry,
} from "@/data/learning/alreadyReadSeed";
import { OWNER_BOOK_PROGRESS_SEED } from "@/data/learning/playlistBookSeed";
import {
  formatTrackLength,
  playlistTrackMeta,
  type PlaylistTrackMeta,
} from "@/data/learning/playlistTrackMeta";
import type { ReadingCurriculumItem } from "@/data/learning/readingCurriculum";

export type { AlreadyReadEntry };

export const PLAYLIST_PROGRESS_COOKIE = "ll_learning_playlist_v1";

export type PlaylistBookmark = {
  /** Optional page when the owner marks a page number. */
  page?: number;
  /** Optional chapter when the owner marks a chapter (e.g. SRE Ch 3). */
  chapter?: number;
  section: string;
};

export type BookProgress = {
  /** Chapters marked read (0..chapterCount when known). */
  chaptersRead: number;
  finished: boolean;
  bookmark: PlaylistBookmark | null;
};

export type PlaylistProgress = {
  userId: string;
  books: Record<string, BookProgress>;
  /** Finished books outside the curriculum playlist. */
  alreadyRead: AlreadyReadEntry[];
  /**
   * True after seed applied or owner edited the shelf.
   * Prevents re-seeding over later edits (including an emptied shelf).
   */
  alreadyReadInitialized: boolean;
};

export type TrackStatus = "Done" | "In progress" | "Up next";

export function emptyBookProgress(): BookProgress {
  return { chaptersRead: 0, finished: false, bookmark: null };
}

export function emptyPlaylistProgress(userId: string): PlaylistProgress {
  return {
    userId,
    books: {},
    alreadyRead: [],
    alreadyReadInitialized: false,
  };
}

/** Apply owner seed once when the shelf has never been initialized. */
export function withAlreadyReadDefaults(
  progress: PlaylistProgress
): PlaylistProgress {
  if (progress.alreadyReadInitialized) return progress;
  return {
    ...progress,
    alreadyRead: OWNER_ALREADY_READ_SEED.map((entry) => ({ ...entry })),
    alreadyReadInitialized: true,
  };
}

/**
 * Seed missing book progress (bookmark / chapters) without touching Already read.
 * Does not overwrite chaptersRead / finished. Fills a missing bookmark from seed.
 */
export function withBookProgressDefaults(
  progress: PlaylistProgress
): PlaylistProgress {
  let next = progress;
  for (const [bookId, seed] of Object.entries(OWNER_BOOK_PROGRESS_SEED)) {
    const existing = next.books[bookId];
    if (!existing) {
      next = withBook(next, bookId, {
        chaptersRead: seed.chaptersRead,
        finished: seed.finished,
        bookmark: seed.bookmark
          ? { chapter: seed.bookmark.chapter, section: seed.bookmark.section }
          : null,
      });
      continue;
    }
    if (!existing.bookmark && seed.bookmark) {
      next = withBook(next, bookId, {
        ...existing,
        bookmark: {
          chapter: seed.bookmark.chapter,
          section: seed.bookmark.section,
        },
      });
    }
  }
  return next;
}

/** Already-read shelf + per-book progress seeds. */
export function withPlaylistDefaults(
  progress: PlaylistProgress
): PlaylistProgress {
  return withBookProgressDefaults(withAlreadyReadDefaults(progress));
}

export function addAlreadyRead(
  progress: PlaylistProgress,
  entry: Omit<AlreadyReadEntry, "id"> & { id?: string }
): PlaylistProgress {
  const id =
    entry.id?.trim() ||
    `${slugPart(entry.title)}-${slugPart(entry.author)}-${Date.now()}`;
  const next: AlreadyReadEntry = {
    id,
    title: entry.title.trim(),
    author: entry.author.trim(),
    howMuch: entry.howMuch.trim() || "whole book",
    note: entry.note.trim(),
  };
  if (!next.title || !next.author) return progress;
  return {
    ...progress,
    alreadyReadInitialized: true,
    alreadyRead: [...progress.alreadyRead, next],
  };
}

export function removeAlreadyRead(
  progress: PlaylistProgress,
  id: string
): PlaylistProgress {
  return {
    ...progress,
    alreadyReadInitialized: true,
    alreadyRead: progress.alreadyRead.filter((entry) => entry.id !== id),
  };
}

function slugPart(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32) || "book";
}

export function bookProgressFor(
  progress: PlaylistProgress,
  bookId: string
): BookProgress {
  return progress.books[bookId] ?? emptyBookProgress();
}

export function metaFor(bookId: string): PlaylistTrackMeta | undefined {
  return playlistTrackMeta[bookId];
}

export function chapterCount(bookId: string): number | null {
  const labels = metaFor(bookId)?.chapterLabels;
  return labels && labels.length > 0 ? labels.length : null;
}

export function currentChapterLabel(
  bookId: string,
  progress: BookProgress
): string {
  const labels = metaFor(bookId)?.chapterLabels;
  if (!labels || labels.length === 0) {
    return progress.finished ? "Finished" : "Whole book";
  }
  if (progress.finished || progress.chaptersRead >= labels.length) {
    return "Finished";
  }
  return labels[progress.chaptersRead] ?? labels[labels.length - 1]!;
}

/** First unfinished track in essay order; null when playlist is complete. */
export function nowReadingItem(
  items: ReadingCurriculumItem[],
  progress: PlaylistProgress
): ReadingCurriculumItem | null {
  for (const item of items) {
    if (!bookProgressFor(progress, item.id).finished) return item;
  }
  return null;
}

/** Next unfinished track after the Now reading book. */
export function upNextItem(
  items: ReadingCurriculumItem[],
  progress: PlaylistProgress
): ReadingCurriculumItem | null {
  const current = nowReadingItem(items, progress);
  if (!current) return null;
  const start = items.findIndex((i) => i.id === current.id);
  for (let i = start + 1; i < items.length; i += 1) {
    const item = items[i]!;
    if (!bookProgressFor(progress, item.id).finished) return item;
  }
  return null;
}

export function trackStatusFor(
  item: ReadingCurriculumItem,
  progress: PlaylistProgress,
  nowId: string | null
): TrackStatus {
  const book = bookProgressFor(progress, item.id);
  if (book.finished) return "Done";
  if (nowId && item.id === nowId) return "In progress";
  return "Up next";
}

export function bookProgressPct(bookId: string, book: BookProgress): number {
  if (book.finished) return 100;
  const total = chapterCount(bookId);
  if (total == null || total <= 0) return 0;
  return Math.min(100, Math.round((book.chaptersRead / total) * 100));
}

/** Location line for a bookmark (no leading "Bookmark:" label). */
export function formatBookmark(bookmark: PlaylistBookmark | null): string | null {
  if (!bookmark) return null;
  const section = bookmark.section.trim();
  if (bookmark.chapter != null && Number.isFinite(bookmark.chapter)) {
    if (section) return `Chapter ${bookmark.chapter}, ${section}`;
    return `Chapter ${bookmark.chapter}`;
  }
  if (bookmark.page != null && Number.isFinite(bookmark.page)) {
    if (section) return `p. ${bookmark.page}, ${section}`;
    return `p. ${bookmark.page}`;
  }
  if (section) return section;
  return null;
}

/** Covered-within-module labels for a track (empty when none). */
export function coveredChapterLabelsFor(bookId: string): string[] {
  return metaFor(bookId)?.coveredChapterLabels ?? [];
}

export function lengthLabelFor(bookId: string): string {
  return formatTrackLength(metaFor(bookId));
}

export function withBook(
  progress: PlaylistProgress,
  bookId: string,
  next: BookProgress
): PlaylistProgress {
  return {
    ...progress,
    books: { ...progress.books, [bookId]: next },
  };
}

export function markChapterRead(
  progress: PlaylistProgress,
  bookId: string
): PlaylistProgress {
  const book = bookProgressFor(progress, bookId);
  if (book.finished) return progress;
  const total = chapterCount(bookId);
  if (total == null) {
    // Whole book: chapter advance finishes the track.
    return withBook(progress, bookId, { ...book, finished: true, chaptersRead: 1 });
  }
  const chaptersRead = Math.min(total, book.chaptersRead + 1);
  const finished = chaptersRead >= total;
  return withBook(progress, bookId, {
    ...book,
    chaptersRead,
    finished,
  });
}

export function markBookFinished(
  progress: PlaylistProgress,
  bookId: string
): PlaylistProgress {
  const book = bookProgressFor(progress, bookId);
  const total = chapterCount(bookId);
  return withBook(progress, bookId, {
    ...book,
    chaptersRead: total ?? Math.max(book.chaptersRead, 1),
    finished: true,
  });
}

export function setBookmark(
  progress: PlaylistProgress,
  bookId: string,
  page: number,
  section: string
): PlaylistProgress {
  const book = bookProgressFor(progress, bookId);
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  return withBook(progress, bookId, {
    ...book,
    bookmark: { page: safePage, section: section.trim() },
  });
}

export function parsePlaylistProgressCookie(
  raw: string | undefined,
  userId: string
): PlaylistProgress {
  if (!raw) {
    return withPlaylistDefaults(emptyPlaylistProgress(userId));
  }
  try {
    const parsed = JSON.parse(raw) as Partial<PlaylistProgress>;
    if (!parsed || parsed.userId !== userId || typeof parsed.books !== "object") {
      return withPlaylistDefaults(emptyPlaylistProgress(userId));
    }
    const books: Record<string, BookProgress> = {};
    for (const [id, rawBook] of Object.entries(parsed.books ?? {})) {
      if (!rawBook || typeof rawBook !== "object") continue;
      const b = rawBook as Partial<BookProgress>;
      const bookmark = normalizeBookmark(b.bookmark);
      books[id] = {
        chaptersRead:
          typeof b.chaptersRead === "number" && Number.isFinite(b.chaptersRead)
            ? Math.max(0, Math.floor(b.chaptersRead))
            : 0,
        finished: b.finished === true,
        bookmark,
      };
    }
    const base: PlaylistProgress = {
      userId,
      books,
      alreadyRead: Array.isArray(parsed.alreadyRead) ? parsed.alreadyRead : [],
      alreadyReadInitialized: parsed.alreadyReadInitialized === true,
    };
    return withPlaylistDefaults(base);
  } catch {
    return withPlaylistDefaults(emptyPlaylistProgress(userId));
  }
}

function normalizeBookmark(
  raw: Partial<PlaylistBookmark> | null | undefined
): PlaylistBookmark | null {
  if (!raw || typeof raw !== "object") return null;
  const section = typeof raw.section === "string" ? raw.section : "";
  const chapter =
    typeof raw.chapter === "number" && Number.isFinite(raw.chapter)
      ? Math.max(1, Math.floor(raw.chapter))
      : undefined;
  const page =
    typeof raw.page === "number" && Number.isFinite(raw.page)
      ? Math.max(1, Math.floor(raw.page))
      : undefined;
  if (chapter == null && page == null && !section.trim()) return null;
  return { chapter, page, section };
}

export function serializePlaylistProgress(progress: PlaylistProgress): string {
  return JSON.stringify({
    userId: progress.userId,
    books: progress.books,
    alreadyRead: progress.alreadyRead,
    alreadyReadInitialized: progress.alreadyReadInitialized,
  });
}
