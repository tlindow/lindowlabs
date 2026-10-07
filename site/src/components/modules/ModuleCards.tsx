"use client";

import React from "react";
import {
  GripVertical,
  MapPin,
  Mail,
  Github,
  ExternalLink,
} from "lucide-react";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import RevealPhone from "@/components/RevealPhone";
import {
  resumeContact,
  visionText,
  experiences,
  education,
  deckSections,
  type ResumeModuleItem,
  type UnifiedDeckCard,
} from "@/data/resumeData";

// Google 4-color Divider Component
export function GoogleQuadDivider({ className = "my-4" }: { className?: string }) {
  return (
    <div
      className={`h-[3px] w-full rounded-full opacity-90 ${className}`}
      style={{
        background:
          "linear-gradient(90deg, #4285F4 0%, #4285F4 25%, #EA4335 25%, #EA4335 50%, #FBBC05 50%, #FBBC05 75%, #34A853 75%, #34A853 100%)",
      }}
    />
  );
}

// 1. Google M3 Header & Contact Module Card
export function HeaderModuleCard() {
  return (
    <div>
      <div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-[#202124]">
          {resumeContact.name}
        </h1>
        <p className="mt-1.5 text-sm sm:text-base font-semibold text-[#1A73E8]">
          {resumeContact.title}
        </p>
        {resumeContact.subtitle && (
          <p className="mt-0.5 text-xs sm:text-sm text-[#5F6368] font-mono italic">
            {resumeContact.subtitle}
          </p>
        )}
      </div>

      {/* Contact Metadata Bar */}
      <div className="mt-3.5 pt-3 border-t border-[#DADCE0] space-y-2 text-xs sm:text-sm text-[#5F6368] font-mono">
        {/* Line 1: Location & Relocation */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="inline-flex items-center gap-1.5 text-[#202124]">
            <MapPin size={13} className="text-[#1A73E8] shrink-0" />
            <span>{resumeContact.location}</span>
          </span>
          {resumeContact.relocation && (
            <>
              <span className="text-[#DADCE0] select-none">•</span>
              <span className="px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] font-bold text-[11px] border border-[#D2E3FC]">
                {resumeContact.relocation}
              </span>
            </>
          )}
        </div>

        {/* Line 2: Phone | Email. "|" lives inside the email link so wrap never trails it. */}
        {(resumeContact.phone || resumeContact.email) ? (
          <div>
            {resumeContact.phone ? (
              <RevealPhone
                phone={resumeContact.phone}
                className="inline-flex items-center gap-1.5 text-[#202124]"
                iconClassName="text-[#1A73E8]"
                iconSize={13}
              />
            ) : null}
            {resumeContact.email ? (
              <a
                href={`mailto:${resumeContact.email}`}
                className="inline-flex items-center gap-1.5 text-[#202124] hover:text-[#1A73E8] transition-colors underline underline-offset-2"
              >
                {resumeContact.phone ? (
                  <span className="text-[#DADCE0] select-none no-underline" aria-hidden="true">
                    {"\u00A0|\u00A0"}
                  </span>
                ) : null}
                <Mail size={13} className="text-[#1A73E8]" />
                <span>{resumeContact.email}</span>
              </a>
            ) : null}
          </div>
        ) : null}

        {/* Line 3: LinkedIn | GitHub */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={resumeContact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#202124] hover:text-[#1A73E8] transition-colors underline underline-offset-2"
          >
            <LinkedInIcon size={13} className="text-[#1A73E8]" />
            <span>{resumeContact.linkedinDisplay}</span>
            <ExternalLink size={10} className="no-print" />
          </a>
          <span className="text-[#DADCE0] select-none">|</span>

          <a
            href={resumeContact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#202124] hover:text-[#1A73E8] transition-colors underline underline-offset-2"
          >
            <Github size={13} className="text-[#202124]" />
            <span>{resumeContact.githubDisplay}</span>
            <ExternalLink size={10} className="no-print" />
          </a>
        </div>
      </div>
    </div>
  );
}

// 2. Google M3 Vision Module Card
export function VisionModuleCard() {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#202124] mb-2.5">
        Vision
      </h2>
      <p className="text-xs sm:text-sm text-[#3C4043] font-mono leading-relaxed">
        {visionText}
      </p>
    </div>
  );
}

// 3. Google M3 Individual Experience Module Card
export function ExperienceModuleCard({ experienceId }: { experienceId?: string }) {
  const exp = experiences.find((e) => e.id === experienceId);
  if (!exp) return null;

  return (
    <div className="resume-experience-item font-mono">
      <div>
        <h3 className="text-sm sm:text-base font-bold text-[#202124] leading-snug">
          <span className="text-[#202124]">{exp.company}</span>
          <span className="text-[#DADCE0] font-normal mx-2 select-none">|</span>
          <span className="text-[#1A73E8]">{exp.role}</span>
        </h3>
      </div>
      <p className="mt-1 text-xs sm:text-sm text-[#5F6368] italic font-mono">
        {exp.locationAndPeriod}
      </p>
      <ul className="mt-3 space-y-2 text-xs sm:text-sm text-[#3C4043] font-mono leading-relaxed pl-1">
        {exp.bullets.map((b, bIdx) => (
          <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm">
            <span className="text-[#1A73E8] select-none font-bold text-xs sm:text-sm shrink-0 mt-0.5">
              •
            </span>
            <div className="text-xs sm:text-sm">
              <strong className="font-bold text-[#202124] mr-1">{b.tag}</strong>
              <span>{b.text}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 4. Google M3 Education Module Card
export function EducationModuleCard() {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#202124] mb-3.5 font-mono">
        Education
      </h2>
      <ul className="space-y-3 text-xs sm:text-sm text-[#3C4043] font-mono">
        {education.map((edu, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
            <span className="text-[#1A73E8] select-none font-bold text-xs sm:text-sm shrink-0 mt-0.5">
              •
            </span>
            <div className="text-xs sm:text-sm">
              <strong className="font-bold text-[#202124] mr-2">
                {edu.institution}
              </strong>
              <span className="text-[#DADCE0] font-normal mr-2 select-none">|</span>
              <span className="text-[#5F6368]">{edu.detail}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 5. Google Material 3 Pitch Deck Section Header Card
export function DeckSectionCard({ sectionId }: { sectionId?: string }) {
  const section = sectionId ? deckSections[sectionId] : null;
  if (!section) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-90">
          {`${section.slideNumber} // ${section.category}`}
        </span>
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
        {section.headline}
      </h2>
      <p className="text-xs sm:text-sm font-mono opacity-90 leading-relaxed max-w-2xl">
        {section.summary}
      </p>
    </div>
  );
}

// Google Material Design 3 Tonal Color Tokens
export const googleThemeStyles = {
  green: {
    card: "bg-[#E6F4EA] text-[#137333] border-[#CEEAD6]",
    badge: "bg-[#CEEAD6] text-[#0D652D] border-[#A8DAB5]",
    bar: "bg-[#1E8E3E]",
    handle: "text-[#137333]/60 hover:text-[#0D652D] hover:bg-[#CEEAD6]",
  },
  yellow: {
    card: "bg-[#FEF7E0] text-[#B06000] border-[#FEEFC3]",
    badge: "bg-[#FEEFC3] text-[#8A4800] border-[#FDD663]",
    bar: "bg-[#F9AB00]",
    handle: "text-[#B06000]/60 hover:text-[#8A4800] hover:bg-[#FEEFC3]",
  },
  blue: {
    card: "bg-[#E8F0FE] text-[#174EA6] border-[#D2E3FC]",
    badge: "bg-[#D2E3FC] text-[#1557B0] border-[#AECBFA]",
    bar: "bg-[#1A73E8]",
    handle: "text-[#174EA6]/60 hover:text-[#1557B0] hover:bg-[#D2E3FC]",
  },
  red: {
    card: "bg-[#FCE8E6] text-[#C5221F] border-[#FAD2CF]",
    badge: "bg-[#FAD2CF] text-[#A50E0E] border-[#F6AEA9]",
    bar: "bg-[#D93025]",
    handle: "text-[#C5221F]/60 hover:text-[#A50E0E] hover:bg-[#FAD2CF]",
  },
  purple: {
    card: "bg-[#F3E8FD] text-[#681DA8] border-[#E8D0FB]",
    badge: "bg-[#E8D0FB] text-[#501384] border-[#D7AEFB]",
    bar: "bg-[#8430CE]",
    handle: "text-[#681DA8]/60 hover:text-[#501384] hover:bg-[#E8D0FB]",
  },
};

// Unified Deck Card Renderer with Google Material 3 Design
export function UnifiedDeckCardRenderer({
  card,
  isDragging = false,
}: {
  card: UnifiedDeckCard;
  isDragging?: boolean;
}) {
  if (card.type === "profile") {
    return (
      <article
        className={`group relative rounded-3xl bg-[#FFFFFF] border border-[#DADCE0] p-6 sm:p-10 shadow-xs font-mono text-[#202124] leading-relaxed transition-all duration-200 ${
          isDragging
            ? "border-[#1A73E8] shadow-xl scale-[1.01] ring-2 ring-[#1A73E8]/20 z-30"
            : "hover:border-[#1A73E8]/50 hover:shadow-md"
        }`}
      >
        <div
          className="absolute top-4 right-4 text-[#5F6368] hover:text-[#1A73E8] transition-colors p-2 rounded-full hover:bg-[#E8F0FE] cursor-grab active:cursor-grabbing select-none no-print"
          title="Drag to reorder profile card"
          aria-label="Drag handle"
        >
          <GripVertical size={16} />
        </div>
        <div className="pr-4 sm:pr-6">
          <HeaderModuleCard />
        </div>
      </article>
    );
  }

  const section = card.sectionId ? deckSections[card.sectionId] : null;
  const theme = section ? googleThemeStyles[section.theme] : googleThemeStyles.blue;

  return (
    <article
      className={`group relative rounded-3xl bg-[#FFFFFF] border border-[#DADCE0] overflow-hidden shadow-xs font-mono text-[#202124] leading-relaxed transition-all duration-200 ${
        isDragging
          ? "border-[#1A73E8] shadow-2xl scale-[1.01] ring-2 ring-[#1A73E8]/25 z-30"
          : "hover:border-[#1A73E8]/50 hover:shadow-md"
      }`}
    >
      {/* Top Google M3 Tonal Section Banner */}
      {section && (
        <div className={`p-6 sm:p-7 border-b ${theme.card} relative`}>
          {/* Drag Handle */}
          <div
            className={`absolute top-4 right-4 transition-colors p-2 rounded-full cursor-grab active:cursor-grabbing select-none no-print ${theme.handle}`}
            title="Drag to reorder section card"
            aria-label="Drag handle"
          >
            <GripVertical size={16} />
          </div>

          <div className="space-y-2 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-widest uppercase opacity-90">
                {`${section.slideNumber} // ${section.category}`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
              {section.headline}
            </h2>
            <p className="text-xs sm:text-sm font-mono opacity-90 leading-relaxed max-w-2xl">
              {section.summary}
            </p>
          </div>
        </div>
      )}

      {/* Embedded Resume Content */}
      <div className="p-6 sm:p-8 bg-[#FFFFFF]">
        {card.type === "thesis" && (
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-[#202124] mb-2 font-mono">
              Vision Statement
            </h3>
            <p className="text-xs sm:text-sm text-[#3C4043] font-mono leading-relaxed">
              {visionText}
            </p>
          </div>
        )}

        {card.type === "venture" && (
          <div>
            <ExperienceModuleCard experienceId="beginner" />
          </div>
        )}

        {card.type === "scale" && (
          <div className="space-y-7">
            <ExperienceModuleCard experienceId="affirm-swe-mgr" />
            <GoogleQuadDivider />
            <ExperienceModuleCard experienceId="affirm-dse-mgr" />
          </div>
        )}

        {card.type === "ecosystem" && (
          <div className="space-y-7">
            <ExperienceModuleCard experienceId="affirm-dse" />
            <GoogleQuadDivider />
            <ExperienceModuleCard experienceId="galvanize-lead-swe" />
            <GoogleQuadDivider />
            <ExperienceModuleCard experienceId="tech-interactive" />
            <GoogleQuadDivider />
            <ExperienceModuleCard experienceId="computer-history-museum" />
          </div>
        )}

        {card.type === "foundations" && (
          <div>
            <EducationModuleCard />
          </div>
        )}
      </div>
    </article>
  );
}

// Module Card Wrapper with Google M3 Styling
export default function ModuleCardRenderer({
  module,
  isDragging = false,
}: {
  module: ResumeModuleItem;
  isDragging?: boolean;
}) {
  // If it's a VC deck section header card:
  if (module.type === "deck-section" && module.sectionId) {
    const section = deckSections[module.sectionId];
    const theme = section ? googleThemeStyles[section.theme] : googleThemeStyles.blue;

    return (
      <article
        className={`group relative rounded-3xl border p-6 sm:p-8 font-mono leading-relaxed transition-all duration-200 ${
          theme.card
        } ${
          isDragging
            ? "scale-[1.01] ring-2 ring-[#1A73E8]/30 shadow-2xl z-30"
            : "hover:shadow-md"
        }`}
      >
        {/* Drag handle */}
        <div
          className={`absolute top-4 right-4 transition-colors p-2 rounded-full cursor-grab active:cursor-grabbing select-none no-print ${theme.handle}`}
          title="Drag to reorder section header"
          aria-label="Drag handle"
        >
          <GripVertical size={16} />
        </div>

        {/* Content */}
        <div className="pr-6">
          <DeckSectionCard sectionId={module.sectionId} />
        </div>
      </article>
    );
  }

  const renderCardContent = () => {
    switch (module.type) {
      case "header":
        return <HeaderModuleCard />;
      case "vision":
        return <VisionModuleCard />;
      case "experience":
        return <ExperienceModuleCard experienceId={module.experienceId} />;
      case "education":
        return <EducationModuleCard />;
      default:
        return null;
    }
  };

  return (
    <article
      className={`group relative rounded-3xl bg-[#FFFFFF] border border-[#DADCE0] p-6 sm:p-10 shadow-xs font-mono text-[#202124] leading-relaxed transition-all duration-200 ${
        isDragging
          ? "border-[#1A73E8] shadow-xl scale-[1.01] ring-2 ring-[#1A73E8]/20 z-30"
          : "hover:border-[#1A73E8]/50 hover:shadow-md"
      }`}
    >
      {/* Drag handle */}
      <div
        className="absolute top-4 right-4 text-[#5F6368] hover:text-[#1A73E8] transition-colors p-2 rounded-full hover:bg-[#E8F0FE] cursor-grab active:cursor-grabbing select-none no-print"
        title="Drag to reorder section"
        aria-label="Drag handle"
      >
        <GripVertical size={16} />
      </div>

      {/* Content */}
      <div className="pr-4 sm:pr-6">{renderCardContent()}</div>
    </article>
  );
}
