"use client";

import { useEffect, useRef, useState } from "react";
import { TINKER_RAINBOW_PALETTE } from "@/data/tinkerRetreatTokens";
import { usePageAudio } from "@/context/PageAudioProvider";

const BAR_COUNT = 48;
const IDLE_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = i / (BAR_COUNT - 1);
  return 0.22 + 0.2 * Math.sin(t * Math.PI);
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
      sharedAnalyser.fftSize = 128;
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
 * Wide multi-color waveform under the retreat hero (Tinker rainbow palette).
 * Bars animate while PageAudio is playing; decorative (play is the hero coin).
 */
export default function RetreatWaveform() {
  const { hasClip, isPlaying } = usePageAudio();
  const [heights, setHeights] = useState<number[]>(() => [...IDLE_HEIGHTS]);
  const rafRef = useRef(0);
  const phaseRef = useRef(0);

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
            next[i] = Math.max(0.14, bins[idx] / 255);
          }
        } else {
          phaseRef.current = now / 180;
          for (let i = 0; i < BAR_COUNT; i++) {
            const wave =
              0.35 +
              0.55 *
                Math.abs(
                  Math.sin(phaseRef.current + i * 0.35) *
                    Math.cos(phaseRef.current * 0.7 + i * 0.18)
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

  // Resume analyser graph once playback starts (hero play toggles PageAudio).
  useEffect(() => {
    if (!isPlaying) return;
    const audio = document.querySelector("audio");
    if (audio) ensureAnalyser(audio);
    if (sharedAudioCtx?.state === "suspended") {
      void sharedAudioCtx.resume();
    }
  }, [isPlaying]);

  if (!hasClip) return null;

  return (
    <div
      className="retreat-waveform"
      data-retreat="waveform"
      aria-hidden="true"
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="retreat-wave-bar"
          style={{
            height: `${Math.round(h * 100)}%`,
            backgroundColor:
              TINKER_RAINBOW_PALETTE[i % TINKER_RAINBOW_PALETTE.length],
            opacity: isPlaying ? 1 : 0.55,
          }}
        />
      ))}
    </div>
  );
}
