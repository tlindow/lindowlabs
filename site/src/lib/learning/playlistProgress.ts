/**
 * Owner playlist progress helpers (pure). Persistence is a signed-in cookie
 * keyed by Stytch user_id until Vercel KV / Redis is available.
 */

import {
  formatTrackLength,
  playlistTrackMeta,
  type PlaylistTrackMeta,
} from "@/data/learning/playlistTrackMeta";
import type { ReadingCurriculumItem } from "@/data/learning/readingCurriculum";

export const PLAYLIST_PROGRESS_COOKIE = "ll_learning_playlist_v1";

export type PlaylistBookmark = {
  page: number;
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
};

export type TrackStatus = "Done" | "In progress" | "Up next";

export function emptyBookProgress(): BookProgress {
  return { chaptersRead: 0, finished: false, bookmark: null };
}

export function emptyPlaylistProgress(userId: string): PlaylistProgress {
  return { userId, books: {} };
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

export function formatBookmark(bookmark: PlaylistBookmark | null): string | null {
  if (!bookmark) return null;
  const section = bookmark.section.trim();
  if (section) return `Bookmarked: p. ${bookmark.page}, ${section}`;
  return `Bookmarked: p. ${bookmark.page}`;
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
  if (!raw) return emptyPlaylistProgress(userId);
  try {
    const parsed = JSON.parse(raw) as PlaylistProgress;
    if (!parsed || parsed.userId !== userId || typeof parsed.books !== "object") {
      return emptyPlaylistProgress(userId);
    }
    return {
      userId,
      books: parsed.books ?? {},
    };
  } catch {
    return emptyPlaylistProgress(userId);
  }
}

export function serializePlaylistProgress(progress: PlaylistProgress): string {
  return JSON.stringify({
    userId: progress.userId,
    books: progress.books,
  });
}
