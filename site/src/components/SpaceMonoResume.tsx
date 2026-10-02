"use client";

import { useState } from "react";
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

const FALLBACK_RAW_MARKDOWN = `# Tyler Lindow
**Engineering Manager | Fintech Platform & 0→1 | Ex-Founder**
San Diego, CA | Open to relocation
(650) 580-5788 | tyler.lindow@gmail.com
[linkedin.com/in/tlindow](https://linkedin.com/in/tlindow) | [github.com/tlindow](https://github.com/tlindow)

---

## Vision
To elevate the creative and financial position of software developers through education, in-person connection, and creating safe spaces to build business ideas.

**Technical Toolkit:** Python, PyTorch, JavaScript, React, Node.js, Flask, LLMs & RAG, Agentic Coding Frameworks, Snowflake, Vercel, Cursor, IntelliJ IDEA, VS Code, SRE Support, Jules, Antigravity, Luma.

**Business & GTM Toolkit:** Developer Advocacy & Evangelism, Partner Engineering, Enterprise Merchant Integrations ($10B+ Portfolio), GMV Attribution & Revenue Acceleration, Go-To-Market (GTM) Strategy, Developer Paved Paths & Enablement, Cross-Functional Stakeholder Alignment, Voice of the Developer Synthesis, Multi-City Field Research & Customer Discovery, Technical Community Architecture.

---

## Professional Experience

### Beginner | Founder, Developer Relations
*San Diego, CA | Mar 2026 – Jul 2026 (5 mos)*
* **Developer Engagement:** Built and launched a progressive web app enabling technical founders to refine pitches and practice fundraising in-person with potential customers, successfully acquiring initial paying users.
* **Community Architecture:** Established a local technical network by hosting targeted networking events for product-focused tech professionals and engineers in the San Diego ecosystem.
* **Market Advocacy:** Traveled across major tech hubs (NYC, SF) - including weekly trips to LA over a 2-month period - to conduct user research, gather developer feedback, and evangelize the product framework directly to target audiences.

### Affirm | Software Engineering Manager (L7), Merchant Advocacy
*San Diego, CA (Remote) | Mar 2025 – Feb 2026*
* **Program Orchestration:** Directed a high-pressure, 5-week strategic website revamp (affirm.com), unifying engineering, design, and product content to successfully unlock critical GMV attribution features.
* **Cross-Functional Performance:** Facilitated engineering trade-offs throughout the revamp to optimize mobile performance, driving an incremental **$500K GMV** during key promotional windows.
* **First-Principles GenAI Upskilling:** Spearheaded organizational adoption of LLM code-generation utilities and agentic frameworks via a constructionist, "learning-by-doing" pedagogy. Overcame engineer skepticism to accelerate high-risk project deliverables ahead of Black Friday/Cyber Monday deadlines.
* **Stakeholder Alignment:** Mediated and resolved complex technical conflicts across Manager, Director, and Staff+ levels to unblock a critical platform re-architecture and secure final technical sign-off.

### Affirm | Developer Support Engineering Manager (L6/L7), Partner Engineering
*San Diego, CA (Remote) | Jul 2021 – Mar 2025*
* **Developer Empathy & SRE Transition:** Transformed a global support operation into a proactive development and SRE support function, systemizing 80% of operational workflows and scaling the team from 1 to 6 engineers to protect high-volume GMV.
* **Voice of the Developer:** Advocated for enterprise merchant needs across a **$10B+** strategic partner portfolio, synthesizing integration bugs into systemic root causes. Translated developer friction into the language of revenue to secure product prioritization.
* **Data-Driven Advocacy:** Developed a full-stack reporting and analytics suite (Python, Flask, Snowflake) removing 16 hours of manual overhead monthly and shifting to a proactive integration strategy.

### Affirm | Developer Support Engineer (L4/L5), Partner Engineering
*San Francisco, CA (Hybrid) | Sept 2019 – Jul 2021*
* **Technical Translation & Liaison:** Served as the primary technical point of contact for enterprise merchants; established the foundation for data-driven developer advocacy by diagnosing B2B integration bugs and translating them into actionable platform solutions to eliminate partner churn.

### Galvanize Inc | Lead Software Engineering Immersive Resident
*San Francisco, CA | May 2019 – Aug 2019*
* **Developer Onboarding:** Mentored a cohort of ~20 incoming Hack Reactor students, guiding them through practical JavaScript application development, Git/GitHub best practices, and foundational developer workflows.
* **Empathetic Code Review:** Managed multi-repo grading and delivered constructive, rigorous code reviews, building psychological safety and technical confidence for career transitioners entering the industry.

---

## Education
* **Northwestern University** | Graduate Coursework, Learning Sciences
* **University of California, San Diego** | B.S. NanoEngineering – *Cum Laude*
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
    { category: "Product & GTM Strategy", skills: "Developer Advocacy & Evangelism, Partner Engineering, Enterprise Merchant Integrations ($10B+ Portfolio), GMV Attribution & Revenue Acceleration, GTM Strategy, Developer Paved Paths & Enablement, Cross-Functional Stakeholder Alignment, Voice of the Developer Synthesis, Technical Community Architecture." }
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
              {experiences.map((item) => (
                <div key={item.id} className="resume-experience-item">
                  {/* Role Header: Position | Company */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-sm sm:text-base text-foreground font-mono flex flex-wrap items-baseline gap-2">
                      <span className="font-bold text-foreground">{item.role}</span>
                      <span className="text-muted text-xs">|</span>
                      <span className="font-medium text-indigo-dark">{item.company}</span>
                    </h3>
                  </div>

                  {/* Location & Period */}
                  <p className="mt-0.5 text-xs font-mono text-muted flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} className="text-indigo-dark shrink-0" />
                      {item.location}
                    </span>
                    <span className="text-border select-none">|</span>
                    <span>{item.period}{item.duration ? ` (${item.duration})` : ""}</span>
                  </p>

                  {/* Bullets with Summary Callout */}
                  <ul className="mt-2.5 space-y-2.5 text-xs sm:text-sm font-mono text-muted leading-loose pl-0.5">
                    {item.bullets.map((bullet, bIdx) => {
                      const isSummaryBullet = bullet.category && /scope|summary/i.test(bullet.category);
                      if (isSummaryBullet) {
                        return (
                          <li key={bIdx} className="list-none pt-0.5 pb-1">
                            <div className="text-xs sm:text-sm font-mono text-foreground/90 bg-surface-alt/70 p-3 rounded-xl border-l-2 border-indigo-dark">
                              <strong className="font-bold text-foreground mr-1.5">{bullet.category}:</strong>
                              <span>{bullet.text}</span>
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
                                {bullet.category}:
                              </strong>
                            )}
                            <span className="text-foreground/85">{bullet.text}</span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
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
