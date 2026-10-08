"use client";

import React from "react";
import { Mail, ArrowUpRight } from "lucide-react";

interface StatMetric {
  value: string;
  label: string;
  sublabel: string;
}

interface ColumnDefinition {
  id: string;
  number: string;
  title: string;
  tagline: string;
  stats: StatMetric[];
  scope: string[];
}

const columns: ColumnDefinition[] = [
  {
    id: "col-1",
    number: "01",
    title: "B2C",
    tagline: "1:1 Engineering & Leadership",
    stats: [
      { value: "500+", label: "Devs Educated", sublabel: "Computer History Museum" },
      { value: "$400K", label: "Revenue · 20 Devs", sublabel: "Galvanize" },
    ],
    scope: [
      "1:1 Architectural pairing & code reviews",
      "Career transition & IC-to-lead acceleration",
      "Developer onboarding & paved paths",
    ],
  },
  {
    id: "col-2",
    number: "02",
    title: "B2B",
    tagline: "Community & Enablement",
    stats: [
      { value: "92", label: "Conversations", sublabel: "Beginner" },
      { value: "28", label: "Early Users", sublabel: "Tinker" },
    ],
    scope: [
      "Technical curriculum & workshop design",
      "Developer community architecture",
      "Founder & investor customer discovery",
    ],
  },
  {
    id: "col-3",
    number: "03",
    title: "B2B",
    tagline: "0-to-1 B2B Fintech & Scale",
    stats: [
      { value: "Flagship", label: "Partner Support", sublabel: "Affirm" },
      { value: "300+", label: "SMB Merchants", sublabel: "Affirm" },
    ],
    scope: [
      "0-to-1 product development & MVP launch",
      "Enterprise B2B fintech integrations & telemetry",
      "Merchant Portal reliability & SLA reports",
    ],
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 pt-14 sm:pt-20 pb-12 sm:pb-16 scroll-mt-20 select-none font-mono"
    >
      {/* Invisible anchor target for legacy/hero links pointing to #launch-wallet */}
      <div id="launch-wallet" className="absolute -top-24 left-0 pointer-events-none" />


      {/* Containerized Columns aligned with value props */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {columns.map((col) => {
          return (
            <div
              key={col.id}
              id={col.id}
              className="rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-2xs hover:border-indigo/40 transition-all flex flex-col justify-between h-full scroll-mt-24"
            >
              <div className="flex flex-col gap-4">
                {/* Title & Tagline */}
                <div className="space-y-1">
                  <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark block">
                    {col.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold font-mono tracking-tight text-foreground">
                    {col.title}
                  </h3>
                  <p className="text-xs font-mono text-muted">
                    {col.tagline}
                  </p>
                </div>

                {/* Scope & Focus Points */}
                <div className="space-y-2 pt-3 border-t border-border/60">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted">
                    Focus &amp; Scope
                  </span>
                  <ul className="space-y-1.5 text-xs font-mono text-foreground/90">
                    {col.scope.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-dark font-bold select-none">&rarr;</span>
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Big Simple Numbers (at bottom of column, below content) */}
                <div className="flex flex-col gap-4 pt-4 border-t border-border/60">
                  {col.stats.map((stat, sIdx) => (
                    <div key={sIdx} className="flex flex-col">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight text-foreground">
                        {stat.value}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-foreground/90 mt-1 leading-snug">
                        {stat.label}
                      </span>
                      <span className="text-[10px] font-mono text-muted leading-tight mt-0.5">
                        {stat.sublabel}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button pinned at bottom of column 3 only */}
              {col.id === "col-3" && (
                <div className="mt-6 pt-4 border-t border-border/60">
                  <a
                    href={`mailto:tyler@lindowlabs.dev?subject=${encodeURIComponent(`Inquiry: ${col.title}`)}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold font-mono transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-xs bg-indigo-dark text-sand hover:bg-labs-primary-dark"
                  >
                    <Mail size={14} />
                    <span>Let&apos;s talk</span>
                    <ArrowUpRight size={14} className="opacity-75" />
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
