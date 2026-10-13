"use client";

import {
  RESUME_PDF_DOWNLOAD_NAME,
  RESUME_PDF_PATH,
} from "@/data/urls";
import { usePageAudio } from "@/context/PageAudioProvider";
import { trackFunnel } from "@/lib/funnel";

/**
 * INTENTIONAL REGRESSION (throwaway / LL-86 proof): post-play "Download resume"
 * under the hero player. Duplicates the real Download resume CTA (#204).
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
