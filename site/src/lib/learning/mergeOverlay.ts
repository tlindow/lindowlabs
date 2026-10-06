/**
 * Join a parsed Notion Reading plan with the checked-in overlay.
 * Overlay entries that no longer match are dropped (and logged).
 * New page items with no overlay keep title/scope/status only.
 */

import { courseKeyFromTitle } from "@/lib/learning/normalize";
import type {
  Curriculum,
  CurriculumCourse,
  CurriculumLesson,
  LessonStatus,
  OverlayCourse,
  OverlayFile,
  ParsedCourse,
  ParsedLessonStub,
  ParsedReadingPlan,
  TinkerLessonSupplement,
} from "@/lib/learning/types";

function findOverlay(
  overlay: OverlayFile,
  course: ParsedCourse
): OverlayCourse | null {
  const byKey = overlay.courses.find((c) => c.key === course.key);
  if (byKey) return byKey;
  const n = courseKeyFromTitle(course.title);
  return (
    overlay.courses.find(
      (c) =>
        c.key === n ||
        c.matchTitles.some((t) => courseKeyFromTitle(t) === n)
    ) || null
  );
}

function statusLabel(s: LessonStatus): LessonStatus {
  return s;
}

function buildLessons(
  parsed: ParsedCourse,
  overlayCourse: OverlayCourse | null,
  supplements: Map<string, TinkerLessonSupplement | null>
): CurriculumLesson[] {
  const coverToCover = parsed.lessons.some((l) => l.key === "cover");
  const statusByKey = new Map<string, LessonStatus>();
  for (const stub of parsed.lessons) {
    if (stub.key === "cover") continue;
    statusByKey.set(stub.key, stub.status);
  }

  if (coverToCover && overlayCourse) {
    // Expand full chapter list from overlay; page supplies done/current only.
    return overlayCourse.lessons.map((ol, i) => {
      const status = statusByKey.get(ol.key) ?? "pending";
      const showExtras = status === "done" || status === "current";
      return {
        lessonNumber: i + 1,
        key: ol.key,
        title: ol.chapterNumber
          ? `Ch ${ol.chapterNumber}: ${ol.title}`
          : ol.title,
        status: statusLabel(status),
        url: ol.url ?? null,
        objective: ol.objective,
        reflectionPrompt: showExtras ? ol.reflectionPrompt : null,
        exercises: showExtras ? ol.exercises : [],
        tinkerSupplement: supplements.get(`${parsed.key}:${ol.key}`) ?? null,
      };
    });
  }

  // Page-driven lesson list (SRE chapters, TS links, essay).
  const stubs = parsed.lessons.filter((l) => l.key !== "cover");
  if (!stubs.length && overlayCourse) {
    return overlayCourse.lessons.map((ol, i) => ({
      lessonNumber: i + 1,
      key: ol.key,
      title: ol.chapterNumber ? `Ch ${ol.chapterNumber}: ${ol.title}` : ol.title,
      status: "pending" as const,
      url: ol.url ?? null,
      objective: ol.objective,
      reflectionPrompt: null,
      exercises: [],
      tinkerSupplement: null,
    }));
  }

  return stubs.map((stub, i) =>
    mergeStub(stub, i + 1, overlayCourse, parsed.key, supplements)
  );
}

function mergeStub(
  stub: ParsedLessonStub,
  lessonNumber: number,
  overlayCourse: OverlayCourse | null,
  courseKey: string,
  supplements: Map<string, TinkerLessonSupplement | null>
): CurriculumLesson {
  const ol =
    overlayCourse?.lessons.find((l) => l.key === stub.key) ||
    overlayCourse?.lessons.find(
      (l) =>
        stub.chapterNumber != null && l.chapterNumber === stub.chapterNumber
    ) ||
    null;

  const showExtras = stub.status === "done" || stub.status === "current";
  let title = stub.label;
  if (ol) {
    title = ol.chapterNumber
      ? `Ch ${ol.chapterNumber}: ${ol.title}`
      : ol.title;
  }

  return {
    lessonNumber,
    key: stub.key,
    title,
    status: stub.status,
    url: stub.url ?? ol?.url ?? null,
    objective: ol?.objective ?? null,
    reflectionPrompt: showExtras ? ol?.reflectionPrompt ?? null : null,
    exercises: showExtras ? ol?.exercises ?? [] : [],
    tinkerSupplement: supplements.get(`${courseKey}:${stub.key}`) ?? null,
  };
}

export function mergeCurriculum(
  plan: ParsedReadingPlan,
  overlay: OverlayFile,
  opts: {
    fetchedAt: string;
    staleAsOf?: string | null;
    source: Curriculum["source"];
    supplements?: Map<string, TinkerLessonSupplement | null>;
    threadNotes?: Map<string, string | null>;
  }
): Curriculum {
  const supplements = opts.supplements ?? new Map();
  const threadNotes = opts.threadNotes ?? new Map();
  const dropped: string[] = [];

  const courses: CurriculumCourse[] = plan.courses.map((parsed) => {
    const oc = findOverlay(overlay, parsed);
    if (!oc && !parsed.parseFailed) {
      // overlay missing is fine; log when overlay has orphans later
    }
    const lessons = parsed.parseFailed
      ? []
      : buildLessons(parsed, oc, supplements);
    const done = lessons.filter((l) => l.status === "done").length;
    const hasCurrent = lessons.some((l) => l.status === "current");
    let state: CurriculumCourse["state"] = "not_started";
    if (hasCurrent) state = "current";
    else if (done > 0 && done === lessons.length && lessons.length > 0) {
      state = "completed";
    } else if (
      plan.currentlyReading?.courseTitle &&
      courseKeyFromTitle(plan.currentlyReading.courseTitle) === parsed.key
    ) {
      state = "current";
    }

    return {
      order: parsed.order,
      key: parsed.key,
      title: parsed.title,
      author: parsed.author,
      why: parsed.why,
      url: parsed.url,
      state,
      progress: { done, total: lessons.length },
      lessons,
      parseFailed: parsed.parseFailed,
      rawText: parsed.rawText,
      threadNotes: threadNotes.get(parsed.key) ?? null,
    };
  });

  // Drop overlay courses that no longer match any page course.
  for (const oc of overlay.courses) {
    if (!courses.some((c) => c.key === oc.key)) {
      dropped.push(oc.key);
    }
  }
  if (dropped.length && typeof console !== "undefined") {
    console.info(
      "[learning] overlay courses with no page match (dropped):",
      dropped.join(", ")
    );
  }

  let currentlyReading: Curriculum["currentlyReading"] = null;
  if (plan.currentlyReading) {
    const courseKey = plan.currentlyReading.courseTitle
      ? courseKeyFromTitle(plan.currentlyReading.courseTitle)
      : null;
    const course = courses.find((c) => c.key === courseKey);
    const lessonKey =
      course?.lessons.find((l) => l.status === "current")?.key ?? null;
    currentlyReading = {
      courseKey,
      lessonKey,
      pageText: plan.currentlyReading.pageText,
    };
  }

  return {
    courses: courses.sort((a, b) => a.order - b.order),
    practice: plan.practice,
    currentlyReading,
    pageLastEditedAt: plan.pageLastEditedAt,
    fetchedAt: opts.fetchedAt,
    staleAsOf: opts.staleAsOf ?? null,
    source: opts.source,
  };
}
