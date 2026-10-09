"use client";

import { Mail } from "lucide-react";
import PreferLinkedIn from "@/components/PreferLinkedIn";
import { resumeContact } from "@/data/resumeData";

const REACH_CTA_CLASS =
  "inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer";

export default function LeadersReach() {
  return (
    <section
      id="reach"
      aria-labelledby="reach-title"
      className="w-full px-4 sm:px-6 pb-12 sm:pb-16 scroll-mt-20"
    >
      <div className="mx-auto max-w-3xl text-center space-y-6">
        <h2
          id="reach-title"
          className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono"
        >
          Other ways to reach me
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <a
            href={`mailto:${resumeContact.email}`}
            className={REACH_CTA_CLASS}
            title="Email Tyler Lindow"
          >
            <Mail size={15} className="shrink-0" />
            <span>{resumeContact.email}</span>
          </a>
          <PreferLinkedIn className={REACH_CTA_CLASS} />
        </div>
      </div>
    </section>
  );
}
