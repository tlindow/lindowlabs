"use client";

import { useEffect, useRef, useState } from "react";
import { pageAudioToggleLabel } from "@/data/pageAudio";
import { TINKER_RAINBOW_PALETTE } from "@/data/tinkerRetreatTokens";
import { usePageAudio } from "@/context/PageAudioProvider";

const BAR_COUNT = 28;
const IDLE_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / (BAR_COUNT - 1);
  return 0.18 + 0.12 * Math.sin(t * Math.PI);
});

/** Module-level Web Audio graph so createMediaElementSource runs once. */
let sharedAudioCtx: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;
let sharedSource: MediaElementAudioSourceNode | null = null;
let sharedAudioEl: HTMLAudioElement | null = null;

function ensureAnalyser(audio: HTMLAudioElement): AnalyserNode | null {
  try {
    if (sharedAnalyser && sharedAudioEl === audio) return sharedAnalyser;
    if (sharedSource && sharedAudioEl !== audio) return null;

    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;

    if (!sharedAudioCtx) sharedAudioCtx = new AC();
    if (sharedAudioCtx.state === "suspended") {
      void sharedAudioCtx.resume();
    }

    if (!sharedSource) {
      sharedSource = sharedAudioCtx.createMediaElementSource(audio);
      sharedAnalyser = sharedAudioCtx.createAnalyser();
      sharedAnalyser.fftSize = 64;
      sharedAnalyser.smoothingTimeConstant = 0.72;
      sharedSource.connect(sharedAnalyser);
      sharedAnalyser.connect(sharedAudioCtx.destination);
      sharedAudioEl = audio;
    }
    return sharedAnalyser;
  } catch {
    return null;
  }
}

/**
 * Multi-color waveform tap target bound to PageAudio (retreat-v4.mp3).
 * Colors from Tinker rainbow-web / heatmap palette. Bars animate while
 * playing (Web Audio analyser when available; otherwise a looping pulse).
 */
export default function RetreatWaveform() {
  const { hasClip, clip, isPlaying, toggle } = usePageAudio();
  const [heights, setHeights] = useState<number[]>(() => [...IDLE_HEIGHTS]);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  useEffect(() => {
    if (!hasClip) return;

    const tick = (now: number) => {
      const audio = document.querySelector("audio");
      let next = [...IDLE_HEIGHTS];

      if (isPlaying && audio) {
        const analyser = ensureAnalyser(audio);
        if (analyser) {
          const bins = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(bins);
          for (let i = 0; i < BAR_COUNT; i++) {
            const idx = Math.min(
              bins.length - 1,
              Math.floor((i / BAR_COUNT) * bins.length)
            );
            next[i] = Math.max(0.12, bins[idx] / 255);
          }
        } else {
          phaseRef.current = now / 180;
          for (let i = 0; i < BAR_COUNT; i++) {
            const wave =
              0.35 +
              0.55 *
                Math.abs(
                  Math.sin(phaseRef.current + i * 0.45) *
                    Math.cos(phaseRef.current * 0.7 + i * 0.2)
                );
            next[i] = wave;
          }
        }
      } else {
        next = [...IDLE_HEIGHTS];
      }

      setHeights(next);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [hasClip, isPlaying]);

  if (!hasClip) return null;

  return (
    <div
      className="retreat-wave-row flex items-center justify-center gap-3 sm:gap-4 w-full max-w-md mx-auto"
      data-retreat="player"
    >
      {/* Regular profile photo beside the waveform (Tinker circle crop). */}
      <div
        className="retreat-photo-avatar shrink-0"
        aria-hidden="true"
        data-retreat="photo-avatar"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${basePath}/profile-square.jpg`}
          alt=""
          width={56}
          height={56}
          draggable={false}
        />
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const audio = document.querySelector("audio");
          if (audio) ensureAnalyser(audio);
          if (sharedAudioCtx?.state === "suspended") {
            void sharedAudioCtx.resume();
          }
          toggle();
        }}
        aria-label={pageAudioToggleLabel(clip, isPlaying)}
        data-page-audio="retreat-play"
        data-retreat="waveform"
        className="retreat-waveform flex-1 min-w-0 h-16 sm:h-20 inline-flex items-end justify-center gap-[3px] sm:gap-1 px-1 sm:px-2 py-2 focus:outline-none"
      >
        {heights.map((h, i) => (
          <span
            key={i}
            className="retreat-wave-bar block w-[3px] sm:w-[4px] rounded-full"
            style={{
              height: `${Math.round(h * 100)}%`,
              backgroundColor:
                TINKER_RAINBOW_PALETTE[i % TINKER_RAINBOW_PALETTE.length],
              opacity: isPlaying ? 1 : 0.55,
            }}
          />
        ))}
      </button>
    </div>
  );
}
