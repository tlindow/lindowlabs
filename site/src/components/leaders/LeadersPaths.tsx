"use client";

import Link from "next/link";
import { Calendar, FileText, Mail } from "lucide-react";
import PreferLinkedIn from "@/components/PreferLinkedIn";
import { LEADERS_CALENDLY_URL } from "@/data/leadersPage";
import { resumeContact } from "@/data/resumeData";

const CONTACT_CTA_CLASS =
  "inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer";

export default function LeadersPaths() {
  return (
    <section
      id="paths"
      className="w-full px-4 sm:px-6 pb-10 sm:pb-14 scroll-mt-20"
    >
      <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="h-full rounded-2xl bg-sand px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-5 border border-border/70">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
            Bring a problem
          </h2>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-mono flex-1">
            Pick one thing that&apos;s costing you time: a partner integration
            that keeps slipping, an on-call rotation that wears your team out,
            or a reliability gap nobody owns. In 30 minutes, you leave with a
            next step you can act on this week.
          </p>
          <a
            href={LEADERS_CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex self-start items-center gap-2 rounded-xl bg-foreground text-background hover:bg-foreground/90 px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            title="Choose a time with Tyler Lindow"
          >
            <Calendar size={15} className="shrink-0" />
            <span>Choose a time</span>
          </a>
        </div>

        <div className="h-full rounded-2xl bg-sand px-6 py-8 sm:px-8 sm:py-10 flex flex-col gap-5 border border-border/70">
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
            Hiring an engineering manager?
          </h2>
          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-mono flex-1">
            I&apos;m looking for my next engineering manager role in developer
            experience, platforms, or partner integrations. Read the resume, or
            email me directly.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Link
              href="/resume"
              className={CONTACT_CTA_CLASS}
              title="Read Tyler Lindow's resume"
            >
              <FileText size={15} className="shrink-0" />
              <span>Read resume</span>
            </Link>
            <a
              href={`mailto:${resumeContact.email}`}
              className={CONTACT_CTA_CLASS}
              title="Email Tyler Lindow"
            >
              <Mail size={15} className="shrink-0" />
              <span>Email Tyler</span>
            </a>
            <PreferLinkedIn className={CONTACT_CTA_CLASS} />
          </div>
        </div>
      </div>
    </section>
  );
}
