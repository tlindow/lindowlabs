"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import WebGLCoin, { type WebGLCoinType } from "@/components/WebGLCoin";
import { TinkerMark } from "@/components/brand/TinkerLogo";
import { BeginnerSeedMark } from "@/components/brand/BeginnerMarks";
import { AffirmLogo } from "@/components/brand/PartnerLogos";
import { BEGINNER_URL } from "@/data/urls";

interface WorkProduct {
  title: string;
  description: string;
  href: string;
}

interface ValuePillar {
  id: string;
  pretitle?: string;
  title: string;
  ctaSubtext?: string;
  coinType: WebGLCoinType;
  link: {
    href: string;
    label: string;
    title: string;
  };
}

const valuePillars: ValuePillar[] = [
  {
    id: "culture-builder",
    title: "Founder and CEO, Beginner Work.",
    ctaSubtext:
      "Founder and CEO of Beginner Work from March to July 2026. Self-funded and built Tinker, an IDE for founders who want to get more technical, shipped and open-sourced as offline-first desktop and web apps; 28 early users. Ran 87 conversations with founders, Tinker's early target users, and 5 with VCs across SF, NYC, and LA, then wound the company down rather than fund a GTM that wasn't compounding.",
    coinType: "beginner",
    link: {
      href: BEGINNER_URL,
      label: "Beginner",
      title: "Beginner",
    },
  },
  {
    id: "methodical-enjoyable",
    title: "How I lead teams.",
    ctaSubtext: "Practices for growing engineers.",
    coinType: "affirm",
    link: {
      href: "/resume",
      label: "Affirm",
      title: "Tyler Lindow at Affirm (resume)",
    },
  },
];

/** One shared "My work product" list (former per-pillar blog columns). */
const workProducts: WorkProduct[] = [
  {
    title: "Building Product as System Architecture",
    description:
      "The merchant lifecycle work at Affirm: system architecture treated as the product, so the portal can keep earning trust as the surface grows.",
    href: "/blog/building-product-as-system-architecture",
  },
  {
    title: "Building Teams as Raising Funds",
    description:
      "Building the Affirm team with intentional career growth, promotions, and a shared belief that the group knows how to grow the business.",
    href: "/blog/building-teams-as-raising-funds",
  },
];

export default function WhatYouGet() {
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
                className="flex flex-col items-center text-center gap-6 pt-6 border-t border-border/60 first:border-t-0 first:pt-0 max-w-2xl mx-auto"
              >
                <div className="flex flex-col gap-1.5 w-full items-center">
                  {pillar.pretitle && (
                    <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
                      {pillar.pretitle}
                    </span>
                  )}
                  <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                    {pillar.title}
                  </h3>
                </div>

                <div className="w-full flex justify-center items-center py-2">
                  <WebGLCoin
                    type={pillar.coinType}
                    href={pillar.link.href}
                    title={pillar.link.title}
                    className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48"
                  />
                </div>

                <div className="flex flex-col items-center text-center gap-3 w-full">
                  {pillar.ctaSubtext && (
                    <p className="text-xs sm:text-sm font-mono text-muted leading-snug text-center">
                      {pillar.id === "culture-builder" ? (
                        <>
                          Founder and CEO of Beginner Work from March to July
                          2026. Self-funded and built{" "}
                          <span className="inline-flex items-center gap-1 font-bold text-foreground/85 align-baseline">
                            <TinkerMark className="h-3.5 w-3.5" alt="" />
                            Tinker
                          </span>
                          , an IDE for founders who want to get more
                          technical, shipped and open-sourced as offline-first
                          desktop and web apps; 28 early users.
                          Ran 87 conversations with founders, Tinker&apos;s
                          early target users, and 5 with VCs across SF, NYC,
                          and LA, then wound the company down rather than fund
                          a GTM that wasn&apos;t compounding.
                        </>
                      ) : (
                        pillar.ctaSubtext
                      )}
                    </p>
                  )}

                  <a
                    href={pillar.link.href}
                    {...(pillar.link.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-foreground text-background hover:bg-foreground/90 shadow-xs"
                    title={pillar.link.title}
                  >
                    {pillar.coinType === "beginner" ? (
                      <BeginnerSeedMark className="h-4 w-4 shrink-0" />
                    ) : null}
                    {pillar.coinType === "affirm" ? (
                      <AffirmLogo className="h-4 w-auto brightness-0 invert" />
                    ) : null}
                    <span>{pillar.link.label}</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 text-background/80 group-hover:text-background"
                    />
                  </a>
                </div>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="pt-6 border-t border-border/60 max-w-2xl mx-auto"
          >
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block text-center">
              My work product
            </span>
            <ul className="mt-6 space-y-8">
              {workProducts.map((post) => (
                <li key={post.href} className="text-center sm:text-left">
                  <Link
                    href={post.href}
                    className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground hover:text-indigo-dark transition-colors underline-offset-4 hover:underline"
                    title={post.title}
                  >
                    {post.title}
                  </Link>
                  <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed font-mono">
                    {post.description}
                  </p>
                  <Link
                    href={post.href}
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    title={post.title}
                  >
                    <FileText size={15} className="shrink-0 text-foreground" />
                    <span>Read blog post</span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
