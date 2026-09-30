"use client";

import { Calendar, ArrowDown } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import WebGLCoin from "@/components/WebGLCoin";

const CALENDLY_URL = "https://calendly.com/tylerlindow/connect";

export default function LeadersHero() {
  return (
    <header
      id="hero"
      className="flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto space-y-6 sm:space-y-8 relative pt-28 sm:pt-32 pb-16 sm:pb-20 scroll-mt-20"
    >
      <ScrollReveal className="space-y-4 sm:space-y-6 text-center max-w-4xl mx-auto flex flex-col items-center">
        <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest block">
          Lindow Labs for engineering leaders
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.05] mx-auto">
          Get your spark back.
        </h1>

        <p className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto max-w-2xl leading-relaxed pt-2">
          Your off-the-record thinking partner. Not a bot, not a framework, just
          a human who gets it. Say the hard stuff out loud and work through it
          together.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.1} className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <a
          href={CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 px-6 py-3 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title="Book a free session with Tyler Lindow"
        >
          <Calendar size={15} className="shrink-0" />
          <span>Book a free session</span>
        </a>

        <a
          href="#dig-into"
          className="inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-6 py-3 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          title="See what we can dig into"
        >
          <span>See what we can dig into</span>
          <ArrowDown size={15} className="shrink-0" />
        </a>
      </ScrollReveal>

      <ScrollReveal delay={0.18} className="pt-4 flex justify-center">
        <WebGLCoin
          type="tinker"
          href="https://tinker.beginner.work"
          title="Tinker by Beginner Work"
          className="w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40"
        />
      </ScrollReveal>
    </header>
  );
}
