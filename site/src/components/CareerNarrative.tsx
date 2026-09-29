import Link from "next/link";
import { FORMATION_SUMMARY, HEADLINE } from "@/data/positioning";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const affirmRoles = [
  {
    role: "Software Engineering Manager, Merchant Advocacy",
    when: "San Diego, CA (Remote) · Mar 2025 – Feb 2026",
    detail:
      "Company-scale engineering management for top-of-funnel marketing on affirm.com and the enterprise merchant portal.",
  },
  {
    role: "Developer Support Engineering Manager, Partner Engineering",
    when: "San Diego, CA (Remote) · Jul 2021 – Mar 2025",
    detail:
      "Company-scale engineering management for developer support and partner integrations — the enterprise B2B portal and the developers who integrate it.",
  },
  {
    role: "Developer Support Engineer, Partner Engineering",
    when: "San Francisco, CA (Hybrid) · Sep 2019 – Jul 2021",
    detail:
      "Developer-facing merchant integration support on the partner surface.",
  },
];

const earlierRoles = [
  {
    org: "Galvanize Inc",
    role: "Lead Software Engineering Immersive Resident",
    when: "San Francisco, CA · May 2019 – Aug 2019",
  },
  {
    org: "The Tech Interactive",
    role: "Experience Development Specialist & Prototyping Studio Coordinator",
    when: "San Jose, CA · May 2017 – Jan 2019",
  },
  {
    org: "Computer History Museum",
    role: "Design Code Build Instructor",
    when: "Mountain View, CA · Mar 2017 – Nov 2018",
  },
];

const themes = [
  {
    href: "/blog/securing-500k-gmv-win",
    title: "Securing a $500K GMV Win",
  },
  {
    href: "/blog/building-product-as-system-architecture",
    title: "Building Product as System Architecture",
  },
  {
    href: "/blog/velocity-labs",
    title: "Velocity Labs: 99.9% Availability in One Quarter",
  },
];

export default function CareerNarrative() {
  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28 font-mono">
      <header className="space-y-4">
        <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-indigo-dark block">
          Public story
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
          {HEADLINE}
        </h1>
        <p className="text-sm sm:text-base text-muted leading-relaxed max-w-2xl">
          The working resume is maintained in Formation. This page repeats that
          summary and keeps experience lean.
        </p>
      </header>

      <section className="mt-12 space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-dark">
          Summary
        </h2>
        <p className="text-base sm:text-lg text-foreground leading-relaxed">
          {FORMATION_SUMMARY}
        </p>
      </section>

      <section className="mt-12 space-y-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-dark">
          Experience
        </h2>

        <div className="space-y-1 border-t border-border/70 pt-6">
          <h3 className="text-lg sm:text-xl font-bold text-foreground">
            Beginner Work Inc.
            <span className="text-muted font-normal"> · Founder</span>
          </h3>
          <p className="text-sm text-muted">San Diego, CA · Mar 2026 – Jul 2026</p>
        </div>

        {affirmRoles.map((item) => (
          <div key={item.role} className="space-y-2 border-t border-border/70 pt-6">
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Affirm
              <span className="text-muted font-normal"> · {item.role}</span>
            </h3>
            <p className="text-sm text-muted">{item.when}</p>
            <p className="text-sm sm:text-base text-foreground/90 leading-relaxed">
              {item.detail}
            </p>
          </div>
        ))}

        <div className="space-y-4 border-t border-border/70 pt-6">
          <h3 className="text-lg font-bold text-foreground">
            Earlier · beginner and DevX
          </h3>
          <ul className="space-y-3">
            {earlierRoles.map((item) => (
              <li key={item.org} className="text-sm leading-relaxed">
                <span className="font-bold text-foreground">{item.org}</span>
                <span className="text-muted"> · {item.role}</span>
                <span className="block text-muted">{item.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-dark">
          Writing
        </h2>
        <ul className="space-y-2">
          {themes.map((theme) => (
            <li key={theme.href}>
              <Link
                href={`${basePath}${theme.href}`}
                className="text-sm sm:text-base font-bold text-foreground hover:text-indigo-dark underline underline-offset-4"
              >
                {theme.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
