"use client";

import Link from "next/link";
import { Calendar } from "lucide-react";

const CALENDLY_URL = "https://calendly.com/tylerlindow/connect";

export default function LeadersFooterCta() {
  return (
    <footer className="no-print font-mono w-full">
      <section
        id="book"
        className="w-full pt-16 sm:pt-24 pb-14 sm:pb-20 px-4 sm:px-6 bg-background border-t border-border/70"
      >
        <div className="mx-auto max-w-xl text-center space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-dark block">
              Ready when you are
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground font-mono">
              Get your spark back.
            </h2>
            <p className="text-xs sm:text-sm font-mono text-muted max-w-md mx-auto leading-relaxed">
              Thirty minutes. No agenda. Just space to hang out and explore.
            </p>
          </div>

          <div className="pt-2 flex flex-col items-center gap-4">
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 text-sm sm:text-base font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-foreground text-background hover:bg-foreground/90 shadow-xs"
              title="Book a free session with Tyler Lindow"
            >
              <Calendar size={16} className="shrink-0" />
              <span>Book a free session</span>
            </a>

            <Link
              href="/"
              className="text-xs font-mono text-muted hover:text-indigo-dark transition-colors underline-offset-4 hover:underline"
            >
              Hiring? See my recruiter page
            </Link>
          </div>
        </div>
      </section>
    </footer>
  );
}
