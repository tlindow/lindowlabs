import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import HomepageTheme from "@/components/HomepageTheme";
import ScrollReveal from "@/components/animations/ScrollReveal";
import VelocityChart from "@/components/velocity/VelocityChart";
import {
  formatMedianHours,
  formatMergedDate,
  velocityData,
} from "@/data/velocity";

export default function VelocityPage() {
  const { headline, recentShipped, beginnerIncluded, generatedAt } =
    velocityData;
  const generatedLabel = new Date(generatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const stats = [
    {
      label: "PRs shipped (7 days)",
      value: String(headline.prsLast7Days),
    },
    {
      label: "Weekly average (4 weeks)",
      value: String(headline.weeklyAverage4Weeks),
    },
    {
      label: "Median time to merge (4 weeks)",
      value: formatMedianHours(headline.medianHoursToMerge4Weeks),
    },
  ];

  return (
    <HomepageTheme>
      <div className="no-print w-full">
        <main className="w-full">
          <header className="flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto space-y-4 sm:space-y-5 relative pt-8 sm:pt-10 pb-10 sm:pb-12 scroll-mt-20">
            <Link
              href="/"
              className="inline-flex text-xs sm:text-sm font-mono font-medium text-muted hover:text-indigo-dark transition-colors underline-offset-4 hover:underline"
            >
              Engineering leadership for fintech platforms
            </Link>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.05] mx-auto">
              Velocity
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto max-w-2xl leading-relaxed">
              What shipped each week across my repos, and how long each change
              took to go live.
            </p>
          </header>

          <section className="w-full px-4 sm:px-6 pb-10 sm:pb-14 scroll-mt-20">
            <div className="mx-auto max-w-5xl grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 border-t border-border/70 pt-8 sm:pt-10">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.08}>
                  <div className="text-center sm:text-left space-y-2">
                    <p className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark">
                      {stat.label}
                    </p>
                    <p className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground font-mono">
                      {stat.value}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          <section className="w-full px-4 sm:px-6 pb-12 sm:pb-16 scroll-mt-20">
            <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6 border-t border-border/70 pt-8 sm:pt-10">
              <ScrollReveal>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
                  PRs merged per week
                </h2>
                <p className="mt-2 text-xs sm:text-sm font-mono text-muted leading-relaxed max-w-2xl">
                  Stacked by repository. Velocity is up when weekly merges rise
                  while time-to-merge stays flat or drops.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <VelocityChart data={velocityData} />
              </ScrollReveal>
              <p className="text-xs font-mono text-muted">
                Updated {generatedLabel}
                {beginnerIncluded
                  ? ". Includes private beginner counts (no titles)."
                  : ". Public repos only; private beginner counts are omitted until a token with access is configured."}
              </p>
            </div>
          </section>

          <section className="w-full px-4 sm:px-6 pb-16 sm:pb-24 scroll-mt-20">
            <div className="mx-auto max-w-5xl space-y-6 border-t border-border/70 pt-8 sm:pt-10">
              <ScrollReveal>
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
                  Recently shipped
                </h2>
                <p className="mt-2 text-xs sm:text-sm font-mono text-muted leading-relaxed">
                  Public repositories only.
                </p>
              </ScrollReveal>

              <ul className="divide-y divide-border/70 border-t border-border/70">
                {recentShipped.map((item, i) => (
                  <li key={`${item.repo}-${item.url}`}>
                    <ScrollReveal delay={Math.min(i, 6) * 0.04}>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6 py-4 sm:py-5"
                      >
                        <span className="text-sm sm:text-base font-mono font-bold text-foreground group-hover:text-indigo-dark transition-colors leading-snug inline-flex items-start gap-1.5">
                          <span>{item.title}</span>
                          <ArrowUpRight
                            size={14}
                            className="shrink-0 mt-1 opacity-50 group-hover:opacity-100"
                          />
                        </span>
                        <span className="text-xs font-mono text-muted shrink-0 sm:text-right">
                          {item.repo}
                          <span className="mx-1.5">·</span>
                          {formatMergedDate(item.mergedAt)}
                        </span>
                      </a>
                    </ScrollReveal>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>
      <Footer contactLeaf />
    </HomepageTheme>
  );
}
