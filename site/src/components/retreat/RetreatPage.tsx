"use client";

import { useEffect, useState } from "react";
import {
  RETREAT_HEADLINE,
  RETREAT_INTEREST_CTA,
} from "@/data/retreatPage";
import { usePageAudio } from "@/context/PageAudioProvider";
import RetreatWaveform from "@/components/retreat/RetreatWaveform";
import RetreatCalendly from "@/components/retreat/RetreatCalendly";

/**
 * Minimal retreat leaf in Tinker visual language: headline + waveform + CTA.
 * Scheduling (Calendly) reveals only after the visitor opts in.
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

  return (
    <div className="retreat-theme min-h-[calc(100vh-4rem)] w-full flex flex-col relative overflow-hidden">
      <div className="retreat-edge" aria-hidden="true" />
      <main className="relative z-[1] flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center gap-8 sm:gap-10">
          <h1 className="retreat-headline max-w-lg">
            {RETREAT_HEADLINE}
          </h1>

          <div className="w-full space-y-3">
            <RetreatWaveform />
            {clip?.transcript ? (
              <details className="retreat-transcript text-left max-w-md mx-auto">
                <summary>Transcript</summary>
                <p>{clip.transcript}</p>
              </details>
            ) : null}
          </div>

          {!showScheduler ? (
            <button
              type="button"
              onClick={() => setShowScheduler(true)}
              data-retreat="interest-cta"
              className="retreat-cta inline-flex items-center justify-center px-7 py-3.5 text-sm sm:text-base font-semibold focus:outline-none"
            >
              {RETREAT_INTEREST_CTA}
            </button>
          ) : null}

          <div
            className={`w-full overflow-hidden transition-[max-height,opacity] duration-300 ease-out motion-reduce:transition-none ${
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
