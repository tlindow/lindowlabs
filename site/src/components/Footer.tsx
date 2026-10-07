"use client";

import Link from "next/link";
import { Calendar, ArrowUpRight } from "lucide-react";
import { BeginnerSeedMark } from "@/components/brand/BeginnerMarks";
import { BEGINNER_URL } from "@/data/urls";

type FooterProps = {
  /** Contact leaf: drop duplicate Let's talk heading; hide unused avatar slot. */
  contactLeaf?: boolean;
};

export default function Footer({ contactLeaf = false }: FooterProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <footer className="no-print font-mono w-full">
      {/* ========================================================= */}
      {/* SECTION 3: CONTACT CTA                                    */}
      {/* ========================================================= */}
      <section
        id="contact"
        className="w-full pt-16 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6 bg-surface-alt/70 border-t border-border/70"
      >
        <div className="mx-auto max-w-xl text-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-dark block">
              Get in Touch
            </span>
            {!contactLeaf ? (
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
                <Link
                  href="/schedule-time"
                  className="hover:text-indigo-dark transition-colors underline-offset-4 hover:underline"
                >
                  Let&apos;s talk
                </Link>
              </h3>
            ) : null}
            {/* Homepage morph avatar slot; unused on the contact leaf */}
            {!contactLeaf ? (
              <div className="flex justify-center items-center py-2 min-h-[72px] sm:min-h-[88px]">
                <div
                  id="contact-avatar-target"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full opacity-0 pointer-events-none"
                />
              </div>
            ) : null}
            <p className="text-xs sm:text-sm font-mono text-muted max-w-md mx-auto leading-relaxed">
              Open to Engineering Manager and Senior EM roles in developer experience, developer platforms, and partner integrations.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center gap-4">
            <Link
              href="/schedule-time"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-foreground text-background hover:bg-foreground/90 shadow-xs"
              title="Book 30 minutes with Tyler Lindow"
            >
              <Calendar size={15} className="shrink-0" />
              <span>Book 30 minutes</span>
            </Link>

            <a
              href={BEGINNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono font-bold text-foreground/90 hover:text-indigo-dark border border-border hover:border-indigo-dark/40 bg-surface hover:bg-surface-alt shadow-2xs transition-all"
              title="Products: Beginner"
            >
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-muted font-bold">
                Products
              </span>
              <span className="text-border select-none" aria-hidden="true">
                |
              </span>
              <BeginnerSeedMark className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 shadow-xs" />
              <span>Beginner</span>
              <ArrowUpRight
                size={13}
                className="opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
              />
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: PHILOSOPHY (ALTERNATES TO COLOR A: BACKGROUND)  */}
      {/* ========================================================= */}
      <section
        id="philosophy"
        className="w-full py-14 sm:py-20 px-4 sm:px-6 md:px-8 bg-background border-t border-border/70"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-14 items-center">
          {/* Copy Block */}
          <div className="flex flex-col justify-center space-y-3 sm:space-y-4 text-left">
            <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark tracking-widest uppercase">
              Philosophy
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-foreground">
              It starts with home
            </h3>
            <p className="text-base sm:text-lg font-mono text-muted leading-relaxed">
              Excellence follows self-respect.
            </p>
          </div>

          {/* Book Visual Asset */}
          <div className="w-full flex justify-center md:justify-end">
            <a
              href="https://www.amazon.com/dp/1607747308"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center w-full max-w-md aspect-[16/10] rounded-2xl border border-border bg-surface overflow-hidden hover:border-[#FF9900]/60 hover:shadow-md transition-all duration-300 cursor-pointer shadow-2xs"
              title="The Life-Changing Magic of Tidying Up by Marie Kondo on Amazon"
            >
              {/* Blurred ambient book cover background */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${basePath}/book-marie-kondo.jpg`}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-20 scale-125 pointer-events-none"
              />

              {/* Book Cover */}
              <div className="relative z-10 h-[80%] aspect-[351/500] rounded-r-md rounded-l-xs shadow-xl border border-border/70 overflow-hidden group-hover:scale-105 transition-transform duration-500 bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${basePath}/book-marie-kondo.jpg`}
                  alt="The Life-Changing Magic of Tidying Up by Marie Kondo"
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                />
                {/* Subtle book spine shadow */}
                <div className="absolute top-0 bottom-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
              </div>

              {/* Corner external link-out only — no text pill */}
              <div
                className="absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-background/90 backdrop-blur-md border border-border text-foreground group-hover:text-[#FF9900] group-hover:border-[#FF9900]/50 shadow-xs transition-all"
                aria-hidden="true"
              >
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
                />
              </div>
            </a>
          </div>
        </div>
      </section>
    </footer>
  );
}
