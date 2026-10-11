"use client";

import { useEffect, useState } from "react";
import { Play, Pause } from "lucide-react";
import {
  RETREAT_CALENDLY_URL,
  RETREAT_PAGE_TITLE,
} from "@/data/retreatPage";
import { pageAudioToggleLabel } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";
import RetreatWaveform, {
  primeRetreatAudioGraph,
} from "@/components/retreat/RetreatWaveform";

/**
 * Full-viewport retreat leaf: rainbow waveform + one play control.
 * "Pick a time" appears only after retreat-v4 audio ends (Calendly link, new tab).
 * Transcript stays sr-only via PageAudioProvider.
 */
export default function RetreatPage() {
  const [showPickTime, setShowPickTime] = useState(false);
  const { hasClip, clip, isPlaying, toggle } = usePageAudio();

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "#fffdf7";
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  // Reveal booking only when retreat audio finishes (not before).
  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;
    const onEnded = () => setShowPickTime(true);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  return (
    <div className="retreat-theme retreat-stage" data-retreat="stage">
      <h1 className="sr-only">{RETREAT_PAGE_TITLE}</h1>
      <RetreatWaveform />
      <div className="retreat-controls" data-retreat="controls">
        {hasClip ? (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              primeRetreatAudioGraph();
              toggle();
            }}
            aria-label={pageAudioToggleLabel(clip, isPlaying)}
            data-page-audio="retreat-play"
            data-retreat="play"
            className="retreat-play-btn"
          >
            {isPlaying ? (
              <Pause size={28} className="shrink-0 fill-current" aria-hidden />
            ) : (
              <Play
                size={28}
                className="shrink-0 fill-current ml-0.5"
                aria-hidden
              />
            )}
          </button>
        ) : null}

        {showPickTime ? (
          <a
            href={RETREAT_CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-retreat="pick-time"
            className="retreat-pick-btn"
          >
            Pick a time
          </a>
        ) : null}
      </div>
    </div>
  );
}
