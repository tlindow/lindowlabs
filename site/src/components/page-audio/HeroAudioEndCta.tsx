"use client";

import {
  ENGINEERING_LEADERS_HERO_CTA_LABEL,
  ENGINEERING_LEADERS_HERO_CTA_URL,
  ENGINEERING_LEADERS_PATH,
} from "@/data/engineeringLeadersPage";
import {
  RESUME_PDF_DOWNLOAD_NAME,
  RESUME_PDF_PATH,
} from "@/data/urls";
import { usePageAudio } from "@/context/PageAudioProvider";
import { openTrackedExternal, trackFunnel } from "@/lib/funnel";
import { usePathname } from "next/navigation";

/**
 * Small post-play link under the hero player once audio ends.
 * Leaders: Schedule with Tyler. Homepage: Download resume.
 */
export default function HeroAudioEndCta() {
  const pathnameRaw = usePathname() || "/";
  const pathname =
    pathnameRaw.length > 1 && pathnameRaw.endsWith("/")
      ? pathnameRaw.slice(0, -1)
      : pathnameRaw;
  const { hasClip, playbackEnded, heroAnchorVisible } = usePageAudio();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const onLeaders =
    pathname === ENGINEERING_LEADERS_PATH ||
    pathname === "/get-your-time-back";

  if (!hasClip || !playbackEnded || !heroAnchorVisible) return null;

  if (onLeaders) {
    return (
      <a
        href={ENGINEERING_LEADERS_HERO_CTA_URL}
        data-hero-audio-end="schedule"
        className="text-xs sm:text-sm font-mono font-bold text-indigo-dark underline-offset-4 hover:underline"
        onClick={(e) => {
          e.preventDefault();
          openTrackedExternal(
            ENGINEERING_LEADERS_HERO_CTA_URL,
            "schedule_with_tyler_hero",
            { forwardUtms: true }
          );
        }}
      >
        {ENGINEERING_LEADERS_HERO_CTA_LABEL}
      </a>
    );
  }

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
