import Link from "next/link";
import type { ReactNode } from "react";
import {
  curriculumEssayIntro,
  curriculumEssayTitle,
  type ReadingCurriculumItem,
} from "@/data/learning/readingCurriculum";
import { learningSignOut } from "@/lib/auth/learningSignOut";
import { formatAsOfPt } from "@/lib/learning/formatPt";
import type {
  CourseState,
  Curriculum,
  CurriculumCourse,
  CurriculumLesson,
  LessonStatus,
} from "@/lib/learning/types";
import "./learning-curriculum.css";

function StatusChip({
  status,
}: {
  status: LessonStatus | CourseState | "not_written";
}) {
  const label =
    status === "done"
      ? "Done"
      : status === "current"
        ? "Current"
        : status === "not_started"
          ? "Not started"
          : status === "completed"
            ? "Completed"
            : status === "not_written"
              ? "Not written yet"
              : "Not started";
  const mod =
    status === "done" || status === "completed"
      ? "done"
      : status === "current"
        ? "current"
        : status === "not_started" || status === "pending"
          ? "pending"
          : "pending";
  return (
    <span className={`learning-curr__chip learning-curr__chip--${mod}`}>
      {label}
    </span>
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="learning-curr__progress">
      <div className="learning-curr__progress-label">
        <span>
          {done} of {total} done
        </span>
        <span>{pct}%</span>
      </div>
      <div className="learning-curr__bar" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Shell({
  children,
  showSignOut,
}: {
  children: ReactNode;
  showSignOut?: boolean;
}) {
  return (
    <div className="learning-curr">
      <div className="learning-curr__wrap">
        {children}
        {showSignOut ? (
          <form action={learningSignOut} className="learning-curr__signout">
            <button type="submit">Sign out</button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export function ReadingPlanNotConnected() {
  return (
    <div className="learning-curr">
      <div className="learning-curr__empty">
        <div>
          <p className="learning-curr__eyebrow">Lindow Labs Learning</p>
          <h1>Reading plan not connected yet</h1>
          <p>
            Set{" "}
            <code>NOTION_READING_PLAN_TOKEN</code> (and optionally{" "}
            <code>NOTION_READING_PLAN_PAGE_ID</code>) on the Vercel project.
            Share a read-only Notion integration to the Reading plan page only.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Empty / starter desk for signed-in users who are not the curriculum owner. */
export function LearningStarterEmpty({
  showSignOut = true,
}: {
  showSignOut?: boolean;
}) {
  return (
    <Shell showSignOut={showSignOut}>
      <p className="learning-curr__eyebrow">Lindow Labs</p>
      <h1 className="learning-curr__title">Learning</h1>
      <p className="learning-curr__lede">Your curriculum is being set up</p>
      <div className="learning-curr__block" data-learning-desk="starter">
        <h2>Your desk</h2>
        <p>
          This account has its own private learning space. Personalized reading
          lists and notes will show up here once they are ready for you.
        </p>
      </div>
    </Shell>
  );
}

export function CurriculumDashboard({
  readingItems,
  showSignOut = true,
}: {
  /** Owner-only list from the server; never pass another user's items. */
  readingItems: ReadingCurriculumItem[];
  showSignOut?: boolean;
}) {
  return (
    <Shell showSignOut={showSignOut}>
      <article data-learning-desk="owner" className="learning-curr__essay">
        <p className="learning-curr__eyebrow">Lindow Labs</p>
        <h1 className="learning-curr__title">{curriculumEssayTitle}</h1>
        <p className="learning-curr__lede">{curriculumEssayIntro}</p>

        <ol className="learning-curr__essay-modules">
          {readingItems.map((item) => (
            <li
              key={item.id}
              className="learning-curr__essay-module"
              data-module-number={item.number}
            >
              <div className="learning-curr__essay-module-head">
                <h2 className="learning-curr__essay-module-title">
                  <span className="learning-curr__essay-module-num">
                    {item.number}.
                  </span>{" "}
                  {item.heading}
                </h2>
                {item.ownership ? (
                  <span className="learning-curr__chip learning-curr__chip--owned">
                    {item.ownership}
                  </span>
                ) : null}
              </div>
              <p className="learning-curr__essay-prose">{item.prose}</p>
              <p className="learning-curr__essay-aside">
                <span className="learning-curr__essay-label">
                  Considered instead:
                </span>{" "}
                {item.consideredInstead}
              </p>
              <div className="learning-curr__exercise-block">
                <p className="learning-curr__exercise-summary">
                  <span className="learning-curr__essay-label">Exercise:</span>{" "}
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
            </li>
          ))}
        </ol>

        <p className="learning-curr__footer">
          Curriculum essay checked in under{" "}
          <code>site/src/data/learning/readingCurriculum.ts</code>
        </p>
      </article>
    </Shell>
  );
}

export function CourseView({
  course,
  curriculum,
}: {
  course: CurriculumCourse;
  curriculum: Curriculum;
}) {
  const currentLesson = course.lessons.find((l) => l.status === "current");

  return (
    <Shell showSignOut>
      <Link href="/learning" className="learning-curr__back">
        ← All courses
      </Link>
      <p className="learning-curr__eyebrow">Course</p>
      <h1 className="learning-curr__title">{course.title}</h1>
      {course.author ? (
        <p className="learning-curr__lede">{course.author}</p>
      ) : null}
      <div style={{ marginTop: "0.75rem" }}>
        <StatusChip status={course.state} />
      </div>
      {course.why ? <p className="learning-curr__why">{course.why}</p> : null}
      <ProgressBar done={course.progress.done} total={course.progress.total} />

      {currentLesson ? (
        <div className="learning-curr__block">
          <h2>Continue</h2>
          <p>{currentLesson.title}</p>
          <div className="learning-curr__cta-row">
            <Link
              className="learning-curr__btn learning-curr__btn--primary"
              href={`/learning/courses/${course.key}/lessons/${currentLesson.key}`}
            >
              Open lesson
            </Link>
          </div>
        </div>
      ) : null}

      <section className="learning-curr__section">
        <h2 className="learning-curr__section-title">Lessons</h2>
        <ul className="learning-curr__lessons">
          {course.lessons.map((lesson) => (
            <li
              key={lesson.key}
              className={[
                "learning-curr__lesson",
                lesson.status === "current" ? "learning-curr__lesson--current" : "",
                lesson.status === "pending" ? "learning-curr__lesson--pending" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Link
                href={`/learning/courses/${course.key}/lessons/${lesson.key}`}
              >
                <span className="learning-curr__lesson-title">
                  {lesson.status === "done" ? "✓ " : ""}
                  {lesson.title}
                </span>
                <StatusChip status={lesson.status} />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {course.threadNotes ? (
        <div className="learning-curr__block">
          <h2>Thread notes</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{course.threadNotes}</p>
        </div>
      ) : null}

      <p className="learning-curr__footer">
        Synced from Notion Reading plan ·{" "}
        {curriculum.staleAsOf
          ? `as of ${formatAsOfPt(curriculum.staleAsOf)}`
          : `page edited ${formatAsOfPt(curriculum.pageLastEditedAt)}`}
      </p>
    </Shell>
  );
}

export function LessonView({
  course,
  lesson,
}: {
  course: CurriculumCourse;
  lesson: CurriculumLesson;
}) {
  const showReflection =
    (lesson.status === "done" || lesson.status === "current") &&
    lesson.reflectionPrompt;
  const showExercises =
    (lesson.status === "done" || lesson.status === "current") &&
    lesson.exercises.length > 0;

  return (
    <Shell showSignOut>
      <Link
        href={`/learning/courses/${course.key}`}
        className="learning-curr__back"
      >
        ← {course.title}
      </Link>
      <p className="learning-curr__eyebrow">Lesson</p>
      <div className="learning-curr__card-top">
        <h1 className="learning-curr__title">{lesson.title}</h1>
        <StatusChip status={lesson.status} />
      </div>
      {lesson.url ? (
        <p className="learning-curr__meta">
          <a href={lesson.url} target="_blank" rel="noopener noreferrer">
            Open source
          </a>
        </p>
      ) : null}

      {lesson.objective ? (
        <div className="learning-curr__block">
          <h2>Learning objective</h2>
          <p>{lesson.objective}</p>
        </div>
      ) : null}

      {lesson.tinkerSupplement?.preReadQuestion ? (
        <div className="learning-curr__block">
          <h2>Pre-read question</h2>
          <p>{lesson.tinkerSupplement.preReadQuestion}</p>
        </div>
      ) : null}

      {lesson.tinkerSupplement ? (
        <div className="learning-curr__block">
          <h2>Your notes</h2>
          {lesson.tinkerSupplement.notesBlocks.length === 0 ||
          lesson.tinkerSupplement.notesBlocks.every((b) => !b.answer.trim()) ? (
            <p>{lesson.tinkerSupplement.notesEmptyState || "No notes yet."}</p>
          ) : (
            lesson.tinkerSupplement.notesBlocks.map((block, i) => (
              <div key={i} style={{ marginTop: i ? "0.85rem" : 0 }}>
                <p style={{ fontWeight: 600 }}>{block.question}</p>
                <p style={{ marginTop: "0.35rem", whiteSpace: "pre-wrap" }}>
                  {block.answer.trim() || "No notes yet."}
                </p>
              </div>
            ))
          )}
        </div>
      ) : null}

      {showReflection ? (
        <div className="learning-curr__block">
          <h2>Reflection</h2>
          <p>{lesson.reflectionPrompt}</p>
          <div className="learning-curr__cta-row">
            <a
              className="learning-curr__btn learning-curr__btn--ghost"
              href="https://tinker.beginner.work"
              target="_blank"
              rel="noopener noreferrer"
            >
              Write in Tinker
            </a>
          </div>
        </div>
      ) : null}

      {showExercises
        ? lesson.exercises.map((ex) => (
            <div key={ex.id} className="learning-curr__block">
              <h2>Exercise</h2>
              <p style={{ fontWeight: 650 }}>{ex.name}</p>
              <p style={{ marginTop: "0.35rem" }}>{ex.description}</p>
              <div className="learning-curr__cta-row">
                <a
                  className="learning-curr__btn learning-curr__btn--primary"
                  href={ex.openInCursorUrl}
                >
                  Open in Cursor
                </a>
                <a
                  className="learning-curr__btn learning-curr__btn--ghost"
                  href={ex.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          ))
        : null}
    </Shell>
  );
}
