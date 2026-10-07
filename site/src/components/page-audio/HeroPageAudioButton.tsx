"use client";

import { Pause, Play } from "lucide-react";
import { usePageAudio } from "@/context/PageAudioProvider";

/**
 * Small circular play/pause beside the homepage profile coin (no scrubber).
 * Hidden once the coin docks into the nav.
 */
export default function HeroPageAudioButton() {
  const { hasClip, isDocked, isPlaying, toggle } = usePageAudio();

  if (!hasClip || isDocked) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-label={isPlaying ? "Pause page audio" : "Play page audio"}
      className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-sand/80 text-indigo-dark shadow-2xs transition-all hover:bg-sand hover:border-indigo-dark/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40"
    >
      {isPlaying ? (
        <Pause size={16} className="shrink-0 fill-current" aria-hidden="true" />
      ) : (
        <Play size={16} className="shrink-0 fill-current ml-0.5" aria-hidden="true" />
      )}
    </button>
  );
}
