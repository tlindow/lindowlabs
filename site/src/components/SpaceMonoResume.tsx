"use client";

import { useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Download,
  Copy,
  Check,
  Github,
  Mail,
  Phone,
  MapPin,
  Printer,
  ArrowUpRight,
} from "lucide-react";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import {
  resumeContact,
  professionalSummary,
  professionalExperience,
  educationList,
} from "@/data/resumeData";
import { useAnalytics } from "@/context/AnalyticsProvider";
import type { ParsedResume } from "@/lib/parseResumeMarkdown";

const RESUME_INLINE_LINK_CLASS =
  "text-foreground hover:text-indigo-dark transition-colors underline underline-offset-2";

/** Turn `[text](url)` into real anchors; leave all other copy untouched. */
function renderInlineMarkdown(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  const linkRe = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkRe.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(
      <a
        key={`md-link-${key++}`}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className={RESUME_INLINE_LINK_CLASS}
      >
        {match[1]}
      </a>,
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  if (nodes.length === 0) return text;
  if (nodes.length === 1) return nodes[0];
  return <>{nodes}</>;
}

const FALLBACK_RAW_MARKDOWN = `# Tyler Lindow

**Engineering Manager | Fintech Platform & 0-to-1 | Ex-Founder**  
San Diego, CA | Open to relocation  
(650) 580-5788 | [tyler.lindow@gmail.com](mailto:tyler.lindow@gmail.com)  
[linkedin.com/in/tlindow](https://linkedin.com/in/tlindow) | [github.com/tlindow](https://github.com/tlindow)

---

## Summary

Fintech engineering manager with 4+ years leading teams of up to 9 engineers at Affirm. Cut detection of higher-volume merchant outages from 20 minutes–2 hours to under 5, and held Merchant Portal at 99.9% availability with zero incidents during BFCM 2025. Ex-founder (Beginner Work Inc.). Targeting Engineering Manager / Senior EM roles in fintech (payments, platform/DevX, partner integrations).

---



## Professional Experience



### Founder | Beginner Work Inc.

*San Diego, CA | Mar 2026 – Jul 2026 (wound down before a raise)*

- Built and launched a fundraising pitch simulator (React/Next.js) as sole founder; owned product discovery, architecture, and GTM. Validated demand through 92 in-person conversations (including 5 VCs) and 28 early users.

### Software Engineering Manager (L7), Merchant Advocacy | Affirm

*San Diego, CA (Remote) | Mar 2025 – Feb 2026 (role eliminated)*

- **Scope:** Led the former developer-support team as Merchant Advocacy Engineering, a product engineering team partnering with Design and Content: 9 software engineers (2 Staff, 2 SWE II, 4 SWE I, 1 contractor), later reshaped to 6. Owned Merchant Portal (React, TypeScript), the API-key and transaction-view surface for merchants integrated via ecommerce platforms or direct API, with ~5K new merchant sign-ups a month.
- **Merchant lifecycle re-architecture:** Led every Partner and Merchant Engineering team through a merchant-domain architecture review that set which team owns which merchant data. Got sign-off from 2 Directors, the Principal Architect, and every team's EM, and presented it to Affirm leadership in Q3 2025. The review showed Merchant Risk and Merchant Advocacy were tightly coupled, which led Affirm to consolidate them under one EM, move former developer-support engineers into SRE, and add PM investment in direct merchant customer problems.
- **Merchant Portal reliability:** Added metrics dashboards linked to logs, plus on-call alerting, which surfaced ~10 production incidents in Q4 2025 early enough to fix before Black Friday/Cyber Monday. Held 99.9% availability through the quarter and had zero incidents during BFCM.
- **Incident Communications:** Ran the Partner Engineering on-call program across my team and ~10 more engineers from Technical Account Management. Built a web tool that showed responders which enterprise merchants to email and when, plus Rootly automations that prompted the same steps in incident Slack channels, keeping merchant emails within the 15-minute enterprise SLA.
- **Intuit ([announced February 2026](https://investors.affirm.com/news-releases/news-release-details/intuit-partners-affirm-provide-pay-over-time-offering-quickbooks)):** Unblocked Affirm's launch as QuickBooks Payments' exclusive pay-over-time partner, stalled since November 2025 by a Merchant Portal onboarding bug. My team shipped 3 production fixes, letting the production ramp start in early Q1 2026.
- **Shift to building:** Moved the team's time spent building from ~10–20% to 50%+ by making Tier-2 escalations advisory (coached Tier-2 support to self-serve in Snowflake and work directly with ecommerce platform teams). The freed capacity staffed an enterprise authorization (AuthZ) re-architecture of Merchant Portal with the Security org (near release when my role ended), the SLA reporting handoff to SRE, and the Intuit fix.

### Developer Support Engineering Manager (L6 to L7), Partner Engineering | Affirm

*San Diego, CA (Remote) | Jul 2021 – Mar 2025*

- **Scope:** Managed a team that grew from 1 to 9 engineers (all software engineers by early 2025), building and running the tooling behind Affirm's merchant and partner integrations: per-merchant observability and alerting, the Snowflake availability reporting behind the Amazon partnership, and partner REST API and webhook support.
- **Observability:** Built per-merchant dashboards and alerting that cut detection time for outages at higher-volume merchants to under 5 minutes (previously 20 minutes–2 hours unnoticed).
- **Amazon, flagship partner ([21% of Affirm’s GMV in FY2024](https://www.sec.gov/Archives/edgar/data/1820953/000182095325000080/afrm-20250630.htm)):** Supported Amazon from before its [August 2021](https://investors.affirm.com/news-releases/news-release-details/amazon-partners-with-affirm) launch, then led my team's build of the Snowflake availability report Affirm used to meet Amazon's partnership requirements, later the baseline for the VP of Engineering's spring 2025 reliability sprint.
- **Merchant Portal SLA reports:** Acted as tech lead (no Staff engineers on the team yet) for an SLA reporting feature released in Merchant Portal in late 2024 to early 2025, letting Technical Account Managers share SLA reports directly with their merchants and cutting each monthly report's turnaround from ~2 weeks to ~1 week. Wrote the tech spec every direct report built from.
- **Team building:** Owned interview rubrics and hiring decisions for 4 hires (2 developer support engineers and 2 SWEs, one in Poland) and integrated 5 engineers who joined through reorgs.
- **People development:** Delivered 2 promotions, including a junior engineer to intermediate in ~1 year who then moved into product-building engineering. Ran monthly career-growth reviews across the 9-engineer team. Team engagement scores hit 9/10 (Affirm averaged [7.8–8.3](https://investors.affirm.com/static-files/f41ab85f-c739-479e-8bfb-4c337d3ea987)).

### Developer Support Engineer (L4 to L5), Partner Engineering | Affirm

*San Francisco, CA (Hybrid) | Sep 2019 – Jul 2021*

- **Merchant checkout integrations:** Primary technical liaison for 300+ SMB merchants; diagnosed JavaScript, REST API, and webhook defects in checkout / payment-method integrations on Shopify, Magento, WooCommerce, and Salesforce Commerce Cloud.
- **DevX feedback loop:** Built ETL pipelines into Snowflake to cluster integration-defect patterns and turn developer feedback into platform fixes that cut recurring integration tickets.

### Earlier Experience

- Lead Software Engineering Immersive Resident, Galvanize / Hack Reactor (2019); Experience Development Specialist, The Tech Interactive (2017–2019); Design Code Build Instructor, Computer History Museum (2017–2018).

---



## Education

- **University of California, San Diego** | B.S. NanoEngineering, Cum Laude *(La Jolla, CA)*
- **Northwestern University** | Learning Sciences graduate coursework *(Evanston, IL)*
- **Software engineering:** Hack Reactor Advanced Software Engineering Immersive; Deep Atlas Applied AI & ML residency

---



## Skills & Toolkits

- **Technical Toolkit:** Python, JavaScript, TypeScript, React, Next.js, Node.js, Flask, Snowflake, SQL, ETL Pipelines, REST APIs, Webhooks, CI/CD, Git/GitHub, observability, LLMs & agentic coding (Claude, Cursor)
- **Leadership & Management:** Performance management & promotions, org design / domain boundaries, mentorship, incident management
- **B2B Integrations & Operations:** Partner Engineering, merchant checkout integrations (Shopify, Magento, WooCommerce, SFCC)
`;

/* ───────────────────────────────────────────────────────────────────── */
/* Stagger entrance variants                                             */
/* ───────────────────────────────────────────────────────────────────── */

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.05, ease: "easeOut" },
  }),
};

/* ───────────────────────────────────────────────────────────────────── */
/* Minimalist Section Header                                             */
/* ───────────────────────────────────────────────────────────────────── */

function SectionHeader({ title }: { title: string }) {
  return (
    <h2 className="text-sm sm:text-base font-mono font-bold tracking-tight text-foreground uppercase mb-3">
      {title}
    </h2>
  );
}

/* ───────────────────────────────────────────────────────────────────── */
/* Main component                                                       */
/* ───────────────────────────────────────────────────────────────────── */

interface SpaceMonoResumeProps {
  parsedResume?: ParsedResume;
}

export default function SpaceMonoResume({ parsedResume }: SpaceMonoResumeProps) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [revealPhone, setRevealPhone] = useState(false);
  const { logResumeView, trackEvent } = useAnalytics();

  const contact = parsedResume?.contact || resumeContact;
  const summaryTitle = parsedResume?.summaryTitle || "Summary";
  const vision = parsedResume?.visionText || professionalSummary.text;
  const experiences = parsedResume?.experiences || professionalExperience;
  const education = parsedResume?.education || educationList;
  const skillsList = parsedResume?.skillsList || [
    { category: "AI & Agentic Systems", skills: "LLMs & RAG, Agentic Coding Frameworks, PyTorch, Antigravity, Jules, Luma, First-Principles GenAI Upskilling." },
    { category: "Languages & Frameworks", skills: "Python, JavaScript, React, Next.js, Node.js, Flask." },
    { category: "Cloud, Data & SRE", skills: "Snowflake, SQL, ETL Pipelines, SRE Support, Vercel, Git/GitHub, CI/CD, SLA telemetry." },
    { category: "Product & GTM Strategy", skills: "Developer Advocacy & Evangelism, Partner Engineering, GTM Strategy, Developer Paved Paths & Enablement, Cross-Functional Stakeholder Alignment, Voice of the Developer Synthesis, Technical Community Architecture." }
  ];
  const rawMarkdown = parsedResume?.rawMarkdown || FALLBACK_RAW_MARKDOWN;

  const handleCopyMarkdown = async () => {
    trackEvent("resume_copy_markdown", {
      event_category: "resume_interaction",
    });
    try {
      await navigator.clipboard.writeText(rawMarkdown);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2200);
    } catch {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2200);
    }
  };

  const handlePrint = () => {
    logResumeView("download_pdf");
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-background text-foreground pt-1 pb-12 sm:pb-20 px-3 sm:px-6 print:py-0 print:px-0 print:min-h-0">
      {/* Main Single Resume Document Canvas */}
      <main className="max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
        <article className="resume-paper rounded-3xl bg-surface border border-border p-6 sm:p-14 text-foreground leading-relaxed selection:bg-indigo-light shadow-sm hover:shadow-md relative overflow-visible print:p-0 print:m-0 print:border-none print:shadow-none print:rounded-none">


          {/* ═══════════════════════════════════════════════════════ */}
          {/* HEADER: Name, Title, Contact Info                      */}
          {/* ═══════════════════════════════════════════════════════ */}
          <motion.header
            className="resume-section pt-3 pb-4 print:pt-0"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <div>
              <h1 className="text-2xl sm:text-4xl font-mono font-bold tracking-tight text-foreground">
                {contact.name}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-wider">
                {contact.title}
              </p>
            </div>

            {/* Contact Metadata: Clean, Minimalist Rows */}
            <div className="mt-3 pt-2.5 border-t border-border/60 space-y-1.5 text-xs sm:text-sm text-muted font-mono">
              {/* Line 1: Location & Relocation */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1.5 text-foreground">
                  <MapPin size={12} className="text-indigo-dark shrink-0" />
                  {contact.location}
                </span>
                {contact.relocation && (
                  <>
                    <span className="text-border select-none">|</span>
                    <span className="text-indigo-dark font-medium">
                      {contact.relocation}
                    </span>
                  </>
                )}
              </div>

              {/* Line 2: Phone & Email */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="inline-flex items-center gap-1.5 text-foreground">
                  <Phone size={12} className="text-indigo-dark shrink-0" />
                  <span className="print:hidden">
                    {revealPhone ? (
                      <a
                        href={`tel:${contact.phone.replace(/[^0-9]/g, "")}`}
                        className="text-foreground hover:text-indigo-dark transition-colors"
                      >
                        {contact.phone}
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setRevealPhone(true)}
                        className="text-foreground hover:text-indigo-dark transition-colors cursor-pointer text-left font-mono"
                        title="Click to reveal phone number"
                      >
                        {contact.phoneObscured || "(650) •••-••••"}
                      </button>
                    )}
                  </span>
                  <span className="hidden print:inline text-foreground">
                    {contact.phone}
                  </span>
                </div>
                <span className="text-border select-none">|</span>

                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-1.5 text-foreground hover:text-indigo-dark transition-colors underline underline-offset-2"
                >
                  <Mail size={12} className="text-indigo-dark shrink-0" />
                  {contact.email}
                </a>
              </div>

              {/* Line 3: LinkedIn | GitHub */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-foreground hover:text-indigo-dark transition-colors underline underline-offset-2"
                >
                  <LinkedInIcon size={12} className="text-indigo-dark shrink-0" />
                  <span>{contact.linkedinDisplay}</span>
                  <ArrowUpRight size={10} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 no-print" />
                </a>
                <span className="text-border select-none">|</span>

                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-foreground hover:text-indigo-dark transition-colors underline underline-offset-2"
                >
                  <Github size={12} className="text-indigo-dark shrink-0" />
                  <span>{contact.githubDisplay}</span>
                  <ArrowUpRight size={10} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0 no-print" />
                </a>
              </div>
            </div>
          </motion.header>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 1: Summary                                      */}
          {/* ═══════════════════════════════════════════════════════ */}
          <motion.section
            className="resume-section py-5 border-t border-border/60"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <SectionHeader title={summaryTitle} />
            <p className="text-xs sm:text-sm text-foreground/85 font-mono leading-loose">
              {vision}
            </p>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 2: Professional Experience                      */}
          {/* ═══════════════════════════════════════════════════════ */}
          <motion.section
            className="resume-section py-5 border-t border-border/60"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={2}
          >
            <SectionHeader title="Professional Experience" />

            <div className="space-y-7 sm:space-y-9">
              {experiences.map((item) => {
                const hasRoleAndCompany = Boolean(item.role && item.company);
                const sectionHeading = item.role || item.company;
                const hasLocationOrPeriod = Boolean(item.location || item.period);

                return (
                <div key={item.id} className="resume-experience-item">
                  {/* Role Header: Position | Company (or plain section heading) */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-sm sm:text-base text-foreground font-mono flex flex-wrap items-baseline gap-2">
                      {hasRoleAndCompany ? (
                        <>
                          <span className="font-bold text-foreground">{item.role}</span>
                          <span className="text-muted text-xs">|</span>
                          <span className="font-medium text-indigo-dark">{item.company}</span>
                        </>
                      ) : (
                        <span className="font-bold text-foreground">{sectionHeading}</span>
                      )}
                    </h3>
                  </div>

                  {/* Location & Period */}
                  {hasLocationOrPeriod && (
                    <p className="mt-0.5 text-xs font-mono text-muted flex flex-wrap items-center gap-2">
                      {item.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={11} className="text-indigo-dark shrink-0" />
                          {item.location}
                        </span>
                      ) : null}
                      {item.location && item.period ? (
                        <span className="text-border select-none">|</span>
                      ) : null}
                      {item.period ? (
                        <span>{item.period}{item.duration ? ` (${item.duration})` : ""}</span>
                      ) : null}
                    </p>
                  )}

                  {/* Bullets with Summary Callout */}
                  <ul className="mt-2.5 space-y-2.5 text-xs sm:text-sm font-mono text-muted leading-loose pl-0.5">
                    {item.bullets.map((bullet, bIdx) => {
                      const isSummaryBullet = bullet.category && /scope|summary/i.test(bullet.category);
                      if (isSummaryBullet) {
                        return (
                          <li key={bIdx} className="list-none pt-0.5 pb-1">
                            <div className="text-xs sm:text-sm font-mono text-foreground/90 bg-surface-alt/70 p-3 rounded-xl border-l-2 border-indigo-dark">
                              <strong className="font-bold text-foreground mr-1.5">
                                {renderInlineMarkdown(`${bullet.category}:`)}
                              </strong>
                              <span>{renderInlineMarkdown(bullet.text)}</span>
                            </div>
                          </li>
                        );
                      }
                      return (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-dark mt-1.5 shrink-0" />
                          <div>
                            {bullet.category && (
                              <strong className="font-bold text-foreground mr-1">
                                {renderInlineMarkdown(`${bullet.category}:`)}
                              </strong>
                            )}
                            <span className="text-foreground/85">
                              {renderInlineMarkdown(bullet.text)}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                );
              })}
            </div>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 3: Education                                    */}
          {/* ═══════════════════════════════════════════════════════ */}
          <motion.section
            className="resume-section py-5 border-t border-border/60"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <SectionHeader title="Education" />
            <ul className="space-y-2 text-xs sm:text-sm font-mono text-foreground/85">
              {education.map((edu, eduIdx) => (
                <li key={`${edu.institution}-${eduIdx}`} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-dark mt-1.5 shrink-0" />
                  <div>
                    <strong className="font-bold text-foreground mr-1.5">
                      {edu.institution}
                    </strong>
                    <span className="text-muted font-normal mr-1.5">|</span>
                    <span className="text-foreground/80">{edu.degree || (edu as unknown as { detail: string }).detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* SECTION 4: Skills & Toolkits (Bottom)                   */}
          {/* ═══════════════════════════════════════════════════════ */}
          {skillsList.length > 0 && (
            <motion.section
              className="resume-section py-5 border-t border-border/60"
              variants={sectionVariants}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <SectionHeader title="Skills & Toolkits" />
              <ul className="space-y-2.5 text-xs sm:text-sm font-mono text-foreground/85">
                {skillsList.map((skillCat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-dark mt-1.5 shrink-0" />
                    <div>
                      <strong className="font-bold text-foreground mr-1.5">
                        {skillCat.category}:
                      </strong>
                      <span className="text-foreground/80">{skillCat.skills}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.section>
          )}
        </article>
      </main>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* FOOTER ACTIONS (Outside Resume, No-Print)                  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <footer className="max-w-4xl mx-auto mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Direct Download as PDF Link */}
          <a
            href="/Tyler_Lindow_Resume.pdf"
            download="Tyler_Lindow_Resume.pdf"
            onClick={() => logResumeView("download_pdf")}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-dark text-sand hover:bg-labs-primary-dark px-6 py-3 text-xs sm:text-sm font-mono font-bold shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Download compiled resume as PDF"
          >
            <Download size={15} />
            <span>Download as PDF</span>
          </a>

          {/* Browser Print / Save as PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface hover:bg-surface-alt text-foreground border border-border hover:border-indigo/40 px-4 py-3 text-xs font-mono font-medium shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Open browser print dialog to print or save PDF"
          >
            <Printer size={13} className="text-muted" />
            <span>Print</span>
          </button>

          {/* Secondary Copy Markdown Button */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface hover:bg-surface-alt text-foreground border border-border hover:border-indigo/40 px-4 py-3 text-xs font-mono font-medium shadow-sm transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            title="Copy raw markdown to clipboard"
          >
            {copiedMd ? (
              <>
                <Check size={13} className="text-sky" />
                <span>Copied .md</span>
              </>
            ) : (
              <>
                <Copy size={13} className="text-muted" />
                <span>Copy .md</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-muted">
          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-dark transition-colors"
          >
            LinkedIn
          </a>
          <span>&bull;</span>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-dark transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
