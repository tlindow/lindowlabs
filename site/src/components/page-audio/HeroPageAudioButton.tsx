"use client";

import { Pause, Play } from "lucide-react";
import { pageAudioToggleLabel } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";

/** SVG ring geometry for the hero play control (40px / sm 44px button). */
const HERO_PLAY_RING = {
  size: 52,
  radius: 23,
  stroke: 2.75,
} as const;

function playProgressFraction(currentTime: number, duration: number): number {
  if (!(duration > 0) || !Number.isFinite(currentTime)) return 0;
  return Math.min(1, Math.max(0, currentTime / duration));
}

/**
 * Small circular play/pause beside the homepage profile coin (no scrubber).
 * Visible while the hero profile-photo anchor owns the photo (not nav / contact).
 * Once play starts, a circular progress ring fills around the button.
 */
export default function HeroPageAudioButton() {
  const {
    hasClip,
    clip,
    isPastHero,
    showNavPhoto,
    contactAnchorVisible,
    isPlaying,
    currentTime,
    duration,
    toggle,
  } = usePageAudio();

  // Hero owns controls until past the morph threshold; never compete with nav
  // or the Let's talk control.
  if (!hasClip || isPastHero || showNavPhoto || contactAnchorVisible) return null;

  const safeDuration = duration > 0 ? duration : 0;
  const progress = playProgressFraction(currentTime, safeDuration);
  // Ring appears once play has been pressed (playing, or paused mid-track).
  const showProgressRing = isPlaying || currentTime > 0.05;
  const circumference = 2 * Math.PI * HERO_PLAY_RING.radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem] items-center justify-center shrink-0">
      <svg
        className={`pointer-events-none absolute inset-0 h-full w-full -rotate-90 ${
          showProgressRing ? "opacity-100" : "opacity-0"
        }`}
        viewBox={`0 0 ${HERO_PLAY_RING.size} ${HERO_PLAY_RING.size}`}
        aria-hidden="true"
        data-page-audio="hero-progress-ring"
      >
        <circle
          cx={HERO_PLAY_RING.size / 2}
          cy={HERO_PLAY_RING.size / 2}
          r={HERO_PLAY_RING.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={HERO_PLAY_RING.stroke}
          className="text-border"
        />
        <circle
          cx={HERO_PLAY_RING.size / 2}
          cy={HERO_PLAY_RING.size / 2}
          r={HERO_PLAY_RING.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={HERO_PLAY_RING.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className="text-indigo-dark transition-[stroke-dashoffset] duration-100 ease-linear"
        />
      </svg>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }}
        aria-label={pageAudioToggleLabel(clip, isPlaying)}
        data-page-audio="hero-play"
        className="relative z-[1] inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-sand/80 text-indigo-dark shadow-2xs transition-all hover:bg-sand hover:border-indigo-dark/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40 motion-reduce:hover:scale-100"
      >
        {isPlaying ? (
          <Pause size={16} className="shrink-0 fill-current" aria-hidden="true" />
        ) : (
          <Play size={16} className="shrink-0 fill-current ml-0.5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
