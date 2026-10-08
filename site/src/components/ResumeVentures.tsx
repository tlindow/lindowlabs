"use client";

import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { Mic, ExternalLink, Video } from "lucide-react";
import { BeginnerSeedMark, HapiCupMark } from "@/components/brand/BeginnerMarks";
import { TinkerMark } from "@/components/brand/TinkerLogo";
import { BEGINNER_HAPI_URL, BEGINNER_URL } from "@/data/urls";

export default function ResumeVentures() {
  return (
    <section id="ventures" className="py-12 sm:py-16 px-4 sm:px-6 bg-surface/50 border-b border-border/70 no-print">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="p-1.5 rounded-lg bg-sky-light text-sky-800">
              <Mic size={16} />
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-foreground font-normal tracking-tight">
              Keynote &amp; Featured Ventures
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted font-mono mb-6">
            Thought leadership, cognitive AI research, and live web products built by Tyler Lindow
          </p>
          <div className="h-0.5 w-12 bg-sky/50 rounded-full mb-8" />
        </ScrollReveal>

        {/* Keynote Featured Card */}
        <ScrollReveal delay={0.1}>
          <div className="rounded-3xl bg-surface border border-border p-6 sm:p-7 shadow-sm hover:border-violet/40 transition-all duration-200 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-violet-light text-violet">
                  <Video size={12} />
                  Featured Keynote
                </span>
                <span className="text-xs font-mono text-muted">
                  DEVx San Diego &middot; April 18, 2026
                </span>
              </div>

              <a
                href="https://www.youtube.com/watch?v=STI5pw5F5Lo&t=631s"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-indigo-dark hover:text-labs-primary-dark underline underline-offset-4"
              >
                <span>Watch on YouTube (10:31)</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground">
              Human Minds &amp; AI Models: Cognitive Architectures for Autonomous Agents
            </h3>
            <p className="mt-2 text-sm text-muted font-sans leading-relaxed">
              Explores how biological learning dynamics, associative memory, and error-prediction loops inform robust autonomous AI agent architectures and human-in-the-loop developer paved paths.
            </p>
          </div>
        </ScrollReveal>

        {/* Product Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4" staggerDelay={0.08}>
          <StaggerItem>
            <a
              href={BEGINNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-surface border border-border p-5 hover:border-indigo/40 hover:shadow-md transition-all duration-200 h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded-xl bg-indigo-light text-indigo-dark">
                  <BeginnerSeedMark className="w-5 h-5" />
                </div>
                <ExternalLink size={13} className="text-muted group-hover:text-indigo-dark transition-colors" />
              </div>
              <h4 className="font-serif text-base font-normal text-foreground group-hover:text-indigo-dark transition-colors">
                beginner
              </h4>
              <p className="text-xs text-muted font-sans mt-1 leading-snug">
                Founder and CEO of Beginner Work from March to July 2026. Self-funded and built Tinker, then wound the company down rather than fund a GTM that wasn&apos;t compounding.
              </p>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a
              href={BEGINNER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-surface border border-border p-5 hover:border-indigo/40 hover:shadow-md transition-all duration-200 h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded-xl bg-violet-light text-violet">
                  <TinkerMark className="w-5 h-5" alt="" />
                </div>
                <ExternalLink size={13} className="text-muted group-hover:text-indigo-dark transition-colors" />
              </div>
              <h4 className="font-serif text-base font-normal text-foreground group-hover:text-indigo-dark transition-colors inline-flex items-center gap-1.5">
                <TinkerMark className="w-4 h-4" alt="" />
                Tinker
              </h4>
              <p className="text-xs text-muted font-sans mt-1 leading-snug">
                IDE for founders who want to get more technical: essays capturing the founder&apos;s voice, a code editor, and an AI terminal generating diffs. Shipped and open-sourced; 28 early users and 6 paying.
              </p>
            </a>
          </StaggerItem>

          <StaggerItem>
            <a
              href={BEGINNER_HAPI_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-2xl bg-surface border border-border p-5 hover:border-indigo/40 hover:shadow-md transition-all duration-200 h-full"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded-xl bg-amber-light text-amber-800">
                  <HapiCupMark className="w-5 h-5" />
                </div>
                <ExternalLink size={13} className="text-muted group-hover:text-indigo-dark transition-colors" />
              </div>
              <h4 className="font-serif text-base font-normal text-foreground group-hover:text-indigo-dark transition-colors">
                hāpi
              </h4>
              <p className="text-xs text-muted font-sans mt-1 leading-snug">
                San Diego craft botanical hop elixir beverage brand &amp; tap-to-order PWA.
              </p>
            </a>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
