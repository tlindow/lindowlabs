/**
 * Static stub for /learning during STATIC_EXPORT builds (GitHub Pages + local checks).
 * Renders the same Tinker-matching login UI. SMS OTP only works on Vercel SSR;
 * the form refuses honestly on this static host (no client-side security).
 * Dashboard data is never imported here, so it stays out of the Pages bundle.
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
