"use client";

import { Pause, Play } from "lucide-react";
import { formatPageAudioTime, pageAudioToggleLabel } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";
import { usePrefersReducedMotion } from "@/hooks/useProfileAnchors";

const DOCK_PLAY_RING = {
  size: 40,
  radius: 17,
  stroke: 2.25,
} as const;

function playProgressFraction(currentTime: number, duration: number): number {
  if (!(duration > 0) || !Number.isFinite(currentTime)) return 0;
  return Math.min(1, Math.max(0, currentTime / duration));
}

/**
 * Floating bottom audio dock (past hero): profile coin + play with progress
 * ring + scrubber/times. Glass pill, safe-area aware. Morph targets live here
 * (`#navbar-avatar-target` / `#navbar-play-target` ids kept for morph measure).
 */
export default function BottomDockPlayer() {
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

  if (!hasClip) return null;

  const safeDuration = duration > 0 ? duration : 0;
  const visible = isPastHero && showNavPhoto;
  const fadeInClass = prefersReducedMotion
    ? ""
    : "motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out";
  const ringProgress = playProgressFraction(currentTime, safeDuration);
  const showProgressRing = isPlaying || currentTime > 0.05;
  const circumference = 2 * Math.PI * DOCK_PLAY_RING.radius;
  const dashOffset = circumference * (1 - ringProgress);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] ${
        visible
          ? `opacity-100 ${fadeInClass}`
          : "opacity-0"
      }`}
      data-page-audio="bottom-dock"
      aria-hidden={visible ? undefined : true}
    >
      <div
        className={`pointer-events-auto flex items-center gap-2.5 sm:gap-3 rounded-full border border-border/70 bg-background/75 backdrop-blur-xl shadow-md px-3 py-2 sm:px-4 sm:py-2.5 max-w-[min(36rem,calc(100vw-1.5rem))] ${
          visible ? "" : "pointer-events-none"
        }`}
        data-page-audio="nav-full-player"
      >
        <div
          id="navbar-avatar-target"
          className={`rounded-full shrink-0 overflow-hidden h-9 w-9 min-w-9 sm:h-10 sm:w-10 sm:min-w-10 ${
            visible
              ? "bg-sand/40 ring-1 ring-border/80 shadow-2xs"
              : "bg-transparent"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/profile-square.jpg`}
            alt=""
            width={40}
            height={40}
            data-profile-photo="nav"
            className={`h-full w-full object-cover ${
              visible
                ? `opacity-100 ${fadeInClass}`
                : "opacity-0 pointer-events-none"
            }`}
            draggable={false}
          />
        </div>

        <div
          id="navbar-play-target"
          className="relative h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          data-page-audio="nav-play-target"
        >
          <svg
            className={`pointer-events-none absolute inset-0 h-full w-full -rotate-90 ${
              showProgressRing && visible ? "opacity-100" : "opacity-0"
            }`}
            viewBox={`0 0 ${DOCK_PLAY_RING.size} ${DOCK_PLAY_RING.size}`}
            aria-hidden="true"
            data-page-audio="dock-progress-ring"
          >
            <circle
              cx={DOCK_PLAY_RING.size / 2}
              cy={DOCK_PLAY_RING.size / 2}
              r={DOCK_PLAY_RING.radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={DOCK_PLAY_RING.stroke}
              className="text-border"
            />
            <circle
              cx={DOCK_PLAY_RING.size / 2}
              cy={DOCK_PLAY_RING.size / 2}
              r={DOCK_PLAY_RING.radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={DOCK_PLAY_RING.stroke}
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
            tabIndex={visible ? 0 : -1}
            data-page-audio="nav-play"
            className="relative z-[1] inline-flex h-full w-full items-center justify-center rounded-full border border-border bg-sand/90 text-indigo-dark shrink-0 transition-colors hover:bg-sand hover:border-indigo-dark/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40"
          >
            {isPlaying ? (
              <Pause size={14} className="shrink-0 fill-current" aria-hidden="true" />
            ) : (
              <Play
                size={14}
                className="shrink-0 fill-current ml-px"
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        <div
          className="flex items-center gap-2 min-w-0 flex-1"
          data-page-audio="nav-scrubber"
        >
          <span
            className="text-[10px] font-mono text-muted tabular-nums whitespace-nowrap shrink-0 w-7 text-right"
            data-page-audio="nav-mobile-time-elapsed"
          >
            {formatPageAudioTime(currentTime)}
          </span>
          <label className="sr-only" htmlFor="page-audio-scrubber-dock">
            Seek page audio
          </label>
          <input
            id="page-audio-scrubber-dock"
            type="range"
            min={0}
            max={safeDuration || 0}
            step={0.1}
            value={Math.min(currentTime, safeDuration || 0)}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) seek(next);
            }}
            aria-label="Seek page audio"
            aria-valuetext={`${formatPageAudioTime(currentTime)} of ${formatPageAudioTime(safeDuration)}`}
            disabled={safeDuration <= 0 || !visible}
            tabIndex={visible ? 0 : -1}
            className="flex-1 min-w-[4.5rem] sm:min-w-[8rem] h-1.5 accent-indigo-dark cursor-pointer disabled:opacity-40"
            data-page-audio="nav-time"
          />
          <span
            className="text-[10px] font-mono text-muted tabular-nums whitespace-nowrap shrink-0 w-7"
            data-page-audio="nav-mobile-time-total"
          >
            {formatPageAudioTime(safeDuration)}
          </span>
        </div>
      </div>
    </div>
  );
}
