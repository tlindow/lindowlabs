"use client";

import { Pause, Play } from "lucide-react";
import { pageAudioToggleLabel } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";

/**
 * Small circular play/pause beside the homepage profile coin (no scrubber).
 * Visible while the hero profile-photo anchor owns the photo (not nav / contact).
 */
export default function HeroPageAudioButton() {
  const {
    hasClip,
    clip,
    isPastHero,
    showNavPhoto,
    contactAnchorVisible,
    isPlaying,
    toggle,
  } = usePageAudio();

  // Hero owns controls until past the morph threshold; never compete with nav
  // or the Let's talk control.
  if (!hasClip || isPastHero || showNavPhoto || contactAnchorVisible) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-label={pageAudioToggleLabel(clip, isPlaying)}
      data-page-audio="hero-play"
      className="inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border bg-sand/80 text-indigo-dark shadow-2xs transition-all hover:bg-sand hover:border-indigo-dark/40 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40 motion-reduce:hover:scale-100"
    >
      {isPlaying ? (
        <Pause size={16} className="shrink-0 fill-current" aria-hidden="true" />
      ) : (
        <Play size={16} className="shrink-0 fill-current ml-0.5" aria-hidden="true" />
      )}
    </button>
  );
}
