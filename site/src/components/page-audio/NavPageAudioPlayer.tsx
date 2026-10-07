"use client";

import { Pause, Play } from "lucide-react";
import { formatPageAudioTime } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";

/**
 * Docked full player beside the nav profile coin: play/pause + scrubber + time.
 * On narrow viewports the scrubber collapses to a thin bar under the header.
 */
export default function NavPageAudioPlayer() {
  const { hasClip, isDocked, isPlaying, currentTime, duration, toggle, seek } =
    usePageAudio();

  if (!hasClip || !isDocked) return null;

  const safeDuration = duration > 0 ? duration : 0;
  const progress =
    safeDuration > 0 ? Math.min(100, (currentTime / safeDuration) * 100) : 0;

  const onScrub = (value: string) => {
    const next = Number(value);
    if (!Number.isFinite(next)) return;
    seek(next);
  };

  return (
    <>
      {/* Inline controls beside the coin (desktop + compact play on mobile). */}
      <div
        className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink"
        data-page-audio="nav-inline"
      >
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

        {/* Seekable scrubber: desktop only in the bar; mobile uses under-nav strip. */}
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
            onChange={(e) => onScrub(e.target.value)}
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
      </div>

      {/* Mobile: thin scrubber under the sticky nav row. */}
      <div
        className="sm:hidden absolute left-0 right-0 top-full h-1 bg-border/60"
        data-page-audio="nav-mobile-scrubber"
        aria-hidden={safeDuration <= 0}
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
          onChange={(e) => onScrub(e.target.value)}
          aria-label="Seek page audio"
          disabled={safeDuration <= 0}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:pointer-events-none"
        />
        <div
          className="h-full bg-indigo-dark/80 pointer-events-none transition-[width] duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </>
  );
}
