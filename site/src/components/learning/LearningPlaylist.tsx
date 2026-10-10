"use client";

import { useState, useTransition } from "react";
import {
  curriculumBookCount,
  curriculumEssayIntro,
  curriculumEssayTitle,
  moduleHasBook,
  type ReadingCurriculumItem,
} from "@/data/learning/readingCurriculum";
import { formatAsideText } from "@/lib/learning/formatAsideText";
import {
  bookProgressFor,
  bookProgressPct,
  currentChapterLabel,
  lengthLabelFor,
  markBookFinished,
  markChapterRead,
  nowReadingItem,
  trackStatusFor,
  upNextItem,
  type PlaylistProgress,
} from "@/lib/learning/playlistProgress";

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
  const bookCount = curriculumBookCount(readingItems);

  const now = nowReadingItem(readingItems, progress);
  const next = upNextItem(readingItems, progress);
  const nowBook = now ? bookProgressFor(progress, now.id) : null;
  const nowHasBook = now ? moduleHasBook(now) : false;

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
          {bookCount} books · {trackCount} tracks
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
              <div className="learning-pl__now-copy">
                <h2 className="learning-pl__now-title">{now.title}</h2>
                <p className="learning-pl__now-chapter">
                  {nowHasBook
                    ? currentChapterLabel(now.id, nowBook)
                    : "Exercise"}
                  <span className="learning-pl__now-length">
                    {" "}
                    · {lengthLabelFor(now.id)}
                  </span>
                </p>
              </div>
            </div>
            {nowHasBook ? (
              <div
                className="learning-pl__now-bar"
                role="progressbar"
                aria-valuenow={bookProgressPct(now.id, nowBook)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span
                  style={{ width: `${bookProgressPct(now.id, nowBook)}%` }}
                />
              </div>
            ) : null}
            <div className="learning-curr__cta-row">
              {nowHasBook ? (
                <>
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
                  {now.getBookUrl ? (
                    <a
                      className="learning-curr__btn learning-curr__btn--ghost"
                      href={now.getBookUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get the book
                    </a>
                  ) : null}
                </>
              ) : (
                <button
                  type="button"
                  className="learning-curr__btn learning-curr__btn--primary"
                  disabled={pending}
                  onClick={() => persist(markBookFinished(progress, now.id))}
                >
                  Mark finished
                </button>
              )}
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
        {readingItems.map((item) => {
          const open = openId === item.id;
          const status = trackStatusFor(item, progress, now?.id ?? null);
          const book = bookProgressFor(progress, item.id);
          const hasBook = moduleHasBook(item);
          const panelId = `learning-track-panel-${item.id}`;
          const artistLine = `${item.author} · ${item.scope}`;
          const exerciseReady = !hasBook || book.finished;

          return (
            <li
              key={item.id}
              className={
                open
                  ? "learning-pl__track learning-pl__track--open"
                  : "learning-pl__track"
              }
              data-module-number={item.number}
              data-module-book={hasBook ? item.title : undefined}
              data-module-author={hasBook ? item.author : undefined}
              data-module-kind={hasBook ? "book" : "exercise"}
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
                <span className="learning-pl__copy">
                  <span className="learning-pl__track-title">{item.title}</span>
                  <span className="learning-pl__artist">{artistLine}</span>
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
                  {hasBook && item.getBookUrl ? (
                    <div
                      className="learning-pl__book-card"
                      data-book-card={item.id}
                    >
                      <p className="learning-pl__book-label">Book</p>
                      <h3 className="learning-pl__book-title">{item.title}</h3>
                      <p className="learning-pl__book-meta">
                        {item.author} · {item.scope}
                      </p>
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
                  ) : null}

                  <p className="learning-pl__heading">{item.heading}</p>
                  <p className="learning-curr__essay-prose">{item.prose}</p>
                  {item.consideredInstead ? (
                    <p className="learning-curr__essay-aside">
                      <span className="learning-curr__essay-label">
                        Considered instead:
                      </span>{" "}
                      {formatAsideText(item.consideredInstead)}
                    </p>
                  ) : null}
                  {item.alreadyReadNote ? (
                    <p className="learning-curr__essay-aside">
                      <span className="learning-curr__essay-label">
                        Already read:
                      </span>{" "}
                      {item.alreadyReadNote}
                    </p>
                  ) : null}

                  <div
                    className={
                      exerciseReady
                        ? "learning-curr__exercise-block learning-pl__ready"
                        : "learning-curr__exercise-block learning-pl__ready learning-pl__ready--dim"
                    }
                    data-exercise-ready={exerciseReady ? "true" : "false"}
                  >
                    <p className="learning-pl__ready-label">
                      {hasBook ? (
                        <>When you&apos;re ready: exercise</>
                      ) : (
                        <>Exercise</>
                      )}
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
                        aria-disabled={exerciseReady ? undefined : true}
                        tabIndex={exerciseReady ? undefined : -1}
                      >
                        Do it in Tinker
                      </a>
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.exercise.openInCursorUrl}
                        aria-disabled={exerciseReady ? undefined : true}
                        tabIndex={exerciseReady ? undefined : -1}
                      >
                        Open in Cursor
                      </a>
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.exercise.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-disabled={exerciseReady ? undefined : true}
                        tabIndex={exerciseReady ? undefined : -1}
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

      <section
        className="learning-pl__shelf"
        aria-label="Already read"
        data-already-read-shelf="true"
      >
        <p className="learning-pl__now-eyebrow">Already read</p>
        <p className="learning-pl__shelf-lede">
          Finished books outside this playlist. Whole books only; partial reads
          do not count.
        </p>
        <ul className="learning-pl__shelf-list">
          {progress.alreadyRead.map((entry) => (
            <li key={entry.id} className="learning-pl__shelf-item">
              <div className="learning-pl__shelf-copy">
                <span className="learning-pl__track-title">{entry.title}</span>
                <span className="learning-pl__artist">
                  {entry.author}
                  {entry.howMuch ? ` · ${entry.howMuch}` : ""}
                </span>
                {entry.note ? (
                  <span className="learning-pl__shelf-note">{entry.note}</span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="learning-curr__footer">
        Curriculum essay checked in under{" "}
        <code>site/src/data/learning/readingCurriculum.ts</code>
        . Progress and Already read are stored in an httpOnly cookie per Stytch
        user until Vercel KV / Redis is wired. Owner JSON:{" "}
        <code>/api/learning/already-read</code>.
      </p>
    </div>
  );
}
