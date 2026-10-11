"use client";

import { useEffect, useState } from "react";
import {
  RETREAT_HEADLINE,
  RETREAT_INTEREST_CTA,
} from "@/data/retreatPage";
import RetreatInlinePlayer from "@/components/retreat/RetreatInlinePlayer";
import RetreatCalendly from "@/components/retreat/RetreatCalendly";

/**
 * Minimal retreat leaf: headline + player + interest CTA.
 * Scheduling (Calendly) reveals only after the visitor opts in.
 */
export default function RetreatPage() {
  const [showScheduler, setShowScheduler] = useState(false);

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background =
      "linear-gradient(145deg, #FF4D6D 0%, #FF6B35 42%, #F7B801 78%, #C77DFF 100%)";
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  return (
    <div className="retreat-theme min-h-[calc(100vh-4rem)] w-full flex flex-col">
      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 sm:px-6 py-10 sm:py-14">
        <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center gap-8 sm:gap-10">
          <h1 className="retreat-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight max-w-lg">
            {RETREAT_HEADLINE}
          </h1>

          <RetreatInlinePlayer />

          {!showScheduler ? (
            <button
              type="button"
              onClick={() => setShowScheduler(true)}
              data-retreat="interest-cta"
              className="retreat-cta inline-flex items-center justify-center rounded-xl px-7 py-3.5 text-sm sm:text-base font-mono font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:hover:scale-100"
            >
              {RETREAT_INTEREST_CTA}
            </button>
          ) : null}

          <div
            className={`w-full overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
              showScheduler
                ? "max-h-[1100px] opacity-100 translate-y-0"
                : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
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
