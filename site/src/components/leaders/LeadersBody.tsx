"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";
import About from "@/components/About";
import WhatYouGet from "@/components/WhatYouGet";
import { ENGINEERING_LEADERS_MUSEUM_BODY } from "@/data/engineeringLeadersPage";

/**
 * Below-hero sections for /engineering-leaders: shared homepage About,
 * museum add-on (leaders only), then shared WhatYouGet pillars.
 */
export default function LeadersBody() {
  return (
    <>
      <About />

      <section
        id="museum"
        className="py-16 sm:py-24 px-4 sm:px-6 border-t border-border/70"
        data-leaders="museum"
      >
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <p className="text-[15px] sm:text-lg leading-relaxed text-muted font-mono">
              {ENGINEERING_LEADERS_MUSEUM_BODY}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <WhatYouGet />
    </>
  );
}
