"use client";

import { useState } from "react";
import {
  Landmark,
  Sprout,
  Mic,
  Globe,
  Coffee,
  Compass,
  ArrowDown,
  ExternalLink,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface JourneyOption {
  id: string;
  targetId: string;
  year: string;
  title: string;
  tag: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  summary: string;
  highlights: string[];
  actions: {
    label: string;
    href: string;
    isExternal?: boolean;
    variant?: "primary" | "secondary" | "outline";
  }[];
}

const journeyOptions: JourneyOption[] = [
  {
    id: "field-museum",
    targetId: "origin",
    year: "2019",
    title: "Field Museum",
    tag: "Chicago · Origin",
    icon: Landmark,
    iconBg: "bg-sky-light text-sky",
    iconColor: "text-sky",
    summary:
      "While conducting research at the Field Museum in Chicago, Tyler saw an interactive terminal application running on a public kiosk — sparking an obsession with software that inspired his pivot into building for the web.",
    highlights: [
      "Evolutionary biology & museum scientific research",
      "Terminal application kiosk sparked initial coding obsession",
      "Completed immersive coding program & dove into full-stack web dev",
    ],
    actions: [
      { label: "Skip to Origin in Timeline", href: "#origin", variant: "primary" },
      { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/tlindow", isExternal: true, variant: "secondary" },
    ],
  },
  {
    id: "beginner",
    targetId: "beginner",
    year: "2026",
    title: "Beginner Work",
    tag: "Founder · Mar–Jul 2026",
    icon: Sprout,
    iconBg: "bg-sprout-light text-sprout",
    iconColor: "text-sprout",
    summary:
      "Beginner Work ran March to July 2026 as sole founder. Built Tinker, a writing tool that helped technical founders explain their work in their own voice; validated across successive prototypes through 92 in-person conversations (including 5 VCs) and 28 early users. Beginner's research phase ended in July 2026.",
    highlights: [
      "Sole founder, March to July 2026",
      "Built Tinker for technical founders",
      "92 in-person conversations (including 5 VCs) and 28 early users",
    ],
    actions: [
      { label: "Open Tinker", href: "https://tinker.beginner.work", isExternal: true, variant: "primary" },
      { label: "Book Mentoring", href: "https://calendly.com/tylerlindow/elevate", isExternal: true, variant: "secondary" },
    ],
  },
  {
    id: "devx",
    targetId: "speaking",
    year: "2026",
    title: "DEVx Keynote",
    tag: "San Diego · April 2026",
    icon: Mic,
    iconBg: "bg-violet-light text-violet",
    iconColor: "text-violet",
    summary:
      "Delivered the featured keynote talk 'Human Minds & AI Models' at DEVx Network San Diego on April 18, 2026, examining the structural parallels between biological cognition, learning feedback loops, and autonomous AI agents.",
    highlights: [
      "Featured keynote presentation at DEVx San Diego",
      "Cognitive science & learning models applied to AI agents",
      "Full recording & live presentation available to watch",
    ],
    actions: [
      { label: "Skip to Keynote in Timeline", href: "#speaking", variant: "primary" },
      { label: "Watch on YouTube", href: "https://www.youtube.com/watch?v=STI5pw5F5Lo&t=631s", isExternal: true, variant: "secondary" },
    ],
  },
  {
    id: "tinker",
    targetId: "tinker",
    year: "2026",
    title: "Tinker",
    tag: "Writing tool · Beginner Work",
    icon: Globe,
    iconBg: "bg-rose-light text-rose",
    iconColor: "text-rose",
    summary:
      "Built Tinker as sole founder, a writing tool that helped technical founders explain their work in their own voice. Validated across successive prototypes through 92 in-person conversations (including 5 VCs) and 28 early users. Beginner's research phase ended in July 2026.",
    highlights: [
      "Writing tool for technical founders",
      "92 in-person conversations (including 5 VCs) and 28 early users",
      "Source at github.com/beginner-work/tinker",
    ],
    actions: [
      { label: "Open Tinker", href: "https://tinker.beginner.work", isExternal: true, variant: "primary" },
      { label: "View source", href: "https://github.com/beginner-work/tinker", isExternal: true, variant: "secondary" },
    ],
  },
  {
    id: "hapi",
    targetId: "hapi",
    year: "2024+",
    title: "hāpi",
    tag: "San Diego · Hop Elixir",
    icon: Coffee,
    iconBg: "bg-amber-light text-amber-700",
    iconColor: "text-amber-700",
    summary:
      "Founded hāpi, a San Diego craft beverage brand and mobile ordering PWA serving cold-pressed hop-based botanical wellness elixirs designed for relaxation and focus without alcohol.",
    highlights: [
      "San Diego local craft botanical elixir brand",
      "Custom mobile ordering PWA with real-time checkout",
      "Rooted in community wellness & local pop-ups",
    ],
    actions: [
      { label: "Skip to hāpi in Timeline", href: "#hapi", variant: "primary" },
      { label: "Explore Brand Details", href: "https://www.beginner.work/hapi", isExternal: true, variant: "secondary" },
    ],
  },
  {
    id: "mentoring",
    targetId: "mentoring",
    year: "2021+",
    title: "1:1 Mentoring",
    tag: "Coaching & Pairing",
    icon: Compass,
    iconBg: "bg-violet-light text-violet",
    iconColor: "text-violet",
    summary:
      "Mentors aspiring developers, bootcamp graduates, and engineers navigating career pivots through 1:1 pair programming, code architecture reviews, portfolio polish, and strategic career guidance.",
    highlights: [
      "Live pair programming & code architecture reviews",
      "Career pivot coaching for self-taught & bootcamp grads",
      "Open office hours & portfolio presentation critique",
    ],
    actions: [
      { label: "Skip to Mentoring in Timeline", href: "#mentoring", variant: "primary" },
      { label: "Book on Calendly", href: "https://calendly.com/tylerlindow/elevate", isExternal: true, variant: "secondary" },
    ],
  },
];

export default function WhereHaveIBeen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const activeOption = journeyOptions.find((opt) => opt.id === selectedId) || null;

  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${targetId}`);
      window.dispatchEvent(new Event("hashchange"));
    }
  };

  const handleSelect = (option: JourneyOption) => {
    setSelectedId(option.id);
    scrollToTarget(option.targetId);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto text-left z-20">
      {/* Header Container */}
      <div className="text-center mb-5 sm:mb-6">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground font-normal tracking-tight">
          Where have I been?
        </h2>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-sans text-muted">
          Select any milestone below to skip directly to that chapter in the timeline.
        </p>
      </div>

      {/* Grid of Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
        {journeyOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selectedId === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`group relative flex flex-col items-start p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? "bg-surface border-2 border-violet shadow-lg shadow-violet/10 scale-[1.02]"
                  : "bg-surface/90 hover:bg-surface border border-border hover:border-violet/40 backdrop-blur-md hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2.5">
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-xl ${opt.iconBg} transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-medium text-muted bg-sand px-1.5 py-0.5 rounded-md border border-border/80">
                    {opt.year}
                  </span>
                  <ArrowDown
                    size={12}
                    className="text-violet opacity-0 group-hover:opacity-100 group-hover:translate-y-0.5 transition-all"
                  />
                </div>
              </div>

              <span className="font-serif text-sm sm:text-base text-foreground group-hover:text-violet transition-colors flex items-center gap-1">
                {opt.title}
              </span>
              <span className="font-sans text-[11px] text-muted line-clamp-1 mt-0.5">
                {opt.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Expanded Story Drawer & Quick Skip Actions */}
      <AnimatePresence>
        {activeOption && (
          <motion.div
            key={activeOption.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="mt-4 rounded-3xl bg-surface/95 backdrop-blur-xl border border-border shadow-2xl p-5 sm:p-6 text-foreground relative overflow-hidden"
          >
            {/* Ambient background highlight */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-violet/20 via-rose/10 to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${activeOption.iconBg}`}>
                  <activeOption.icon size={16} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-serif text-foreground flex items-center gap-2">
                    {activeOption.title}
                    <span className="text-xs font-sans font-normal text-muted">
                      &bull; {activeOption.tag}
                    </span>
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close details"
                className="p-1.5 rounded-full text-muted hover:text-foreground hover:bg-surface-alt transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Story Paragraph */}
            <div className="mt-4">
              <p className="text-sm sm:text-base leading-relaxed text-foreground/90 font-sans font-normal">
                {activeOption.summary}
              </p>

              {/* Highlights List */}
              <div className="mt-3.5 space-y-2 bg-surface-alt rounded-2xl p-3.5 sm:p-4 border border-border text-xs sm:text-sm text-muted font-sans">
                {activeOption.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-violet font-bold text-xs mt-0.5">
                      &rarr;
                    </span>
                    <span className="text-foreground/90">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-3 border-t border-border font-mono text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => scrollToTarget(activeOption.targetId)}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium bg-foreground text-background hover:bg-foreground/85 shadow-sm transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Jump to Timeline Section</span>
                <ArrowDown size={13} />
              </button>

              {activeOption.actions
                .filter((a) => a.isExternal)
                .map((act) => (
                  <a
                    key={act.label}
                    href={act.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-medium border border-border bg-surface hover:bg-surface-alt text-foreground transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <span>{act.label}</span>
                    <ExternalLink size={13} />
                  </a>
                ))}
            </div>

            {/* Quick-switch other options */}
            <div className="mt-4 pt-3 border-t border-border flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono font-medium text-muted mr-1 flex items-center gap-1">
                <Sparkles size={12} className="text-violet" />
                Other chapters:
              </span>
              {journeyOptions
                .filter((o) => o.id !== activeOption.id)
                .map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => handleSelect(o)}
                    className="rounded-full bg-surface-alt hover:bg-violet-light border border-border px-2.5 py-1 text-[11px] font-mono text-muted hover:text-foreground transition-all duration-200 cursor-pointer"
                  >
                    {o.title}
                  </button>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
