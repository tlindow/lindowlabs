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
              Get me on your team
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-foreground/90 leading-relaxed">
              <p>
                I am and always will be someone who prioritizes inspiring
                engineers.
              </p>

              <p>
                I&apos;m just good at it. It&apos;s what I was first hired to
                do. Even in high school, my teacher asked me to be a private
                tutor for someone struggling in algebra, and I got paid for it.
                I got paid for it at The Tech Museum and at the Computer History
                Museum. And even at Affirm, I got that job because I had a
                vision for where I wanted to be in five years, and I got there:
                developer advocate.
              </p>

              <p>There&apos;s a market for that.</p>

              <p>
                So what I&apos;m looking to get paid for is to be a coach for
                directors, and give them the tools they need to not feel so
                overwhelmed by building culture. The elephant in the room is
                that I would be in a more junior position, so I need to come
                across as &quot;I&apos;m not here to take your job. I&apos;m
                here to get you promoted too.&quot;
              </p>

              <p>
                Get me on your team. You don&apos;t need a private coach. You
                need someone who is going to get your teams working as close to
                the work as possible.
              </p>
            </div>
          </article>
        </div>
      </ScrollReveal>
    </section>
  );
}
