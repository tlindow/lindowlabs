"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import WebGLCoin, { type WebGLCoinType } from "@/components/WebGLCoin";
import { TinkerMark } from "@/components/brand/TinkerLogo";
import { BeginnerSeedMark } from "@/components/brand/BeginnerMarks";
import { AFFIRM_URL, BEGINNER_URL } from "@/data/urls";
import {
  getBlogPostByPillar,
  getPostHref,
} from "@/data/blogPosts";

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
  /** Playful chat-bubble aside near the CTA (Affirm pillar only today). */
  linkAside?: string;
  /** Visible post card inside this pillar (Affirm leadership story). */
  featuredPost?: WorkProduct;
}

const buildingTeamsPost = getBlogPostByPillar("methodical-enjoyable");

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
      href: AFFIRM_URL,
      label: "Affirm",
      title: "Affirm",
    },
    linkAside: "psst, my team led the latest affirm.com redesign",
    featuredPost: buildingTeamsPost
      ? {
          title: buildingTeamsPost.title,
          description: buildingTeamsPost.summary,
          href: getPostHref(buildingTeamsPost),
        }
      : undefined,
  },
];

/**
 * Affirm wordmark (arched lowercase a). Official mark paths; currentColor so
 * the dark Affirm CTA can use brand white without inventing new hues.
 */
function AffirmWordmark({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="15 12 95 36"
      className={className}
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M62.02 16.64a2.83 2.83 0 1 0 2.003.827 2.83 2.83 0 0 0-2.003-.827zm-2.43 7.514h4.827v19.203H59.6zm19.342-.494c-2.414 0-5.2 1.738-6.105 3.918v-3.423h-4.58V43.36h4.83v-8.92c0-3.774 1.45-5.88 4.605-5.94l2.694-4.73a10.33 10.33 0 0 0-1.444-.111zm19.4.013c-2.07 0-3.93.78-5.23 2.192l-.068.072-.066-.072c-1.288-1.413-3.135-2.192-5.208-2.192-4.44 0-7.66 3.237-7.66 7.695v12h4.75V31.265c0-1.872 1.143-3.08 2.9-3.08s2.912 1.2 2.912 3.08V43.36h4.764V31.265c0-1.872 1.143-3.08 2.912-3.08s2.912 1.2 2.912 3.08V43.36H106v-12c-.008-4.458-3.23-7.695-7.676-7.695zm-44.584-1.287c0-.634.085-1.392.628-1.8.594-.462 1.463-.377 2.166-.34l.937-3.496-.5-.026c-2.015-.108-4.135-.258-5.902.9-1.498 1-2.165 2.694-2.165 4.444v2.092h-5.757V22.4c0-.63.084-1.38.615-1.803.594-.472 1.474-.383 2.178-.348l.937-3.496-.5-.026c-2.03-.1-4.172-.258-5.94.943-1.468.995-2.118 2.685-2.118 4.413v2.092H36.15v3.478h2.178V43.36h4.83V27.645h5.74V43.36h4.83V27.645h3.343v-3.5h-3.33v-1.77zM33.698 43.36V26.4a2.79 2.79 0 0 0-2.466-2.736c-.922-.06-1.902.278-2.48 1.027l-14.76 18.67h3.638c1.45 0 2.604-.755 3.478-1.883l8.175-10.338v12.22H33.7z"
      />
    </svg>
  );
}

/** One shared "My work product" list (former per-pillar blog columns). */
const workProducts: WorkProduct[] = [
  {
    title: "Building Product as System Architecture",
    description:
      "The merchant lifecycle work at Affirm: system architecture treated as the product, so the portal can keep earning trust as the surface grows.",
    href: "/blog/building-product-as-system-architecture",
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
                  {pillar.ctaSubtext ? (
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
                  ) : null}

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3">
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
                        <AffirmWordmark className="h-4 w-auto shrink-0 text-background" />
                      ) : null}
                      <span>{pillar.link.label}</span>
                      <ArrowUpRight
                        size={14}
                        className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 text-background/80 group-hover:text-background"
                      />
                    </a>
                    {pillar.linkAside ? (
                      <aside
                        className="affirm-aside-bubble relative max-w-[15.5rem] rounded-[1.15rem] bg-surface px-3 py-2 text-[11px] sm:text-xs font-mono leading-snug text-muted text-left shadow-xs"
                        aria-label="Side note"
                      >
                        {pillar.linkAside}
                      </aside>
                    ) : null}
                  </div>

                  {pillar.featuredPost ? (
                    <div className="mt-2 w-full text-center sm:text-left">
                      <Link
                        href={pillar.featuredPost.href}
                        className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground hover:text-indigo-dark transition-colors underline-offset-4 hover:underline"
                        title={pillar.featuredPost.title}
                      >
                        {pillar.featuredPost.title}
                      </Link>
                      <p className="mt-2 text-xs sm:text-sm text-muted leading-relaxed font-mono">
                        {pillar.featuredPost.description}
                      </p>
                      <Link
                        href={pillar.featuredPost.href}
                        className="mt-3 inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        title={pillar.featuredPost.title}
                      >
                        <FileText
                          size={15}
                          className="shrink-0 text-foreground"
                        />
                        <span>Read blog post</span>
                      </Link>
                    </div>
                  ) : null}
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
