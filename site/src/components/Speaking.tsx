"use client";

import { Mic, ArrowRight, Play, Video } from "lucide-react";
import ScrollReveal, { StaggerContainer, StaggerItem } from "@/components/animations/ScrollReveal";

const topics = [
  {
    title: "Human Minds & AI Models",
    description:
      "The structural parallels between human cognition and machine learning — and why understanding human learning dynamics unlocks better AI agent design.",
    bg: "bg-violet-light",
    tag: "AI & Cognition",
  },
  {
    title: "Building in Public & Founder Journeys",
    description: (
      <>
        Lessons from starting <em className="italic">beginner</em>, bootstrapping in San Diego, and turning real-world community needs into software.
      </>
    ),
    bg: "bg-rose-light",
    tag: "Startups & Product",
  },
  {
    title: "Agentic Developer Tooling & Workflows",
    description:
      "How autonomous coding agents, mobile-first iteration, and modern AI workflows fundamentally transform engineering velocity.",
    bg: "bg-sky-light",
    tag: "Engineering",
  },
  {
    title: "Creative Coding & Expressive Web",
    description:
      "Using code as an expressive medium — shaders, physics animations, generative art, and tactile user interfaces.",
    bg: "bg-amber-light",
    tag: "Design & Motion",
  },
];

export default function Speaking() {
  return (
    <section id="speaking" className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-alt">
      <div className="mx-auto max-w-5xl">
        <ScrollReveal>
          <div className="flex items-center gap-3">
            <Mic size={24} className="text-rose sm:w-7 sm:h-7" />
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-foreground">
              Speaking & Talks
            </h2>
          </div>
          <div className="mt-2 ml-9 sm:ml-10 h-1 w-16 rounded-full bg-rose" />

          <p className="mt-5 sm:mt-6 text-muted text-[15px] sm:text-lg max-w-2xl">
            I speak on AI, human learning systems, developer leverage, and the
            craft of building software for real-world communities.
          </p>
        </ScrollReveal>

        {/* Featured Talk: Human Minds & AI Models */}
        <ScrollReveal delay={0.15}>
          <div className="mt-8 sm:mt-12 rounded-3xl bg-surface border border-border p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-light text-rose px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                <Video size={13} />
                Featured Keynote
              </span>
              <span className="text-xs sm:text-sm font-medium text-muted">
                DEVx Network &middot; San Diego &middot; April 18, 2026
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
              Human Minds &amp; AI Models
            </h3>
            <p className="mt-2 text-base sm:text-lg text-muted italic">
              What connects human learning and machine learning &mdash; and why it matters.
            </p>

            {/* Embedded 16:9 Video */}
            <div className="mt-6 relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-md border border-border">
              <iframe
                src="https://www.youtube-nocookie.com/embed/STI5pw5F5Lo?start=631&rel=0&playsinline=1"
                title="Human Minds & AI Models — Tyler Lindow at DEVx San Diego, April 2026"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-muted">
              <p>
                <strong>Starts at 10:31</strong> &middot; Keynote begins after the DEVx event introduction.
              </p>
              <a
                href="https://www.youtube.com/watch?v=STI5pw5F5Lo&t=631s"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-violet hover:underline"
              >
                <Play size={13} />
                Watch on YouTube &rarr;
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Talk Topics Grid */}
        <div className="mt-14 sm:mt-16">
          <ScrollReveal>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground mb-2">
              Topics &amp; Keynote Areas
            </h3>
            <p className="text-sm sm:text-base text-muted max-w-xl mb-6">
              Available for conferences, meetups, podcasts, and company tech talks.
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-4 sm:gap-6 sm:grid-cols-2" staggerDelay={0.08}>
            {topics.map((t) => (
              <StaggerItem key={t.title}>
                <div
                  className={`rounded-2xl ${t.bg} p-5 sm:p-6 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col justify-between h-full`}
                >
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-foreground/60 block mb-1">
                      {t.tag}
                    </span>
                    <h4 className="text-base sm:text-lg font-semibold text-foreground">
                      {t.title}
                    </h4>
                    <p className="mt-2 text-sm text-muted leading-relaxed">
                      {t.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        <ScrollReveal delay={0.25}>
          <div className="mt-10 sm:mt-12 rounded-2xl bg-surface border border-border p-6 text-center">
            <p className="text-base sm:text-lg font-medium text-foreground">
              Interested in having me speak at your event or team session?
            </p>
            <p className="mt-1 text-sm text-muted">
              I love engaging audiences with thoughtful, grounded technical storytelling.
            </p>
            <a
              href="mailto:tyler@lindowlabs.dev"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet hover:underline group"
            >
              Let&rsquo;s discuss speaking
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
