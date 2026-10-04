"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import HomepageTheme from "@/components/HomepageTheme";
import ScrollReveal from "@/components/animations/ScrollReveal";
import {
  FUNNEL_STEPS,
  VISITORS_API_URL,
  formatCountingSince,
  formatViews,
  formatWeekStart,
  type VisitorsData,
} from "@/data/visitors";

const FETCH_TIMEOUT_MS = 8000;
const EMPTY_COPY = "Counting starts soon.";
const INTRO_COPY =
  "How people find and use this site: where they come from, what they read, and how many go on to book time.";

function isValidVisitorsData(value: unknown): value is VisitorsData {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  if (!("since" in data)) return false;
  if (data.since !== null && typeof data.since !== "string") return false;
  if (!Array.isArray(data.weeks) || !Array.isArray(data.sources) || !Array.isArray(data.pages)) {
    return false;
  }
  if (!data.funnel || typeof data.funnel !== "object") return false;
  return true;
}

async function fetchVisitors(): Promise<VisitorsData | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(VISITORS_API_URL, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    if (!isValidVisitorsData(json)) return null;
    if (json.since == null || json.since === "") return null;
    return json;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 sm:py-3.5">
      <span className="text-sm sm:text-base font-mono text-foreground leading-snug min-w-0 break-all">
        {label}
      </span>
      <span className="text-sm sm:text-base font-mono font-bold text-foreground tabular-nums shrink-0">
        {value}
      </span>
    </div>
  );
}

function VisitorsSections({ data }: { data: VisitorsData }) {
  const sinceLabel = formatCountingSince(data.since!);
  const funnelSteps = FUNNEL_STEPS.filter((step) => {
    if (step.key !== "booked") return true;
    return data.funnel.booked != null;
  });

  return (
    <>
      <p className="text-xs sm:text-sm font-mono text-muted text-center px-4 pb-8 sm:pb-10">
        Counting since {sinceLabel}
      </p>

      <section className="w-full px-4 sm:px-6 pb-12 sm:pb-16 scroll-mt-20">
        <div className="mx-auto max-w-3xl space-y-4 border-t border-border/70 pt-8 sm:pt-10">
          <ScrollReveal>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
              Visits by week
            </h2>
          </ScrollReveal>
          {data.weeks.length === 0 ? null : (
            <ul className="divide-y divide-border/70 border-t border-border/70">
              {data.weeks.map((row, i) => (
                <li key={row.week}>
                  <ScrollReveal delay={Math.min(i, 6) * 0.04}>
                    <StatRow
                      label={formatWeekStart(row.week)}
                      value={formatViews(row.views)}
                    />
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 pb-12 sm:pb-16 scroll-mt-20">
        <div className="mx-auto max-w-3xl space-y-4 border-t border-border/70 pt-8 sm:pt-10">
          <ScrollReveal>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
              Top sources
            </h2>
          </ScrollReveal>
          {data.sources.length === 0 ? null : (
            <ul className="divide-y divide-border/70 border-t border-border/70">
              {data.sources.map((row, i) => (
                <li key={`${row.source}-${i}`}>
                  <ScrollReveal delay={Math.min(i, 6) * 0.04}>
                    <StatRow
                      label={row.source || "direct"}
                      value={formatViews(row.views)}
                    />
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 pb-12 sm:pb-16 scroll-mt-20">
        <div className="mx-auto max-w-3xl space-y-4 border-t border-border/70 pt-8 sm:pt-10">
          <ScrollReveal>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
              Most-read pages
            </h2>
          </ScrollReveal>
          {data.pages.length === 0 ? null : (
            <ul className="divide-y divide-border/70 border-t border-border/70">
              {data.pages.map((row, i) => (
                <li key={row.path}>
                  <ScrollReveal delay={Math.min(i, 6) * 0.04}>
                    <StatRow
                      label={row.path || "/"}
                      value={formatViews(row.views)}
                    />
                  </ScrollReveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 pb-16 sm:pb-24 scroll-mt-20">
        <div className="mx-auto max-w-3xl space-y-4 border-t border-border/70 pt-8 sm:pt-10">
          <ScrollReveal>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
              Funnel
            </h2>
          </ScrollReveal>
          <ul className="divide-y divide-border/70 border-t border-border/70">
            {funnelSteps.map((step, i) => {
              const value = data.funnel[step.key];
              if (value == null) return null;
              return (
                <li key={step.key}>
                  <ScrollReveal delay={Math.min(i, 6) * 0.04}>
                    <StatRow label={step.label} value={formatViews(value)} />
                  </ScrollReveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

export default function VisitorsPage() {
  const [data, setData] = useState<VisitorsData | null>(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    let active = true;
    fetchVisitors().then((result) => {
      if (!active) return;
      setData(result);
      setResolved(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <HomepageTheme>
      <div className="no-print w-full">
        <main className="w-full">
          <header className="flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto space-y-4 sm:space-y-5 relative pt-6 sm:pt-8 pb-10 sm:pb-12 scroll-mt-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.05] mx-auto">
              Visitors
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto max-w-2xl leading-relaxed">
              {INTRO_COPY}
            </p>
          </header>

          {!resolved ? (
            <p className="text-sm sm:text-base font-mono text-muted text-center px-4 pb-24">
              {EMPTY_COPY}
            </p>
          ) : data ? (
            <VisitorsSections data={data} />
          ) : (
            <p className="text-sm sm:text-base font-mono text-muted text-center px-4 pb-24">
              {EMPTY_COPY}
            </p>
          )}
        </main>
      </div>
      <Footer contactLeaf />
    </HomepageTheme>
  );
}
