"use client";

import { useState } from "react";
import {
  curriculumEssayIntro,
  curriculumEssayTitle,
  type ReadingCurriculumItem,
} from "@/data/learning/readingCurriculum";

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

function trackStatus(index: number): "In progress" | "Up next" {
  return index === 0 ? "In progress" : "Up next";
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

export default function LearningPlaylist({
  readingItems,
}: {
  readingItems: ReadingCurriculumItem[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const trackCount = readingItems.length;

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

      <ol className="learning-pl__tracks">
        {readingItems.map((item, index) => {
          const open = openId === item.id;
          const status = trackStatus(index);
          const panelId = `learning-track-panel-${item.id}`;
          const artistLine = `${item.author} · ${item.scope}`;

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
                <span className="learning-pl__num">{item.number}</span>
                <CoverTile title={item.title} index={index} />
                <span className="learning-pl__copy">
                  <span className="learning-pl__track-title">{item.title}</span>
                  <span className="learning-pl__artist">{artistLine}</span>
                </span>
                <span
                  className={
                    status === "In progress"
                      ? "learning-pl__status learning-pl__status--now"
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
                  <div className="learning-curr__exercise-block">
                    <p className="learning-curr__exercise-summary">
                      <span className="learning-curr__essay-label">
                        Exercise:
                      </span>{" "}
                      {item.exercise.summary}
                    </p>
                    <div className="learning-curr__cta-row">
                      <a
                        className="learning-curr__btn learning-curr__btn--primary"
                        href={item.exercise.openInTinkerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Do it in Tinker
                      </a>
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.exercise.openInCursorUrl}
                      >
                        Open in Cursor
                      </a>
                      <a
                        className="learning-curr__btn learning-curr__btn--ghost"
                        href={item.exercise.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
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
      </p>
    </div>
  );
}
