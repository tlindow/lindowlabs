/**
 * Fallback copy of the /learning static stub used by build-static-export.mjs
 * when the live stub file has already been moved into .ssr-stash.
 * Keep in sync with src/app/learning/page.static-stub.tsx.
 */
import type { Metadata } from "next";
import LearningSignIn from "@/components/learning/LearningSignIn";

export const metadata: Metadata = {
  title: "Learning | Lindow Labs",
  robots: { index: false, follow: false },
};

export default function LearningStaticStub() {
  return <LearningSignIn staticHost />;
}
