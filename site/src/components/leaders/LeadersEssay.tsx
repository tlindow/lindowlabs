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
              How I help you get your time back
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-foreground/90 leading-relaxed">
              <p>
                I help engineering directors build a culture where teams work as
                close to the metal as possible. That is the path to getting your
                time back: less overwhelm around culture, and teams closer to
                what actually matters.
              </p>

              <p>
                I&apos;m Tyler Lindow. I prioritize inspiring engineers. In high
                school my teacher asked me to tutor someone struggling in
                algebra, and I got paid for it. I got paid for that work at The
                Tech Museum and at the Computer History Museum. At Affirm I
                spent 6+ years and became a developer advocate because I had a
                vision for where I wanted to be. I am also the ex-founder of
                Beginner Work.
              </p>

              <p>
                I&apos;m not here to take your job. I&apos;m here to help you
                get promoted too. You don&apos;t need a private coach. You need
                someone who will help you build culture and get your teams
                working as close to the metal as possible.
              </p>

              <p>When you&apos;re ready, choose a time.</p>
            </div>
          </article>
        </div>
      </ScrollReveal>
    </section>
  );
}
