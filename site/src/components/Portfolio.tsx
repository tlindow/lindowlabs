"use client";

import { ExternalLink, Sparkles, Layers } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";
import { BeginnerSeedMark, HapiCupMark } from "@/components/brand/BeginnerMarks";
import { TinkerMark } from "@/components/brand/TinkerLogo";
import { BEGINNER_HAPI_URL, BEGINNER_URL } from "@/data/urls";

const ventures = [
  {
    title: "beginner",
    tagline: "Self-funded and built Tinker",
    description:
      "Founder and CEO of Beginner Work from March to July 2026. Self-funded and built Tinker, an IDE for technical founders, shipped and open-sourced as offline-first desktop and web apps; 28 early users and 6 paying. Led 92 founder and investor conversations (including 5 VCs) across SF, NYC, and LA, then wound the company down rather than fund a GTM that wasn't compounding.",
    tech: ["JavaScript", "Node.js", "Electron", "Postgres"],
    url: BEGINNER_URL,
    github: "https://github.com/beginner-work/tinker",
    icon: BeginnerSeedMark,
    accent: "group-hover:border-indigo/40 border-indigo/20",
    badge: "Wound down 2026",
    badgeColor: "bg-indigo-light text-indigo-dark",
    hover: "group-hover:text-indigo-dark",
    glow: "group-hover:shadow-indigo/10",
  },
  {
    title: "tinker",
    tagline: "An IDE for technical founders",
    description:
      "IDE for technical founders (essays capturing the founder's voice, a code editor, and an AI terminal generating diffs), shipped and open-sourced as offline-first desktop and web apps in JavaScript, Node.js, Electron, and Postgres. Source published at github.com/beginner-work/tinker.",
    tech: ["JavaScript", "Node.js", "Electron", "Postgres"],
    url: BEGINNER_URL,
    github: "https://github.com/beginner-work/tinker",
    icon: TinkerMark,
    accent: "group-hover:border-violet/40",
    badge: "IDE",
    badgeColor: "bg-violet-light text-violet",
    hover: "group-hover:text-violet",
    glow: "group-hover:shadow-violet/10",
  },
  {
    title: "hāpi",
    tagline: "A night cafe serving hop elixirs",
    description:
      "A San Diego craft beverage brand and mobile ordering PWA. Hop-based botanicals, community events, and frictionless tap-to-order experiences.",
    tech: ["TypeScript", "PWA", "Design System", "Mobile-First"],
    url: BEGINNER_HAPI_URL,
    github: "https://github.com/tlindow",
    icon: HapiCupMark,
    accent: "group-hover:border-leaf/40",
    badge: "Craft & Commerce",
    badgeColor: "bg-mint-light text-mint-dark",
    hover: "group-hover:text-leaf",
    glow: "group-hover:shadow-mint/10",
  },
  {
    title: "Dreaming with Marisól",
    tagline: "Spiritual guidance & herbal medicine",
    description:
      "Full digital experience and custom booking portal for a spiritual practitioner, herbalist, and community healer.",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    url: "https://github.com/tlindow/dreamingwithmarisol",
    github: "https://github.com/tlindow/dreamingwithmarisol",
    accent: "group-hover:border-rose/40",
    badge: "Client Experience",
    badgeColor: "bg-rose-light text-rose",
    hover: "group-hover:text-rose",
    glow: "group-hover:shadow-rose/10",
  },
];

const experiments = [
  {
    title: "p5.js Creative Coding",
    description:
      "Generative art sketches, spiraling circle algorithms, and visual math experiments in the browser.",
    tech: ["p5.js", "Canvas", "JavaScript"],
    url: "https://github.com/tlindow/p5jstest",
    accent: "group-hover:border-violet/40",
    hover: "group-hover:text-violet",
    glow: "group-hover:shadow-violet/10",
  },
  {
    title: "Greywater Projection",
    description:
      "Interactive data visualization and resource projection tool calculating sustainable water reuse.",
    tech: ["D3.js", "JavaScript", "SVG"],
    url: "https://github.com/tlindow/greywater_projection",
    accent: "group-hover:border-sky/40",
    hover: "group-hover:text-sky",
    glow: "group-hover:shadow-sky/10",
  },
  {
    title: "Booking Module Service",
    description:
      "Component-as-a-service handling date picker logic, pricing tiers, and calendar reservations.",
    tech: ["React", "JavaScript", "CSS"],
    url: "https://github.com/tlindow/booking-module",
    accent: "group-hover:border-peach/40",
    hover: "group-hover:text-peach",
    glow: "group-hover:shadow-peach/10",
  },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
              Ventures &amp; Work
            </h2>
          </div>
          <div className="mt-2 h-1 w-16 rounded-full bg-peach" />
          <p className="mt-3 sm:mt-4 text-muted text-[15px] sm:text-lg max-w-2xl">
            A look at companies, software products, and creative systems I&rsquo;ve
            built. More on{" "}
            <a
              href="https://github.com/tlindow?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet hover:underline font-medium"
            >
              GitHub
            </a>
            .
          </p>
        </ScrollReveal>

        {/* Featured Ventures Grid */}
        <div className="mt-10 sm:mt-12">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={16} className="text-amber" />
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted">
                Featured Products &amp; Ventures
              </h3>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid gap-6 sm:grid-cols-2" staggerDelay={0.1}>
            {ventures.map((v) => {
              const Icon = v.icon;
              return (
                <StaggerItem key={v.title}>
                  <a
                    href={v.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex flex-col justify-between rounded-3xl bg-surface border border-border p-6 sm:p-7 hover:shadow-xl ${v.accent} ${v.glow} transition-all duration-300 hover:-translate-y-1 h-full`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          {Icon ? (
                            <Icon className="w-10 h-10 rounded-xl flex-shrink-0 shadow-sm" />
                          ) : null}
                          <div>
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider mb-1 ${v.badgeColor}`}>
                              {v.badge}
                            </span>
                            <h4 className={`text-xl sm:text-2xl font-bold text-foreground ${v.hover} transition-colors`}>
                              {v.title}
                            </h4>
                          </div>
                        </div>
                        <ExternalLink
                          size={18}
                          className="mt-1 shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>

                      <p className="mt-3 text-sm font-medium text-foreground/80 italic">
                        &ldquo;{v.tagline}&rdquo;
                      </p>

                      <p className="mt-2 text-sm text-muted leading-relaxed">
                        {v.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/70 flex flex-wrap gap-1.5">
                      {v.tech.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-surface-alt px-2.5 py-0.5 text-xs font-medium text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Experiments & Open Source */}
        <div className="mt-14 sm:mt-18">
          <ScrollReveal>
            <div className="flex items-center gap-2 mb-6">
              <Layers size={16} className="text-sky" />
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-muted">
                Creative Code &amp; Open Source
              </h3>
            </div>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:gap-6 sm:grid-cols-3" staggerDelay={0.08}>
            {experiments.map((p) => (
              <StaggerItem key={p.title}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex flex-col justify-between rounded-2xl bg-surface border border-border p-5 sm:p-6 hover:shadow-md ${p.accent} ${p.glow} transition-all duration-300 hover:-translate-y-0.5 h-full`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className={`text-base sm:text-lg font-semibold text-foreground ${p.hover} transition-colors`}>
                        {p.title}
                      </h4>
                      <ExternalLink
                        size={14}
                        className="mt-0.5 shrink-0 text-muted opacity-0 group-hover:opacity-100 transition-all duration-300"
                      />
                    </div>
                    <p className="mt-1.5 text-xs sm:text-sm text-muted leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-surface-alt px-2 py-0.5 text-[11px] font-medium text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
