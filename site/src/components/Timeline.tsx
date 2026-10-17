"use client";

import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  ArrowRight,
  Sparkles,
  Video,
  CheckCircle2,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import CountUp from "@/components/animations/CountUp";
import {
  timelineMilestones,
  mentoringOfferings,
  creativeExperiments,
  techStackList,
  speakingTopicsList,
  contentFormatsList,
} from "@/data/timelineData";

export default function Timeline() {
  const [activeHash, setActiveHash] = useState<string>("");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        setActiveHash(hash);
        // Clear highlight after 3 seconds
        setTimeout(() => setActiveHash(""), 3000);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <section id="timeline" className="relative py-16 sm:py-24 px-4 sm:px-6 overflow-hidden">
      <div className="mx-auto max-w-5xl">
        {/* Section Intro */}
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-light px-3.5 py-1 text-xs font-mono font-medium text-violet uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              Chronological Journey
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-foreground">
              Timeline of Milestones
            </h2>
            <p className="mt-3 sm:mt-4 text-[15px] sm:text-lg text-muted font-sans leading-relaxed">
              From evolutionary biology research in Chicago to building for founders,
              crafting botanical elixirs, delivering keynote talks on AI cognition, and mentoring
              engineers in San Diego.
            </p>
          </div>
        </ScrollReveal>

        {/* Vertical Timeline Spine & Container */}
        <div className="relative">
          {/* Continuous vertical Tinker pastel rainbow spine line */}
          <div className="absolute top-0 bottom-8 left-4 sm:left-8 md:left-1/2 w-0.5 -translate-x-1/2 bg-gradient-to-b from-violet via-sky via-mint via-sprout via-amber via-peach to-rose opacity-60 rounded-full" />

          <div className="space-y-16 sm:space-y-24">
            {timelineMilestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              const isHighlighted = activeHash === milestone.id;
              const Icon = milestone.icon;

              return (
                <div
                  key={milestone.id}
                  id={milestone.id}
                  className="scroll-mt-24 sm:scroll-mt-28 relative group"
                >
                  {/* Timeline Center Node Badge */}
                  <div className="absolute left-4 sm:left-8 md:left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl ${milestone.accentBg} ${milestone.accentColor} border-2 border-surface shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md`}
                    >
                      <Icon size={20} className="sm:w-5 sm:h-5" />
                    </div>
                  </div>

                  {/* Main Event Card Wrapper */}
                  <div
                    className={`relative pl-12 sm:pl-20 md:pl-0 ${
                      isEven
                        ? "md:pr-12 md:mr-auto md:w-1/2 md:text-right"
                        : "md:pl-12 md:ml-auto md:w-1/2 md:text-left"
                    }`}
                  >
                    <ScrollReveal
                      direction={isEven ? "left" : "right"}
                      delay={0.1}
                    >
                      <div
                        className={`rounded-3xl bg-surface border p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-lg relative overflow-hidden ${
                          isHighlighted
                            ? "border-violet ring-4 ring-violet/20 shadow-xl scale-[1.01]"
                            : "border-border hover:border-violet/40"
                        }`}
                      >
                        {/* Ambient Card Background Glow */}
                        <div className="absolute -top-12 -right-12 w-36 h-36 bg-gradient-to-br from-violet/15 via-rose/10 to-transparent rounded-full blur-2xl pointer-events-none" />

                        {/* Top Tag & Date Bar */}
                        <div
                          className={`flex flex-wrap items-center gap-2 mb-3 ${
                            isEven ? "md:justify-end" : "md:justify-start"
                          }`}
                        >
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-mono font-medium uppercase tracking-wider ${milestone.accentBg} ${milestone.accentColor}`}
                          >
                            <Calendar size={12} />
                            {milestone.date}
                          </span>
                          <span className="text-xs font-mono font-medium text-muted">
                            &bull; {milestone.tag}
                          </span>
                        </div>

                        {/* Card Title & Subtitle */}
                        <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground tracking-tight">
                          {milestone.title}
                        </h3>
                        <p className="mt-1 text-xs sm:text-sm font-sans font-medium text-muted italic">
                          {milestone.kicker}
                        </p>

                        {/* Summary Narrative */}
                        <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-muted font-sans font-normal">
                          {milestone.summary}
                        </p>

                        {/* Key Highlights List */}
                        <div className="mt-4 space-y-2 bg-surface-alt rounded-2xl p-4 border border-border text-xs sm:text-sm text-muted text-left font-sans">
                          {milestone.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2
                                size={15}
                                className={`shrink-0 mt-0.5 ${milestone.accentColor}`}
                              />
                              <span className="text-foreground/90">{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Embedded Milestone Modules */}
                        {milestone.id === "origin" && (
                          <div className="mt-6 pt-5 border-t border-border text-left">
                            <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
                              <Stat label="Origins" value="Chicago" color="bg-sky-light" />
                              <Stat label="Current Base" value="San Diego" color="bg-rose-light" />
                              <Stat label="Core Drive" value="Web & AI" color="bg-mint-light" />
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                              <Layers size={15} className="text-sky" />
                              <h4 className="text-xs font-mono uppercase tracking-wider text-muted">
                                Early Experiments & Creative Code
                              </h4>
                            </div>

                            <div className="grid gap-2.5 sm:grid-cols-3">
                              {creativeExperiments.map((exp) => (
                                <a
                                  key={exp.title}
                                  href={exp.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group/exp block rounded-xl bg-surface-alt p-3 border border-border hover:border-violet/40 transition-all duration-200 hover:-translate-y-0.5 text-left"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-serif font-medium text-foreground group-hover/exp:text-violet transition-colors">
                                      {exp.title}
                                    </span>
                                    <ExternalLink size={11} className="text-muted" />
                                  </div>
                                  <p className="text-[11px] text-muted line-clamp-2 mt-1 font-sans">
                                    {exp.description}
                                  </p>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {milestone.id === "mentoring" && (
                          <div className="mt-6 pt-5 border-t border-border text-left">
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles size={15} className="text-violet" />
                              <h4 className="text-xs font-mono uppercase tracking-wider text-muted">
                                Mentoring Focus Areas
                              </h4>
                            </div>
                            <div className="grid gap-2.5 sm:grid-cols-2">
                              {mentoringOfferings.map((o) => {
                                const ItemIcon = o.icon;
                                return (
                                  <div
                                    key={o.title}
                                    className="flex items-start gap-2.5 rounded-xl bg-surface-alt p-3 border border-border"
                                  >
                                    <div
                                      className={`p-1.5 rounded-lg ${o.color} ${o.iconColor} shrink-0 mt-0.5`}
                                    >
                                      <ItemIcon size={14} />
                                    </div>
                                    <div>
                                      <h5 className="text-xs font-serif text-foreground font-normal">
                                        {o.title}
                                      </h5>
                                      <p className="text-[11px] text-muted leading-relaxed mt-0.5 font-sans">
                                        {o.description}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {milestone.id === "beginner" && (
                          <div className="mt-6 pt-5 border-t border-border text-left">
                            <div className="rounded-2xl bg-sprout-light/40 border border-sprout/20 p-4 sm:p-5">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-sprout bg-surface px-2 py-0.5 rounded-md mb-1 border border-border">
                                    Featured Platform
                                  </span>
                                  <h4 className="text-lg font-serif font-normal text-foreground">
                                    beginner — App Store & Marketplace
                                  </h4>
                                  <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed font-sans">
                                    An installable PWA App Store enabling independent builders,
                                    healers, and creative founders to distribute applications with
                                    community financial backing.
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[11px]">
                                {["Next.js", "TypeScript", "PWA", "Stripe Connect", "PostgreSQL"].map(
                                  (t) => (
                                    <span
                                      key={t}
                                      className="rounded-full bg-surface px-2.5 py-0.5 text-muted border border-border"
                                    >
                                      {t}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {milestone.id === "hapi" && (
                          <div className="mt-6 pt-5 border-t border-border text-left">
                            <div className="rounded-2xl bg-amber-light/30 border border-amber/30 p-4 sm:p-5">
                              <div className="flex items-center gap-2 mb-1">
                                <MapPin size={14} className="text-amber-700" />
                                <span className="text-xs font-mono text-muted">
                                  Stockton &amp; Golden Hill, San Diego (92102)
                                </span>
                              </div>
                              <h4 className="text-base sm:text-lg font-serif font-normal text-foreground">
                                A Night Cafe Serving Hop Elixirs
                              </h4>
                              <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed font-sans">
                                Cold-pressed hop-based botanicals crafted for evening relaxation,
                                paired with an intuitive tap-to-order mobile web experience.
                              </p>
                            </div>
                          </div>
                        )}

                        {milestone.id === "speaking" && (
                          <div className="mt-6 pt-5 border-t border-border text-left">
                            <div className="rounded-2xl bg-surface-alt border border-border p-4 sm:p-5 overflow-hidden">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-light text-violet px-2.5 py-0.5 text-xs font-mono">
                                  <Video size={12} />
                                  Full Keynote Recording
                                </span>
                                <span className="text-xs font-mono text-muted">
                                  DEVx San Diego &middot; Keynote starts at 10:31
                                </span>
                              </div>

                              {/* Embedded 16:9 Video */}
                              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-md border border-border">
                                <iframe
                                  src="https://www.youtube-nocookie.com/embed/STI5pw5F5Lo?start=631&rel=0&playsinline=1"
                                  title="Human Minds & AI Models — Tyler Lindow at DEVx San Diego, April 2026"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                  referrerPolicy="strict-origin-when-cross-origin"
                                  allowFullScreen
                                  className="absolute inset-0 w-full h-full border-0"
                                />
                              </div>

                              {/* Talk Topics Grid */}
                              <div className="mt-5">
                                <h5 className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
                                  Keynote &amp; Workshop Topics
                                </h5>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {speakingTopicsList.map((t) => (
                                    <div
                                      key={t.title}
                                      className={`rounded-xl ${t.bg} p-3 text-left border border-border/40`}
                                    >
                                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted block mb-0.5">
                                        {t.tag}
                                      </span>
                                      <p className="text-xs font-serif text-foreground">
                                        {t.title}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {milestone.id === "stack" && (
                          <div className="mt-6 pt-5 border-t border-border text-left">
                            <h5 className="text-xs font-mono uppercase tracking-wider text-muted mb-3">
                              Active Production Stack
                            </h5>
                            <div className="flex flex-wrap gap-2 mb-5 font-mono text-xs">
                              {techStackList.map((t) => (
                                <span
                                  key={t.name}
                                  className={`inline-flex items-center gap-1.5 rounded-full ${t.bg} px-3 py-1 text-foreground transition-all duration-200 hover:scale-105 border border-border`}
                                >
                                  <span className={`w-2 h-2 rounded-full ${t.dot}`} />
                                  {t.name}
                                </span>
                              ))}
                            </div>

                            <h5 className="text-xs font-mono uppercase tracking-wider text-muted mb-2">
                              Content Formats &amp; Sharing
                            </h5>
                            <div className="grid gap-2 sm:grid-cols-3">
                              {contentFormatsList.map((c) => {
                                const FormatIcon = c.icon;
                                return (
                                  <div
                                    key={c.title}
                                    className="rounded-xl bg-surface-alt p-3 border border-border text-left"
                                  >
                                    <div
                                      className={`inline-flex p-1.5 rounded-lg ${c.iconBg} ${c.iconColor} mb-1.5`}
                                    >
                                      <FormatIcon size={14} />
                                    </div>
                                    <p className="text-xs font-serif font-normal text-foreground">
                                      {c.title}
                                    </p>
                                    <p className="text-[11px] text-muted mt-0.5 leading-snug font-sans">
                                      {c.description}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div
                          className={`mt-6 pt-4 border-t border-border flex flex-wrap items-center gap-2.5 font-mono text-xs sm:text-sm ${
                            isEven ? "md:justify-end" : "md:justify-start"
                          }`}
                        >
                          {milestone.actions.map((act) => {
                            const isPrimary = act.variant === "primary";
                            let btnClass =
                              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ";

                            if (isPrimary) {
                              btnClass +=
                                "bg-foreground text-background hover:bg-foreground/85 shadow-sm";
                            } else {
                              btnClass +=
                                "border border-border bg-surface hover:bg-surface-alt text-foreground";
                            }

                            if (act.isExternal) {
                              return (
                                <a
                                  key={act.label}
                                  href={act.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={btnClass}
                                >
                                  <span>{act.label}</span>
                                  <ExternalLink size={13} />
                                </a>
                              );
                            }

                            return (
                              <a key={act.label} href={act.href} className={btnClass}>
                                <span>{act.label}</span>
                                <ArrowRight size={13} />
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </ScrollReveal>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`text-center rounded-xl ${color} py-3 px-2 border border-border/80`}>
      <CountUp
        value={value}
        className="text-base sm:text-lg font-serif font-normal text-foreground block"
      />
      <p className="text-[10px] sm:text-[11px] font-mono text-muted">{label}</p>
    </div>
  );
}
