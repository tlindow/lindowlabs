"use client";

import { TinkerMark } from "@/components/brand/TinkerLogo";

export default function LeadersWho() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <section
      id="who"
      aria-labelledby="who-title"
      className="w-full px-4 sm:px-6 pb-10 sm:pb-14 scroll-mt-20"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-sand px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12 border border-border/70">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${basePath}/IMG_0548.jpeg`}
              alt="Tyler Lindow"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shrink-0 border border-border shadow-xs"
            />
            <div className="font-mono text-center sm:text-left">
              <h2
                id="who-title"
                className="text-base sm:text-lg font-bold tracking-tight text-foreground mb-4"
              >
                Who you&apos;ll work with
              </h2>
              <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
                I&apos;m Tyler Lindow, an engineering manager for developer
                experience, platforms, and merchant and partner integrations. I
                led Affirm teams that owned Merchant Portal and partner
                integrations, then founded Beginner Work (March to July 2026),
                building{" "}
                <span className="inline-flex items-center gap-1.5 font-bold align-baseline">
                  <TinkerMark className="h-4 w-4" alt="" />
                  Tinker
                </span>
                , an IDE for founders who want to get more technical.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
