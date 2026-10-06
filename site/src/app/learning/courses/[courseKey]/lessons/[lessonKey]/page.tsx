import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  LessonView,
  ReadingPlanNotConnected,
} from "@/components/learning/CurriculumUI";
import { requireCurriculum } from "@/lib/learning/loadLearningPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lesson | Lindow Labs Learning",
  robots: { index: false, follow: false },
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseKey: string; lessonKey: string }>;
}) {
  const { courseKey, lessonKey } = await params;
  const loaded = await requireCurriculum();
  if (!loaded) return <ReadingPlanNotConnected />;

  const course = loaded.curriculum.courses.find((c) => c.key === courseKey);
  if (!course) notFound();
  const lesson = course.lessons.find((l) => l.key === lessonKey);
  if (!lesson) notFound();

  return <LessonView course={course} lesson={lesson} />;
}
