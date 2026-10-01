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
              Tell me about yourself
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-foreground/90 leading-relaxed">
              <p>
                My name is Tyler Lindow. I was most recently an engineering
                manager at Affirm, leading the merchant onboarding product for
                the payment network. After that, I founded my own startup,
                Beginner, which helped developers journal and develop pitch
                lines for enterprise fundraising.
              </p>

              <p>
                I focus on domain-driven architectures for onboarding products
                within financial technology, using AI-native development with
                technologies like Python, Protobuf interfaces, and logging and
                metrics stacks like Sentry and Grafana.
              </p>

              <p>
                I&apos;m seeking an engineering management position that
                leverages strong operational systems to grow talent and allow
                engineers to become more specialized within large-scale
                software.
              </p>
            </div>
          </article>
        </div>
      </ScrollReveal>
    </section>
  );
}
