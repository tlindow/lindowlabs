"use client";

import ScrollReveal from "@/components/animations/ScrollReveal";

export default function LeadersEssay() {
  return (
    <section
      id="essay"
      aria-labelledby="essay-title"
      className="w-full px-4 sm:px-6 pb-16 sm:pb-24 scroll-mt-20"
    >
      <ScrollReveal className="mx-auto max-w-3xl">
        {/* Matches homepage #trusted-partners panel: rounded-2xl + slightly darker cream */}
        <div className="rounded-2xl bg-sand px-6 py-8 sm:px-8 sm:py-10 md:px-10 md:py-12">
          <article className="mx-auto max-w-[65ch] font-mono">
            <h2
              id="essay-title"
              className="text-base sm:text-lg font-bold tracking-tight text-foreground mb-5 sm:mb-6"
            >
              Who you&apos;ll work with
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-foreground/90 leading-relaxed">
              <p>
                My name is Tyler Lindow. I&apos;m an engineering manager for
                fintech platforms and merchant and partner integrations. I spent
                6+ years at Affirm, most recently leading the engineering team
                that owned Merchant Portal, and then founded Beginner Work.
              </p>

              <p>
                In 30 minutes, we pick one thing that&apos;s costing you time,
                like a partner integration that keeps slipping, an on-call
                rotation that wears your team out, or a reliability gap nobody
                owns. You leave with a next step you can act on this week.
              </p>

              <p>
                If that sounds useful, choose a time above. And if your team
                needs an engineering manager, say so.
              </p>
            </div>
          </article>
        </div>
      </ScrollReveal>
    </section>
  );
}
