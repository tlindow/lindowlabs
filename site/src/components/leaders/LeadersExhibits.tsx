"use client";

import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Exhibit {
  id: string;
  title: string;
  description: string;
  href: string;
  external?: boolean;
}

const exhibits: Exhibit[] = [
  {
    id: "reliability",
    title: "Making reliability second nature",
    description:
      "A practice for working through production incidents and embracing AI-driven development.",
    href: "/blog/velocity-labs",
  },
  {
    id: "teams",
    title: "Building teams as raising funds",
    description:
      "Intentional career growth and a shared belief in how the group grows.",
    href: "/blog/building-teams-as-raising-funds",
  },
  {
    id: "product",
    title: "Building product as system architecture",
    description:
      "Treat system architecture as the product so trust can keep compounding.",
    href: "/blog/building-product-as-system-architecture",
  },
  {
    id: "tinker",
    title: "Tinker",
    description: "A quiet place to be on the web.",
    href: "https://tinker.beginner.work",
    external: true,
  },
];

export default function LeadersExhibits() {
  return (
    <section
      id="exhibits"
      className="w-full border-t border-border/80 bg-background pt-16 pb-16 sm:pt-20 sm:pb-24 scroll-mt-20 relative font-mono"
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 space-y-10 sm:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="space-y-3 max-w-2xl"
        >
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
            Exhibits
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight text-foreground">
            Things we explore together
          </h2>
          <p className="text-xs sm:text-sm font-mono text-muted leading-relaxed">
            Pinned rooms in the museum — pick one that sparks something, or just
            wander.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {exhibits.map((exhibit, index) => {
            const cardClassName =
              "group flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-5 sm:p-6 shadow-xs hover:border-foreground/30 hover:bg-surface-alt transition-all h-full";

            const content = (
              <>
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base sm:text-lg font-bold font-mono tracking-tight text-foreground group-hover:text-indigo-dark transition-colors leading-snug">
                      {exhibit.title}
                    </h3>
                    {exhibit.external ? (
                      <ExternalLink
                        size={16}
                        className="shrink-0 text-muted group-hover:text-indigo-dark transition-colors mt-0.5"
                      />
                    ) : (
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-muted group-hover:text-indigo-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all mt-0.5"
                      />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-muted leading-relaxed">
                    {exhibit.description}
                  </p>
                </div>
              </>
            );

            return (
              <motion.div
                key={exhibit.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                  ease: [0.25, 0.4, 0.25, 1],
                }}
              >
                {exhibit.external ? (
                  <a
                    href={exhibit.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClassName}
                    title={exhibit.title}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={exhibit.href}
                    className={cardClassName}
                    title={exhibit.title}
                  >
                    {content}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
