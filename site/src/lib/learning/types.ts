/** Shared curriculum types for /learning (Notion-sourced, overlay-joined). */

export type LessonStatus = "done" | "current" | "pending";
export type CourseState = "current" | "not_started" | "completed";

export type ParsedLessonStub = {
  /** Chapter number when known (e.g. 2), else null for link/essay lessons. */
  chapterNumber: number | null;
  /** Raw label from the page (e.g. "Ch 2" or link title). */
  label: string;
  url: string | null;
  status: LessonStatus;
  /** Join key: chN or slug from URL/title. */
  key: string;
};

export type ParsedCourse = {
  order: number;
  title: string;
  author: string | null;
  why: string | null;
  scopePageText: string | null;
  url: string | null;
  /** Normalized join key from title. */
  key: string;
  lessons: ParsedLessonStub[];
  /** True when the item could not be fully parsed. */
  parseFailed?: boolean;
  rawText?: string;
};

export type ParsedPractice = {
  key: string;
  title: string;
  pageText: string;
  why: string | null;
  state: "not_written" | "ready";
  url: string | null;
};

export type ParsedReadingPlan = {
  currentlyReading: {
    courseTitle: string | null;
    lessonLabel: string | null;
    pageText: string;
  } | null;
  courses: ParsedCourse[];
  practice: ParsedPractice[];
  /** Unparsed Reading-order items shown with a couldn't-parse note. */
  unparsedItems: { order: number; rawText: string }[];
  pageLastEditedAt: string | null;
};

export type OverlayExercise = {
  id: string;
  name: string;
  description: string;
  /** Path under the repo, e.g. exercises/api-design */
  path: string;
  githubUrl: string;
  openInCursorUrl: string;
};

export type OverlayLesson = {
  key: string;
  chapterNumber: number | null;
  title: string;
  url?: string | null;
  objective: string | null;
  reflectionPrompt: string | null;
  exercises: OverlayExercise[];
};

export type OverlayCourse = {
  key: string;
  /** Match against normalized Notion title. */
  matchTitles: string[];
  lessons: OverlayLesson[];
};

export type OverlayFile = {
  courses: OverlayCourse[];
};

/** Optional Tinker supplement (v1: unused; seam for later). */
export type TinkerLessonSupplement = {
  preReadQuestion: string | null;
  notesBlocks: {
    question: string;
    answer: string;
    kind: "preRead" | "followUp";
  }[];
  notesEmptyState: string | null;
};

export type TinkerSupplementProvider = {
  getForLesson(
    courseKey: string,
    lessonKey: string
  ): Promise<TinkerLessonSupplement | null>;
  getThreadNotes(courseKey: string): Promise<string | null>;
};

export type CurriculumLesson = {
  lessonNumber: number;
  key: string;
  title: string;
  status: LessonStatus;
  url: string | null;
  objective: string | null;
  reflectionPrompt: string | null;
  exercises: OverlayExercise[];
  /** Always null in v1 (Tinker seam unused). */
  tinkerSupplement: TinkerLessonSupplement | null;
};

export type CurriculumCourse = {
  order: number;
  key: string;
  title: string;
  author: string | null;
  why: string | null;
  url: string | null;
  state: CourseState;
  progress: { done: number; total: number };
  lessons: CurriculumLesson[];
  parseFailed?: boolean;
  rawText?: string;
  threadNotes: string | null;
};

export type Curriculum = {
  courses: CurriculumCourse[];
  practice: ParsedPractice[];
  currentlyReading: {
    courseKey: string | null;
    lessonKey: string | null;
    pageText: string;
  } | null;
  pageLastEditedAt: string | null;
  fetchedAt: string;
  /** When serving last-good cache after a Notion failure. */
  staleAsOf: string | null;
  source: "notion" | "fixture" | "last-good" | "not-connected";
};
