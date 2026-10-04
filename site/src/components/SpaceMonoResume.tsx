"use client";

import { useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Github,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import {
  resumeContact,
  professionalSummary,
  professionalExperience,
  educationList,
} from "@/data/resumeData";
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
  const [revealPhone, setRevealPhone] = useState(false);

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

  return (
    <div className="bg-background text-foreground pt-1 pb-8 sm:pb-12 px-3 sm:px-6 print:py-0 print:px-0 print:min-h-0">
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

    </div>
  );
}
