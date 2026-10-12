"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import WhatYouGet from "@/components/WhatYouGet";
import {
  ENGINEERING_LEADERS_ABOUT_BODY,
  ENGINEERING_LEADERS_ABOUT_HEADING,
} from "@/data/engineeringLeadersPage";

/**
 * Below-hero sections for /engineering-leaders: early-career About, then the
 * same WhatYouGet pillars as the homepage (Beginner Work + How I lead teams
 * with linked blog posts) so the two pages can't drift.
 */
export default function LeadersBody() {
  return (
    <>
      <section
        id="about"
        className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border/70"
        data-leaders="about"
      >
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
              About
            </span>
            <h2 className="mt-3 font-mono text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground font-bold leading-snug">
              {ENGINEERING_LEADERS_ABOUT_HEADING}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <p className="mt-8 sm:mt-10 text-[15px] sm:text-lg leading-relaxed text-muted font-mono">
              {ENGINEERING_LEADERS_ABOUT_BODY}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <WhatYouGet />
    </>
  );
}
