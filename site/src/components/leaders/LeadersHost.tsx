"use client";

import { motion } from "framer-motion";

export default function LeadersHost() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <section
      id="host"
      className="w-full border-t border-border/80 bg-surface-alt/70 pt-16 pb-16 sm:pt-20 sm:pb-24 scroll-mt-20 relative font-mono"
    >
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/profile-square.jpg`}
            alt="Tyler Lindow"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border border-border shadow-xs shrink-0"
            loading="lazy"
          />

          <div className="space-y-3">
            <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
              Who&apos;s hosting
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-foreground">
              Tyler Lindow
            </h2>
            <p className="text-sm sm:text-base font-mono text-muted leading-relaxed">
              I&apos;m Tyler Lindow, a fintech engineering leader, ex-Affirm and
              ex-founder. I build teams where people get to be themselves, and
              I&apos;m opening that space up to other leaders.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
