"use client";

import { Pause, Play } from "lucide-react";
import { formatPageAudioTime } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";

/**
 * Docked nav cluster to the right of the name:
 * - Circular profile photo once scrolled past the homepage hero (isDocked)
 * - Play/pause + scrubber only when this pathname has a pageAudio clip
 *
 * One profile picture only: the in-flow photo owns the nav slot. ScrollMorphAvatar
 * fades out at the dock and stays under the sticky bar (z-40) for contact.
 */
export default function NavPageAudioPlayer() {
  const { hasClip, isDocked, isPlaying, currentTime, duration, toggle, seek } =
    usePageAudio();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const safeDuration = duration > 0 ? duration : 0;

  return (
    <div
      className={`flex items-center gap-1.5 sm:gap-2 min-w-0 shrink transition-[opacity,transform] duration-300 ease-out ${
        isDocked
          ? "relative opacity-100 translate-x-0 translate-y-0"
          : "pointer-events-none absolute left-full top-1/2 z-0 ml-2 -translate-x-1.5 -translate-y-1/2 opacity-0 sm:ml-3"
      }`}
      data-page-audio="nav-dock"
      aria-hidden={isDocked ? undefined : true}
    >
      {/* Measurement target for ScrollMorphAvatar; becomes the visible nav photo when docked. */}
      <div
        id="navbar-avatar-target"
        className={`rounded-full shrink-0 overflow-hidden bg-sand/40 ${
          isDocked
            ? "h-8 w-8 sm:h-9 sm:w-9 ring-1 ring-border/80 shadow-2xs"
            : "h-8 w-8 sm:h-9 sm:w-9"
        }`}
      >
        {isDocked ? (
          <img
            src={`${basePath}/profile-square.jpg`}
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : null}
      </div>

      {hasClip && isDocked ? (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggle();
            }}
            aria-label={isPlaying ? "Pause page audio" : "Play page audio"}
            className="inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-border bg-sand/80 text-indigo-dark shrink-0 transition-all hover:bg-sand hover:border-indigo-dark/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40"
          >
            {isPlaying ? (
              <Pause size={12} className="shrink-0 fill-current" aria-hidden="true" />
            ) : (
              <Play size={12} className="shrink-0 fill-current ml-px" aria-hidden="true" />
            )}
          </button>

          {/* Seekable scrubber: desktop in-bar; mobile uses under-nav strip. */}
          <div className="hidden sm:flex items-center gap-2 min-w-0 flex-1 max-w-[11rem] md:max-w-[14rem]">
            <label className="sr-only" htmlFor="page-audio-scrubber">
              Seek page audio
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
              aria-label="Seek page audio"
              disabled={safeDuration <= 0}
              className="w-full h-1.5 accent-indigo-dark cursor-pointer disabled:opacity-40"
            />
            <span className="text-[10px] font-mono text-muted tabular-nums whitespace-nowrap shrink-0">
              {formatPageAudioTime(currentTime)}
              <span className="text-border-subtle mx-0.5">/</span>
              {formatPageAudioTime(safeDuration)}
            </span>
          </div>
        </>
      ) : null}
    </div>
  );
}

/** Thin seekable bar under the sticky nav on narrow viewports. */
export function NavPageAudioMobileScrubber() {
  const { hasClip, isDocked, currentTime, duration, seek } = usePageAudio();

  if (!hasClip || !isDocked) return null;

  const safeDuration = duration > 0 ? duration : 0;
  const progress =
    safeDuration > 0 ? Math.min(100, (currentTime / safeDuration) * 100) : 0;

  return (
    <div
      className="sm:hidden absolute left-0 right-0 top-full h-1 bg-border/60 z-10"
      data-page-audio="nav-mobile-scrubber"
    >
      <label className="sr-only" htmlFor="page-audio-scrubber-mobile">
        Seek page audio
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
        aria-label="Seek page audio"
        disabled={safeDuration <= 0}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
      />
      <div
        className="h-full bg-indigo-dark/80 pointer-events-none transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
