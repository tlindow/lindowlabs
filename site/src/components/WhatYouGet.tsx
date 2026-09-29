"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import WebGLCoin from "@/components/WebGLCoin";

interface ScreenshotItem {
  src: string;
  alt: string;
  domain: string;
  href: string;
}

interface StoryItem {
  pretitle: string;
  title: string;
  description: string;
  screenshots: ScreenshotItem[];
  link: {
    href: string;
    label: string;
    title: string;
  };
}

interface ValuePillar {
  id: string;
  pretitle?: string;
  title: string;
  ctaSubtext?: string;
  coinType: "tinker" | "github";
  link: {
    href: string;
    label: string;
    title: string;
  };
  stories: StoryItem[];
}

const valuePillars: ValuePillar[] = [
  {
    id: "culture-builder",
    pretitle: "10x your TAM",
    title: "Capture your developer market",
    ctaSubtext: "By addressing developers' entrepreneurial needs",
    coinType: "tinker",
    link: {
      href: "https://www.beginner.work",
      label: "beginner.work",
      title: "Beginner Work (www.beginner.work)",
    },
    stories: [
      {
        pretitle: "My work product",
        title: "Securing a $500K GMV Win",
        description:
          "How I led my engineers through the affirm.com rebuild, and the additional $500K in GMV we generated in a 3-day pre-Black Friday sale.",
        screenshots: [
          {
            src: "/affirm-home.png",
            alt: "Affirm.com homepage website revamp",
            domain: "affirm.com",
            href: "https://www.affirm.com",
          },
          {
            src: "/beginner-work.png",
            alt: "Beginner.work tinker app and word as currency",
            domain: "beginner.work",
            href: "https://www.beginner.work",
          },
        ],
        link: {
          href: "/blog/securing-500k-gmv-win",
          label: "Read blog post",
          title: "Securing a $500K GMV Win",
        },
      },
      {
        pretitle: "My work product",
        title: "Building Product as System Architecture",
        description:
          "The merchant lifecycle work at Affirm: system architecture treated as the product, so the portal can keep earning trust as the surface grows.",
        screenshots: [],
        link: {
          href: "/blog/building-product-as-system-architecture",
          label: "Read blog post",
          title: "Building Product as System Architecture",
        },
      },
    ],
  },
  {
    id: "methodical-enjoyable",
    pretitle: "Recruit enterprise developers",
    title: "Retain enterprise customers",
    ctaSubtext: "By showcasing your code strategy in a portal",
    coinType: "github",
    link: {
      href: "https://github.com/tlindow",
      label: "github.com/tlindow",
      title: "Tyler Lindow - GitHub (github.com/tlindow)",
    },
    stories: [
      {
        pretitle: "My work product",
        title: "Velocity Labs: 99.9% Availability in One Quarter",
        description:
          "Velocity Labs gave my team a practice for working through production incidents on our legacy platform and embracing AI-driven development.",
        screenshots: [
          {
            src: "/tinker-beginner-work.png",
            alt: "Tinker by Beginner.work sign in app",
            domain: "tinker.beginner.work",
            href: "https://tinker.beginner.work",
          },
        ],
        link: {
          href: "/blog/velocity-labs",
          label: "Read blog post",
          title: "Velocity Labs: 99.9% Availability in One Quarter",
        },
      },
      {
        pretitle: "My work product",
        title: "Building Teams as Raising Funds",
        description:
          "Building the Affirm team the way you raise a round: intentional career growth, promotions, and a shared belief that the group knows how to grow the business.",
        screenshots: [
          {
            src: "/beginner-card.png",
            alt: "Beginner Cards and Raise app",
            domain: "beginner.work",
            href: "https://www.beginner.work",
          },
        ],
        link: {
          href: "/blog/building-teams-as-raising-funds",
          label: "Read blog post",
          title: "Building Teams as Raising Funds",
        },
      },
    ],
  },
];

function PillarStoryCarousel({
  stories,
  basePath,
}: {
  stories: StoryItem[];
  basePath: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const hasMultiple = stories.length > 1;

  const scrollToStory = (idx: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = Array.from(container.children) as HTMLElement[];
    if (cards[idx]) {
      const targetLeft = cards[idx].offsetLeft - container.offsetLeft;
      container.scrollTo({
        left: targetLeft,
        behavior: "smooth",
      });
      setActiveIdx(idx);
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    if (!children.length) return;

    let closestIdx = 0;
    let minDistance = Infinity;
    children.forEach((child, idx) => {
      const distance = Math.abs(child.offsetLeft - container.offsetLeft - scrollLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIdx) {
      setActiveIdx(closestIdx);
    }
  };

  const prev = () => {
    const nextIdx = Math.max(0, activeIdx - 1);
    scrollToStory(nextIdx);
  };

  const next = () => {
    const nextIdx = Math.min(stories.length - 1, activeIdx + 1);
    scrollToStory(nextIdx);
  };

  return (
    <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4 lg:pl-6 lg:border-l lg:border-border/60 w-full min-w-0 overflow-hidden">
      {/* Top Header: Pretitle and Prev/Next Chevrons (No Tabs) */}
      {hasMultiple && (
        <div className="w-full flex items-center justify-between pb-1 text-xs font-mono text-muted">
          <span className="font-bold text-indigo-dark uppercase tracking-wider text-[11px] sm:text-xs">
            {stories[activeIdx].pretitle}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-muted select-none">
              {String(activeIdx + 1).padStart(2, "0")}/{String(stories.length).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={prev}
                disabled={activeIdx === 0}
                className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-alt text-foreground transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                aria-label="Previous story"
                title="Previous story"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={next}
                disabled={activeIdx === stories.length - 1}
                className="p-1.5 rounded-lg border border-border bg-surface hover:bg-surface-alt text-foreground transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                aria-label="Next story"
                title="Next story"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Snap Track with Cut-off Preview of Next Story (Fully touch & swipe enabled on mobile) */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="w-full flex gap-3.5 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth touch-pan-x overscroll-x-contain [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-0.5"
      >
        {stories.map((story, idx) => {
          const isActive = idx === activeIdx;

          return (
            <div
              key={story.title}
              onClick={() => {
                if (!isActive) scrollToStory(idx);
              }}
              className={`snap-start shrink-0 transition-opacity duration-300 flex flex-col ${
                story.screenshots.length > 0
                  ? "justify-between space-y-4 sm:space-y-5"
                  : "justify-start space-y-3 sm:space-y-3.5"
              } select-none ${
                hasMultiple ? "w-[85%] sm:w-[88%]" : "w-full"
              } ${
                isActive
                  ? "opacity-100"
                  : "opacity-40 hover:opacity-75 cursor-pointer"
              }`}
            >
              {/* Story Header */}
              <div className="space-y-2">
                {!hasMultiple && (
                  <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
                    {story.pretitle}
                  </span>
                )}
                <h4 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground line-clamp-2">
                  {story.title}
                </h4>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-mono pt-1">
                  {story.description}
                </p>
              </div>

              {/* Screenshots (grid-cols-2 maintains consistent size across 1 or 2 images) */}
              {story.screenshots.length > 0 && (
                <div className="w-full grid grid-cols-2 gap-2.5 sm:gap-4 pt-1">
                  {story.screenshots.map((shot) => (
                    <a
                      key={shot.src}
                      href={shot.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl border border-border bg-surface overflow-hidden shadow-xs hover:border-foreground/40 transition-all block"
                      title={`${shot.alt} (${shot.domain})`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`${basePath}${shot.src}`}
                        alt={shot.alt}
                        className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] pointer-events-none select-none"
                        loading="lazy"
                        draggable={false}
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* On-site blog post action button */}
              <div className={story.screenshots.length > 0 ? "pt-2" : "pt-0.5"}>
                <Link
                  href={story.link.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title={story.link.title}
                >
                  <FileText
                    size={15}
                    className="shrink-0 text-foreground"
                  />
                  <span>{story.link.label}</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WhatYouGet() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <section
      id="what-you-get"
      className="w-full border-t border-border/80 bg-surface-alt/70 pt-16 pb-20 sm:pt-20 sm:pb-28 scroll-mt-20 relative font-mono"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="space-y-16 sm:space-y-24">
          {valuePillars.map((pillar) => {
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pt-6 border-t border-border/60 first:border-t-0 first:pt-0"
              >
                {/* Left Side: Token & Value Prop (5 cols) */}
                <div className="lg:col-span-5 flex flex-col items-center text-center lg:items-start lg:text-left gap-6">
                  {/* Copy Block */}
                  <div className="flex flex-col gap-1.5 w-full items-center text-center lg:items-start lg:text-left">
                    {pillar.pretitle && (
                      <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
                        {pillar.pretitle}
                      </span>
                    )}
                    <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Rotating 3D WebGL Coin */}
                  <div className="w-full flex justify-center lg:justify-start items-center py-2">
                    <WebGLCoin
                      type={pillar.coinType}
                      href={pillar.link.href}
                      title={pillar.link.title}
                      className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48"
                    />
                  </div>

                  {/* Mechanism & Token Link */}
                  <div className="flex flex-col items-center text-center lg:items-start lg:text-left gap-3 w-full">
                    {pillar.ctaSubtext && (
                      <p className="text-xs sm:text-sm font-mono text-muted leading-snug text-center lg:text-left">
                        {pillar.ctaSubtext}
                      </p>
                    )}

                    <a
                      href={pillar.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-foreground text-background hover:bg-foreground/90 shadow-xs"
                      title={pillar.link.title}
                    >
                      <span>{pillar.link.label}</span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 text-background/80 group-hover:text-background"
                      />
                    </a>
                  </div>
                </div>

                {/* Right Side: Case Study / Story Carousel (7 cols) */}
                <PillarStoryCarousel
                  stories={pillar.stories}
                  basePath={basePath}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
