import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  CourseView,
  ReadingPlanNotConnected,
} from "@/components/learning/CurriculumUI";
import { requireCurriculum } from "@/lib/learning/loadLearningPage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Course | Lindow Labs Learning",
  robots: { index: false, follow: false },
};

export default async function CoursePage({
  params,
}: {
  params: Promise<{ courseKey: string }>;
}) {
  const { courseKey } = await params;
  const loaded = await requireCurriculum();
  if (!loaded) return <ReadingPlanNotConnected />;

  const course = loaded.curriculum.courses.find((c) => c.key === courseKey);
  if (!course) notFound();

  return <CourseView course={course} curriculum={loaded.curriculum} />;
}
