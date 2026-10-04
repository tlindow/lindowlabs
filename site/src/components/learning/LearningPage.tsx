import { ArrowUpRight } from "lucide-react";
import Footer from "@/components/Footer";
import HomepageTheme from "@/components/HomepageTheme";
import ScrollReveal from "@/components/animations/ScrollReveal";
import {
  learningItemsByType,
  type LearningItem,
} from "@/data/learning";

function LearningGroup({
  title,
  items,
}: {
  title: string;
  items: LearningItem[];
}) {
  return (
    <section className="w-full px-4 sm:px-6 pb-12 sm:pb-16 scroll-mt-20">
      <div className="mx-auto max-w-3xl space-y-6 border-t border-border/70 pt-8 sm:pt-10">
        <ScrollReveal>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground font-mono">
            {title}
          </h2>
        </ScrollReveal>

        <ul className="space-y-8 sm:space-y-10">
          {items.map((item, i) => (
            <li key={`${item.type}-${item.name}`}>
              <ScrollReveal delay={Math.min(i, 5) * 0.06}>
                <article className="space-y-2">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono">
                    <span className="font-bold uppercase tracking-widest text-indigo-dark">
                      {item.status}
                    </span>
                    <span className="text-muted">·</span>
                    <span className="text-muted">{item.topic}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono leading-snug">
                    {item.link ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1.5 hover:text-indigo-dark transition-colors"
                      >
                        <span>{item.name}</span>
                        <ArrowUpRight
                          size={16}
                          className="shrink-0 mt-1.5 opacity-60"
                        />
                      </a>
                    ) : (
                      item.name
                    )}
                  </h3>

                  {item.author ? (
                    <p className="text-xs sm:text-sm font-mono text-muted">
                      {item.author}
                    </p>
                  ) : null}

                  {item.note ? (
                    <p className="text-sm sm:text-base font-mono text-muted leading-relaxed pt-1">
                      {item.note}
                    </p>
                  ) : null}
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function LearningPage() {
  const readings = learningItemsByType("Reading");
  const exercises = learningItemsByType("Exercise");

  return (
    <HomepageTheme>
      <div className="no-print w-full">
        <main className="w-full">
          <header className="flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto space-y-4 sm:space-y-5 relative pt-6 sm:pt-8 pb-10 sm:pb-12 scroll-mt-20">
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.05] mx-auto">
              Learning
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto max-w-2xl leading-relaxed">
              What I&apos;m reading and practicing right now.
            </p>
          </header>

          <LearningGroup title="Reading" items={readings} />
          <LearningGroup title="Exercises" items={exercises} />
        </main>
      </div>
      <Footer contactLeaf />
    </HomepageTheme>
  );
}
