"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import { FORMATION_SUMMARY } from "@/data/positioning";

export default function About() {
  return (
    <section id="about" className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border/70">
      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
            About
          </span>
          <h2 className="mt-3 font-mono text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground font-bold leading-snug">
            Engineering Manager, Developer Experience
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.12}>
          <p className="mt-8 sm:mt-10 text-[15px] sm:text-lg leading-relaxed text-muted font-mono">
            {FORMATION_SUMMARY}
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
