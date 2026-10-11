"use client";

import { useEffect, useState } from "react";
import { RETREAT_CALENDLY_URL, RETREAT_HEADLINE } from "@/data/retreatPage";
import { usePageAudio } from "@/context/PageAudioProvider";
import RetreatWaveform from "@/components/retreat/RetreatWaveform";
import RetreatCalendly from "@/components/retreat/RetreatCalendly";

/**
 * Minimal retreat leaf: headline + waveform + Pick a time text link.
 * Calendly embed reveals when audio ends. Pick a time links to Calendly.
 */
export default function RetreatPage() {
  const [showScheduler, setShowScheduler] = useState(false);
  const { clip } = usePageAudio();

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "#fffdf7";
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  // Reveal Calendly when retreat audio finishes.
  useEffect(() => {
    const audio = document.querySelector("audio");
    if (!audio) return;
    const onEnded = () => setShowScheduler(true);
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  return (
    <div className="retreat-theme min-h-[calc(100vh-4rem)] w-full flex flex-col relative overflow-hidden">
      <main className="relative z-[1] flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center gap-8 sm:gap-10">
          <h1 className="retreat-headline max-w-lg">{RETREAT_HEADLINE}</h1>

          <div className="w-full space-y-3">
            <RetreatWaveform />
            <a
              href={RETREAT_CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              data-retreat="pick-time"
              className="retreat-pick-link"
            >
              Pick a time
            </a>
            {clip?.transcript ? (
              <details className="retreat-transcript text-left max-w-md mx-auto">
                <summary>Transcript</summary>
                <p>{clip.transcript}</p>
              </details>
            ) : null}
          </div>

          <div
            className={`w-full overflow-hidden transition-[max-height,opacity] duration-500 ease-out motion-reduce:transition-none ${
              showScheduler
                ? "max-h-[1100px] opacity-100"
                : "max-h-0 opacity-0 pointer-events-none"
            }`}
            aria-hidden={!showScheduler}
          >
            {showScheduler ? <RetreatCalendly /> : null}
          </div>
        </div>
      </main>
    </div>
  );
}
