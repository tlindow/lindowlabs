"use client";

import {
  RESUME_PDF_DOWNLOAD_NAME,
  RESUME_PDF_PATH,
} from "@/data/urls";
import { usePageAudio } from "@/context/PageAudioProvider";
import { trackFunnel } from "@/lib/funnel";

/**
 * Small post-play link under the hero player once audio ends.
 * Download resume only (scheduling is the calendar icon / Calendly popup).
 */
export default function HeroAudioEndCta() {
  const { hasClip, playbackEnded, heroAnchorVisible } = usePageAudio();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  if (!hasClip || !playbackEnded || !heroAnchorVisible) return null;

  return (
    <a
      href={`${basePath}${RESUME_PDF_PATH}`}
      download={RESUME_PDF_DOWNLOAD_NAME}
      data-hero-audio-end="resume"
      className="text-xs sm:text-sm font-mono font-bold text-indigo-dark underline-offset-4 hover:underline"
      onClick={() => trackFunnel("download_resume")}
    >
      Download resume
    </a>
  );
}
