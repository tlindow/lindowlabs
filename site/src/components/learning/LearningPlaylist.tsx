"use client";

import { useState, useTransition } from "react";
import {
  curriculumEssayIntro,
  curriculumEssayTitle,
  type ReadingCurriculumItem,
} from "@/data/learning/readingCurriculum";
import {
  bookProgressFor,
  bookProgressPct,
  currentChapterLabel,
  formatBookmark,
  lengthLabelFor,
  markBookFinished,
  markChapterRead,
  nowReadingItem,
  setBookmark,
  trackStatusFor,
  upNextItem,
  type PlaylistProgress,
} from "@/lib/learning/playlistProgress";

/** Soft cover hues from the learning cream/indigo palette (not stock art). */
const COVER_HUES = [
  "linear-gradient(145deg, #c7d2fe 0%, #6366f1 55%, #312e81 100%)",
  "linear-gradient(145deg, #a5b4fc 0%, #4f46e5 50%, #1e1b4b 100%)",
  "linear-gradient(145deg, #ddd6fe 0%, #7c3aed 52%, #2e1065 100%)",
  "linear-gradient(145deg, #bae6fd 0%, #6366f1 48%, #1e3a5f 100%)",
  "linear-gradient(145deg, #c4b5fd 0%, #4338ca 55%, #0f172a 100%)",
  "linear-gradient(145deg, #e0e7ff 0%, #818cf8 45%, #312e81 100%)",
];

function coverInitials(title: string): string {
  const words = title.replace(/[^a-zA-Z0-9\s]/g, " ").trim().split(/\s+/);
  if (words.length === 0) return "BK";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return `${words[0]![0] ?? ""}${words[1]![0] ?? ""}`.toUpperCase();
}

function CoverTile({
  title,
  index,
}: {
  title: string;
  index: number;
}) {
  return (
    <span
      className="learning-pl__cover"
      style={{ background: COVER_HUES[index % COVER_HUES.length] }}
      aria-hidden="true"
    >
      <span className="learning-pl__cover-mark">{coverInitials(title)}</span>
    </span>
  );
}

function BookmarkEditor({
  page,
  section,
  onSave,
  pending,
}: {
  page: number;
  section: string;
  onSave: (page: number, section: string) => void;
  pending: boolean;
}) {
  const [pageValue, setPageValue] = useState(String(page || ""));
  const [sectionValue, setSectionValue] = useState(section);

  return (
    <form
      className="learning-pl__bookmark-form"
      onSubmit={(event) => {
        event.preventDefault();
        const n = Number.parseInt(pageValue, 10);
        onSave(Number.isFinite(n) ? n : 1, sectionValue);
      }}
    >
      <label className="learning-pl__bookmark-field">
        <span>Page</span>
        <input
          inputMode="numeric"
          name="page"
          value={pageValue}
          onChange={(e) => setPageValue(e.target.value)}
          disabled={pending}
        />
      </label>
      <label className="learning-pl__bookmark-field learning-pl__bookmark-field--grow">
        <span>Section</span>
        <input
          name="section"
          value={sectionValue}
          onChange={(e) => setSectionValue(e.target.value)}
          placeholder="e.g. Error budgets"
          disabled={pending}
        />
      </label>
      <button
        type="submit"
        className="learning-curr__btn learning-curr__btn--primary"
        disabled={pending}
      >
        Save bookmark
      </button>
    </form>
  );
}

export default function LearningPlaylist({
  readingItems,
  initialProgress,
}: {
  readingItems: ReadingCurriculumItem[];
  initialProgress: PlaylistProgress;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [progress, setProgress] = useState(initialProgress);
  const [pending, startTransition] = useTransition();
  const trackCount = readingItems.length;

  const now = nowReadingItem(readingItems, progress);
  const next = upNextItem(readingItems, progress);
  const nowBook = now ? bookProgressFor(progress, now.id) : null;
  const nowIndex = now
    ? readingItems.findIndex((item) => item.id === now.id)
    : -1;

  function persist(nextProgress: PlaylistProgress) {
    setProgress(nextProgress);
    startTransition(async () => {
      try {
        await fetch("/api/learning/playlist-progress", {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ progress: nextProgress }),
        });
      } catch {
        // Keep optimistic UI; cookie write is best-effort.
      }
    });
  }

  return (
    <div className="learning-pl" data-learning-desk="owner">
      <header className="learning-pl__header">
        <p className="learning-curr__eyebrow">Lindow Labs · Playlist</p>
        <h1 className="learning-curr__title">{curriculumEssayTitle}</h1>
        <p className="learning-pl__desc">{curriculumEssayIntro}</p>
        <p className="learning-pl__meta">
          {trackCount} books · {trackCount} tracks
        </p>
      </header>

      <section
        className="learning-pl__now"
        data-now-reading={now?.id ?? "complete"}
        aria-label="Now reading"
      >
        <p className="learning-pl__now-eyebrow">Now reading</p>
        {now && nowBook ? (
          <>
            <div className="learning-pl__now-main">
              <CoverTile title={now.title} index={Math.max(0, nowIndex)} />
              <div className="learning-pl__now-copy">
                <h2 className="learning-pl__now-title">{now.title}</h2>
                <p className="learning-pl__now-chapter">
                  {currentChapterLabel(now.id, nowBook)}
                  <span className="learning-pl__now-length">
                    {" "}
                    · {lengthLabelFor(now.id)}
                  </span>
                </p>
                {formatBookmark(nowBook.bookmark) ? (
                  <p className="learning-pl__bookmark-line">
                    {formatBookmark(nowBook.bookmark)}
                  </p>
                ) : null}
              </div>
            </div>
            <div
              className="learning-pl__now-bar"
              role="progressbar"
              aria-valuenow={bookProgressPct(now.id, nowBook)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <span style={{ width: `${bookProgressPct(now.id, nowBook)}%` }} />
            </div>
            <BookmarkEditor
              key={`${now.id}-${nowBook.bookmark?.page ?? 0}-${nowBook.bookmark?.section ?? ""}`}
              page={nowBook.bookmark?.page ?? 1}
              section={nowBook.bookmark?.section ?? ""}
              pending={pending}
              onSave={(page, section) =>
                persist(setBookmark(progress, now.id, page, section))
              }
            />
            <div className="learning-curr__cta-row">
              <button
                type="button"
                className="learning-curr__btn learning-curr__btn--primary"
                disabled={pending}
                onClick={() => persist(markChapterRead(progress, now.id))}
              >
                Mark chapter read
              </button>
              <button
                type="button"
                className="learning-curr__btn learning-curr__btn--ghost"
                disabled={pending}
                onClick={() => persist(markBookFinished(progress, now.id))}
              >
                Mark book finished
              </button>
              <a
                className="learning-curr__btn learning-curr__btn--ghost"
                href={now.getBookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get the book
              </a>
            </div>
          </>
        ) : (
          <p className="learning-pl__now-complete">Playlist complete.</p>
        )}
      </section>

      <section className="learning-pl__upnext" aria-label="Up next">
        <p className="learning-pl__now-eyebrow">Up next</p>
        {next ? (
          <button
            type="button"
            className="learning-pl__upnext-row"
            onClick={() => setOpenId(next.id)}
          >
            <CoverTile
              title={next.title}
              index={readingItems.findIndex((item) => item.id === next.id)}
            />
            <span className="learning-pl__copy">
              <span className="learning-pl__track-title">{next.title}</span>
              <span className="learning-pl__artist">
                {next.author} · {next.scope} · {lengthLabelFor(next.id)}
              </span>
            </span>
          </button>
        ) : (
          <p className="learning-pl__upnext-empty">Nothing queued.</p>
        )}
      </section>

      <ol className="learning-pl__tracks">
        {readingItems.map((item, index) => {
          const open = openId === item.id;
          const status = trackStatusFor(item, progress, now?.id ?? null);
          const book = bookProgressFor(progress, item.id);
          const panelId = `learning-track-panel-${item.id}`;
          const artistLine = `${item.author} · ${item.scope}`;
          const bookmarkLine = formatBookmark(book.bookmark);

          return (
            <li
              key={item.id}
              className={
                open
                  ? "learning-pl__track learning-pl__track--open"
                  : "learning-pl__track"
              }
              data-module-number={item.number}
              data-track-open={open ? "true" : "false"}
              data-track-status={status}
            >
              <button
                type="button"
                className="learning-pl__row"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() =>
                  setOpenId((current) =>
                    current === item.id ? null : item.id
                  )
                }
              >
                <span className="learning-pl__num">
                  {status === "Done" ? "✓" : item.number}
                </span>
                <CoverTile title={item.title} index={index} />
                <span className="learning-pl__copy">
                  <span className="learning-pl__track-title">{item.title}</span>
                  <span className="learning-pl__artist">
                    {artistLine}
                    {bookmarkLine ? ` · ${bookmarkLine}` : ""}
                  </span>
                </span>
                <span className="learning-pl__length">
                  {lengthLabelFor(item.id)}
                </span>
                <span
                  className={
                    status === "In progress"
                      ? "learning-pl__status learning-pl__status--now"
                      : status === "Done"
                        ? "learning-pl__status learning-pl__status--done"
                        : "learning-pl__status"
                  }
                >
                  {status}
                </span>
              </button>

              {open ? (
                <div
                  id={panelId}
                  className="learning-pl__panel"
                  role="region"
                  aria-label={`${item.title} details`}
                >
                  <p className="learning-pl__heading">{item.heading}</p>
                  <p className="learning-curr__essay-prose">{item.prose}</p>
                  <p className="learning-curr__essay-aside">
                    <span className="learning-curr__essay-label">
                      Considered instead:
                    </span>{" "}
                    {item.consideredInstead}
                  </p>

                  <div className="learning-pl__read-actions">
                    <div className="learning-curr__cta-row">
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.getBookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get the book
                      </a>
                    </div>
                  </div>

                  <div
                    className={
                      book.finished
                        ? "learning-curr__exercise-block learning-pl__ready"
                        : "learning-curr__exercise-block learning-pl__ready learning-pl__ready--dim"
                    }
                    data-exercise-ready={book.finished ? "true" : "false"}
                  >
                    <p className="learning-pl__ready-label">
                      When you&apos;re ready: exercise
                    </p>
                    <p className="learning-curr__exercise-summary">
                      {item.exercise.summary}
                    </p>
                    <div className="learning-curr__cta-row">
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.exercise.openInTinkerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={book.finished ? undefined : true}
                        tabIndex={book.finished ? undefined : -1}
                      >
                        Do it in Tinker
                      </a>
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.exercise.openInCursorUrl}
                        aria-disabled={book.finished ? undefined : true}
                        tabIndex={book.finished ? undefined : -1}
                      >
                        Open in Cursor
                      </a>
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.exercise.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={book.finished ? undefined : true}
                        tabIndex={book.finished ? undefined : -1}
                      >
                        View on GitHub
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <p className="learning-curr__footer">
        Curriculum essay checked in under{" "}
        <code>site/src/data/learning/readingCurriculum.ts</code>
        . Progress is stored in an httpOnly cookie per Stytch user until Vercel
        KV / Redis is wired.
      </p>
    </div>
  );
}
