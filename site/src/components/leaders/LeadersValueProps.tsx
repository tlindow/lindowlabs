"use client";

import { motion } from "framer-motion";

const pillars = [
  {
    id: "recharge",
    pretitle: "Recharge.",
    title: "Be yourself for 30 minutes.",
    body: "No agenda, no pitch, no prep.",
  },
  {
    id: "rediscover",
    pretitle: "Rediscover.",
    title: "Rediscover what got you into engineering.",
    body: "We talk about the ideas and problems that light you up.",
  },
  {
    id: "return",
    pretitle: "Return.",
    title: "Go back to your team re-energized.",
    body: "Fresh energy and a clearer head.",
  },
];

export default function LeadersValueProps() {
  return (
    <section
      id="value-props"
      className="w-full border-t border-border/80 bg-surface-alt/70 pt-16 pb-16 sm:pt-20 sm:pb-24 scroll-mt-20 relative font-mono"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="flex flex-col items-start text-left space-y-3 pt-6 md:pt-0 border-t border-border/60 md:border-t-0 first:border-t-0 first:pt-0"
            >
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
                {pillar.pretitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-foreground leading-snug">
                {pillar.title}
              </h2>
              <p className="text-xs sm:text-sm font-mono text-muted leading-relaxed">
                {pillar.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
