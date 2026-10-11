"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { TinkerMark } from "@/components/brand/TinkerLogo";
import Footer from "@/components/Footer";
import ScrollMorphAvatar from "@/components/animations/ScrollMorphAvatar";
import ScrollMorphPlayButton from "@/components/animations/ScrollMorphPlayButton";
import RetreatWaveform from "@/components/retreat/RetreatWaveform";
import {
  RETREAT_CALENDLY_URL,
  RETREAT_DESCRIPTION,
  RETREAT_KICKER,
} from "@/data/retreatPage";

/**
 * Retreat leaf as a sibling of the homepage hero: same lavender surface,
 * morph coin + progress-ring play, mono display type. Waveform below;
 * description under the waveform; "Pick a time" only after retreat-v4 ends.
 */
export default function RetreatPage() {
  const [showPickTime, setShowPickTime] = useState(false);

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "#F3EEF8";
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
    <div className="homepage-theme min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between overflow-x-clip">
      <ScrollMorphAvatar />
      <ScrollMorphPlayButton />

      <div className="no-print w-full">
        <main className="w-full">
          <header
            id="hero"
            className="@container relative text-center px-4 max-w-5xl mx-auto scroll-mt-20 min-w-0 w-full overflow-x-clip"
            data-retreat="stage"
          >
            <div
              id="hero-stage"
              className="grid h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)] grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] justify-items-center min-w-0 w-full"
            >
              <div className="flex flex-col items-center justify-end gap-3 sm:gap-4 w-full min-h-0 pb-3 sm:pb-4">
                <div className="relative">
                  <div
                    id="hero-avatar-anchor"
                    data-profile-anchor="hero"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 relative"
                  />
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 sm:ml-4">
                    <div
                      id="hero-play-anchor"
                      className="h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest block">
                  {RETREAT_KICKER}
                </span>
              </div>

              <h1 className="w-full max-w-full min-w-0 px-0.5 text-[length:clamp(1.05rem,min(6.2cqi,calc(100cqi/15.5)),4.7rem)] font-black tracking-tight text-foreground leading-[1.08] mx-auto overflow-x-clip">
                <span className="block">
                  {"Empowering engineering "}
                  <span className="inline-flex items-center whitespace-nowrap">
                    leaders
                    <TinkerMark
                      className="ml-[0.12em] mr-[0.02em] h-[1cap] w-[1cap]"
                      alt="Tinker"
                    />
                  </span>
                </span>
                <span
                  className="block invisible select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {"\u00a0"}
                </span>
              </h1>

              <div
                id="hero-below"
                className="flex flex-col items-center justify-start gap-5 sm:gap-6 w-full min-h-0 min-w-0 max-w-full pt-3 sm:pt-4 pb-8 sm:pb-10"
              >
                {showPickTime ? (
                  <a
                    href={RETREAT_CALENDLY_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-retreat="pick-time"
                    className="inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    title="Pick a time on Calendly"
                  >
                    <Calendar size={15} className="shrink-0" />
                    <span>Pick a time</span>
                  </a>
                ) : null}

                <div className="w-full min-w-0 max-w-full">
                  <RetreatWaveform />
                </div>

                <p
                  className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto w-full max-w-full min-w-0 text-pretty px-1"
                  data-retreat="description"
                >
                  {RETREAT_DESCRIPTION}
                </p>
              </div>
            </div>
            <div
              id="hero-overflow-spacer"
              className="w-full"
              aria-hidden="true"
            />
          </header>
        </main>
      </div>

      <Footer profilePhotoAnchor />
    </div>
  );
}
