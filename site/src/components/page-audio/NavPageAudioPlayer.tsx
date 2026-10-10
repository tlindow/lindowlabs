"use client";

import { Pause, Play } from "lucide-react";
import { formatPageAudioTime, pageAudioToggleLabel } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";
import { usePrefersReducedMotion } from "@/hooks/useProfileAnchors";

/** SVG ring geometry for the docked play control (28px / sm 32px button). */
const PLAY_RING = {
  size: 40,
  radius: 17.5,
  stroke: 2.5,
} as const;

function playProgressFraction(currentTime: number, duration: number): number {
  if (!(duration > 0) || !Number.isFinite(currentTime)) return 0;
  return Math.min(1, Math.max(0, currentTime / duration));
}

/**
 * Docked nav cluster to the right of the name:
 * - Circular profile photo when the morph is scroll-docked at the nav
 * - Play/pause + scrubber + times whenever docked (visible at rest, before play)
 * - Circular progress ring around play once playback has started
 *
 * One profile picture only: the in-flow photo owns the nav slot. ScrollMorphAvatar
 * fades out at the dock and stays under the sticky bar (page shell z-0) for contact.
 *
 * Layout: once past the hero, the avatar (+ player chrome when a clip exists)
 * stays width-reserved so show/hide is opacity-only — no flex reflow of Login,
 * no play/scrubber jump into the photo gap during the Let's talk ↔ nav handoff.
 */
export default function NavPageAudioPlayer() {
  const {
    hasClip,
    clip,
    isPastHero,
    showNavPhoto,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
  } = usePageAudio();
  const prefersReducedMotion = usePrefersReducedMotion();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const safeDuration = duration > 0 ? duration : 0;
  // In-flow once past hero (measurement target always available).
  const inFlow = isPastHero;
  // Full player chrome is reserved whenever a clip exists past the hero;
  // visibility is opacity-only so Login never shifts during handoff.
  const reservePlayerChrome = hasClip && inFlow;
  const showDockedPlayer = hasClip && showNavPhoto;

  const progress = playProgressFraction(currentTime, safeDuration);
  // Ring appears once play has been pressed (playing, or paused mid-track).
  const showProgressRing = showDockedPlayer && (isPlaying || currentTime > 0.05);
  const circumference = 2 * Math.PI * PLAY_RING.radius;
  const dashOffset = circumference * (1 - progress);

  const fadeInClass = prefersReducedMotion
    ? ""
    : "motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out";

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 ${
        inFlow
          ? "relative shrink-0"
          : "pointer-events-none absolute left-full top-1/2 z-0 ml-2 -translate-x-1.5 -translate-y-1/2 opacity-0 sm:ml-3"
      }`}
      data-page-audio="nav-dock"
      aria-hidden={showNavPhoto ? undefined : true}
    >
      {/* Fixed-size slot: opacity only — never collapse width when the photo hides. */}
      <div
        id="navbar-avatar-target"
        className={`rounded-full shrink-0 overflow-hidden h-8 w-8 min-w-8 sm:h-9 sm:w-9 sm:min-w-9 ${
          showNavPhoto
            ? "bg-sand/40 ring-1 ring-border/80 shadow-2xs"
            : "bg-transparent"
        }`}
      >
        <img
          src={`${basePath}/profile-square.jpg`}
          alt=""
          width={36}
          height={36}
          data-profile-photo="nav"
          // Fade in when docking into the nav. Snap hide when hero / Let's talk
          // take over so the morph coin never overlaps a mid-fade nav photo.
          // Opacity only — scale would visually shrink the slot beside the play control.
          className={`h-full w-full object-cover ${
            showNavPhoto
              ? `opacity-100 ${fadeInClass}`
              : "opacity-0 pointer-events-none"
          }`}
          draggable={false}
        />
      </div>

      {reservePlayerChrome ? (
        <div
          className={`flex items-center gap-1.5 sm:gap-2 shrink-0 ${
            showDockedPlayer
              ? `opacity-100 ${fadeInClass}`
              : "opacity-0 pointer-events-none"
          }`}
          data-page-audio="nav-full-player"
          aria-hidden={showDockedPlayer ? undefined : true}
        >
          <div className="relative inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center shrink-0">
            {/* Track + progress ring: visible once play starts; fills with currentTime. */}
            <svg
              className={`pointer-events-none absolute inset-0 h-full w-full -rotate-90 ${
                showProgressRing ? "opacity-100" : "opacity-0"
              }`}
              viewBox={`0 0 ${PLAY_RING.size} ${PLAY_RING.size}`}
              aria-hidden="true"
              data-page-audio="nav-progress-ring"
            >
              <circle
                cx={PLAY_RING.size / 2}
                cy={PLAY_RING.size / 2}
                r={PLAY_RING.radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={PLAY_RING.stroke}
                className="text-border"
              />
              <circle
                cx={PLAY_RING.size / 2}
                cy={PLAY_RING.size / 2}
                r={PLAY_RING.radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={PLAY_RING.stroke}
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
              tabIndex={showDockedPlayer ? 0 : -1}
              data-page-audio="nav-play"
              className="relative z-[1] inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-border bg-sand/80 text-indigo-dark shrink-0 transition-colors hover:bg-sand hover:border-indigo-dark/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40"
            >
              {isPlaying ? (
                <Pause size={12} className="shrink-0 fill-current" aria-hidden="true" />
              ) : (
                <Play size={12} className="shrink-0 fill-current ml-px" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Seekable scrubber + times: always painted when docked (rest and mid-play).
              Desktop/tablet: in-bar. Mobile (390): under-nav strip (see MobileScrubber). */}
          <div
            className="hidden sm:flex items-center gap-2 w-[11rem] md:w-[14rem] shrink-0"
            data-page-audio="nav-scrubber"
          >
            <label className="sr-only" htmlFor="page-audio-scrubber">
              Seek homepage intro
            </label>
            <input
              id="page-audio-scrubber"
              type="range"
              min={0}
              max={safeDuration || 0}
              step={0.1}
              value={Math.min(currentTime, safeDuration || 0)}
              onChange={(e) => {
                const next = Number(e.target.value);
                if (Number.isFinite(next)) seek(next);
              }}
              aria-label="Seek homepage intro"
              aria-valuetext={`${formatPageAudioTime(currentTime)} of ${formatPageAudioTime(safeDuration)}`}
              disabled={safeDuration <= 0 || !showDockedPlayer}
              tabIndex={showDockedPlayer ? 0 : -1}
              className="w-full h-1.5 accent-indigo-dark cursor-pointer disabled:opacity-40"
            />
            <span
              className="text-[10px] font-mono text-muted tabular-nums whitespace-nowrap shrink-0"
              data-page-audio="nav-time"
            >
              {formatPageAudioTime(currentTime)}
              <span className="text-border-subtle mx-0.5">/</span>
              {formatPageAudioTime(safeDuration)}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Seekable timeline under the sticky nav on narrow viewports (≤sm).
 * Reserved whenever a clip is past the hero so Let's talk handoff cannot
 * change sticky chrome height / scroll-anchoring. Visible (with times) at
 * rest whenever the nav owns the docked player — not only during playback.
 */
export function NavPageAudioMobileScrubber() {
  const { hasClip, isPastHero, showNavPhoto, currentTime, duration, seek } =
    usePageAudio();

  if (!hasClip || !isPastHero) return null;

  const safeDuration = duration > 0 ? duration : 0;
  const visible = showNavPhoto;

  return (
    <div
      className={`sm:hidden absolute left-0 right-0 top-full z-10 bg-background border-b border-border ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      data-page-audio="nav-mobile-scrubber"
      aria-hidden={visible ? undefined : true}
    >
      <div className="max-w-5xl mx-auto px-3 h-8 flex items-center gap-2">
        <span
          className="text-[10px] font-mono text-muted tabular-nums whitespace-nowrap shrink-0 w-7 text-right"
          data-page-audio="nav-mobile-time-elapsed"
        >
          {formatPageAudioTime(currentTime)}
        </span>
        <label className="sr-only" htmlFor="page-audio-scrubber-mobile">
          Seek homepage intro
        </label>
        <input
          id="page-audio-scrubber-mobile"
          type="range"
          min={0}
          max={safeDuration || 0}
          step={0.1}
          value={Math.min(currentTime, safeDuration || 0)}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (Number.isFinite(next)) seek(next);
          }}
          aria-label="Seek homepage intro"
          aria-valuetext={`${formatPageAudioTime(currentTime)} of ${formatPageAudioTime(safeDuration)}`}
          disabled={safeDuration <= 0 || !visible}
          tabIndex={visible ? 0 : -1}
          className="flex-1 min-w-0 h-1.5 accent-indigo-dark cursor-pointer disabled:opacity-40"
        />
        <span
          className="text-[10px] font-mono text-muted tabular-nums whitespace-nowrap shrink-0 w-7"
          data-page-audio="nav-mobile-time-total"
        >
          {formatPageAudioTime(safeDuration)}
        </span>
      </div>
    </div>
  );
}
