"use client";

import type { CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { formatPageAudioTime, pageAudioToggleLabel } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";

/**
 * Prominent retreat player bound to PageAudioProvider (same <audio> as nav).
 * Progress bar + elapsed/total; no second media element.
 */
export default function RetreatInlinePlayer() {
  const {
    hasClip,
    clip,
    isPlaying,
    currentTime,
    duration,
    toggle,
    seek,
  } = usePageAudio();

  if (!hasClip) return null;

  const safeDuration = duration > 0 ? duration : clip?.durationSeconds ?? 0;
  const progress =
    safeDuration > 0 ? Math.min(currentTime / safeDuration, 1) : 0;

  return (
    <div
      className="retreat-player w-full max-w-md mx-auto rounded-2xl border px-5 py-4 sm:px-6 sm:py-5 space-y-3"
      data-retreat="player"
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          aria-label={pageAudioToggleLabel(clip, isPlaying)}
          data-page-audio="retreat-play"
          className="retreat-play-btn inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full shrink-0 transition-transform hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:hover:scale-100"
        >
          {isPlaying ? (
            <Pause size={20} className="shrink-0 fill-current" aria-hidden="true" />
          ) : (
            <Play
              size={20}
              className="shrink-0 fill-current ml-0.5"
              aria-hidden="true"
            />
          )}
        </button>

        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-xs sm:text-sm font-mono font-bold tracking-wide truncate">
            {clip?.title ?? "Retreat intro"}
          </p>
          <label className="sr-only" htmlFor="retreat-audio-scrubber">
            Seek retreat intro
          </label>
          <input
            id="retreat-audio-scrubber"
            type="range"
            min={0}
            max={safeDuration || 0}
            step={0.1}
            value={Math.min(currentTime, safeDuration || 0)}
            onChange={(e) => {
              const next = Number(e.target.value);
              if (Number.isFinite(next)) seek(next);
            }}
            aria-label="Seek retreat intro"
            aria-valuetext={`${formatPageAudioTime(currentTime)} of ${formatPageAudioTime(safeDuration)}`}
            disabled={safeDuration <= 0}
            className="retreat-scrubber w-full h-1.5 cursor-pointer disabled:opacity-40"
            style={
              {
                "--retreat-progress": `${progress * 100}%`,
              } as CSSProperties
            }
          />
          <div className="flex justify-between text-[10px] sm:text-xs font-mono tabular-nums opacity-80">
            <span data-page-audio="retreat-time-elapsed">
              {formatPageAudioTime(currentTime)}
            </span>
            <span data-page-audio="retreat-time-total">
              {formatPageAudioTime(safeDuration)}
            </span>
          </div>
        </div>
      </div>

      {clip?.transcript ? (
        <details className="text-left">
          <summary className="text-xs font-mono cursor-pointer opacity-80 hover:opacity-100">
            Transcript
          </summary>
          <p className="mt-2 text-xs sm:text-sm font-mono leading-relaxed opacity-90 whitespace-pre-wrap">
            {clip.transcript}
          </p>
        </details>
      ) : null}
    </div>
  );
}
