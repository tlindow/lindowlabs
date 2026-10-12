"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText } from "lucide-react";
import ScrollReveal from "@/components/animations/ScrollReveal";
import WebGLCoin from "@/components/WebGLCoin";
import { TinkerMark } from "@/components/brand/TinkerLogo";
import { BeginnerSeedMark } from "@/components/brand/BeginnerMarks";
import { BEGINNER_URL } from "@/data/urls";
import {
  ENGINEERING_LEADERS_ABOUT_BODY,
  ENGINEERING_LEADERS_ABOUT_HEADING,
  ENGINEERING_LEADERS_AFFIRM_SUBTEXT,
  ENGINEERING_LEADERS_AFFIRM_TITLE,
  ENGINEERING_LEADERS_BEGINNER_SUBTEXT,
  ENGINEERING_LEADERS_BEGINNER_TITLE,
  ENGINEERING_LEADERS_LEAD_SUBTEXT,
  ENGINEERING_LEADERS_LEAD_TITLE,
} from "@/data/engineeringLeadersPage";
import {
  getBlogPostBySlug,
  getPostHref,
  type BlogPost,
} from "@/data/blogPosts";

type WorkProduct = {
  title: string;
  description: string;
  href: string;
};

function toWorkProduct(post: BlogPost | undefined): WorkProduct | null {
  if (!post) return null;
  return {
    title: post.title,
    description: post.summary,
    href: getPostHref(post),
  };
}

const affirmFeaturedPosts: WorkProduct[] = [
  toWorkProduct(getBlogPostBySlug("building-teams-as-raising-funds")),
  toWorkProduct(getBlogPostBySlug("building-product-as-system-architecture")),
].filter((post): post is WorkProduct => post != null);

function FeaturedPostCard({ post }: { post: WorkProduct }) {
  return (
    <div className="w-full text-center sm:text-left">
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
    </div>
  );
}

/**
 * Below-hero sections for /engineering-leaders: About, Affirm + posts,
 * Beginner/Tinker, How I lead teams. Copy from engineeringLeadersPage data.
 */
export default function LeadersBody() {
  return (
    <>
      <section
        id="about"
        className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border/70"
        data-leaders="about"
      >
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
              About
            </span>
            <h2 className="mt-3 font-mono text-xl sm:text-2xl md:text-3xl tracking-tight text-foreground font-bold leading-snug">
              {ENGINEERING_LEADERS_ABOUT_HEADING}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <p className="mt-8 sm:mt-10 text-[15px] sm:text-lg leading-relaxed text-muted font-mono">
              {ENGINEERING_LEADERS_ABOUT_BODY}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section
        id="what-you-get"
        className="w-full border-t border-border/80 bg-surface-alt/70 pt-16 pb-20 sm:pt-20 sm:pb-28 scroll-mt-20 relative font-mono"
        data-leaders="pillars"
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="space-y-16 sm:space-y-24">
            {/* Affirm */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col items-center text-center gap-6 pt-6 border-t border-border/60 first:border-t-0 first:pt-0 max-w-2xl mx-auto"
              data-leaders="affirm"
            >
              <div className="flex flex-col gap-1.5 w-full items-center">
                <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                  {ENGINEERING_LEADERS_AFFIRM_TITLE}
                </h3>
              </div>
              <div className="w-full flex justify-center items-center py-2">
                <WebGLCoin
                  type="affirm"
                  className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48"
                />
              </div>
              <p className="text-xs sm:text-sm font-mono text-muted leading-snug text-center">
                {ENGINEERING_LEADERS_AFFIRM_SUBTEXT}
              </p>
            </motion.div>

            {/* Beginner / Tinker */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col items-center text-center gap-6 pt-6 border-t border-border/60 max-w-2xl mx-auto"
              data-leaders="beginner"
            >
              <div className="flex flex-col gap-1.5 w-full items-center">
                <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                  {ENGINEERING_LEADERS_BEGINNER_TITLE}
                </h3>
              </div>
              <div className="w-full flex justify-center items-center py-2">
                <WebGLCoin
                  type="beginner"
                  href={BEGINNER_URL}
                  title="Beginner"
                  className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48"
                />
              </div>
              <div className="flex flex-col items-center text-center gap-3 w-full">
                <p className="text-base sm:text-lg font-mono text-muted leading-relaxed text-center">
                  Built{" "}
                  <span className="inline-flex items-center gap-1 font-bold text-foreground/85 align-baseline">
                    <TinkerMark className="h-4 w-4 sm:h-5 sm:w-5" alt="" />
                    Tinker
                  </span>
                  , an IDE for folks who want to get more technical. 28 early
                  users from 87 founder conversations. Wound it down in July
                  2026 and open-sourced it.
                </p>
                <a
                  href={BEGINNER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-foreground text-background hover:bg-foreground/90 shadow-xs"
                  title="Beginner"
                >
                  <BeginnerSeedMark className="h-4 w-4 shrink-0" />
                  <span>Beginner</span>
                  <ArrowUpRight
                    size={14}
                    className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 text-background/80 group-hover:text-background"
                  />
                </a>
              </div>
            </motion.div>

            {/* How I lead teams + Affirm posts */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-col items-center text-center gap-6 pt-6 border-t border-border/60 max-w-2xl mx-auto"
              data-leaders="how-i-lead"
            >
              <div className="flex flex-col gap-1.5 w-full items-center">
                <h3 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
                  {ENGINEERING_LEADERS_LEAD_TITLE}
                </h3>
              </div>
              <p className="text-xs sm:text-sm font-mono text-muted leading-snug text-center">
                {ENGINEERING_LEADERS_LEAD_SUBTEXT}
              </p>
              {affirmFeaturedPosts.length > 0 ? (
                <div className="mt-2 w-full space-y-8">
                  {affirmFeaturedPosts.map((post) => (
                    <FeaturedPostCard key={post.href} post={post} />
                  ))}
                </div>
              ) : null}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
