"use client";

import React, { useState, useMemo } from "react";
import { Reorder } from "framer-motion";
import {
  RotateCcw,
  Copy,
  Check,
  Download,
  LayoutGrid,
  List,
  GripVertical,
  Layers,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  unifiedDeckCards,
  replicaResumeModules,
  deckSections,
  resumeContact,
  visionText,
  experiences,
  education,
  type UnifiedDeckCard,
  type ResumeModuleItem,
} from "@/data/resumeData";
import ModuleCardRenderer, { UnifiedDeckCardRenderer } from "./ModuleCards";
import StackableCardDeck from "./StackableCardDeck";

type LayoutMode = "deck" | "linear" | "bento";
type DeckViewMode = "tied-deck" | "atomic-modules";

export default function DraggableResumeCanvas() {
  const [deckViewMode, setDeckViewMode] = useState<DeckViewMode>("tied-deck");
  const [cards, setCards] = useState<UnifiedDeckCard[]>(unifiedDeckCards);
  const [atomicModules, setAtomicModules] = useState<ResumeModuleItem[]>(replicaResumeModules);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("deck");
  const [copiedMd, setCopiedMd] = useState(false);

  // Switch between Tied Deck Sections (6 cards) and Atomic Modules (10 cards)
  const handleSwitchViewMode = (mode: DeckViewMode) => {
    setDeckViewMode(mode);
    if (mode === "atomic-modules" && layoutMode === "deck") {
      setLayoutMode("linear");
    }
  };

  // Reset to initial chronological order
  const handleReset = () => {
    if (deckViewMode === "tied-deck") {
      setCards(unifiedDeckCards);
    } else {
      setAtomicModules(replicaResumeModules);
    }
  };

  // Helper to format an experience item to markdown
  const formatExpToMarkdown = (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return "";
    return `### ${exp.company} | ${exp.role}
*${exp.locationAndPeriod}*
${exp.bullets.map((b) => `* **${b.tag}** ${b.text}`).join("\n")}

`;
  };

  // Generate dynamic Markdown reflecting current sequence
  const dynamicMarkdown = useMemo(() => {
    let md = "";

    if (deckViewMode === "tied-deck") {
      cards.forEach((card) => {
        const section = card.sectionId ? deckSections[card.sectionId] : null;

        if (card.type === "profile") {
          md += `# ${resumeContact.name}
**${resumeContact.title}**
${resumeContact.subtitle ? `*${resumeContact.subtitle}*\n` : ""}${resumeContact.location}${
            resumeContact.relocation ? ` - **${resumeContact.relocation}**` : ""
          }
${resumeContact.phone} | ${resumeContact.email}
[${resumeContact.linkedinDisplay}](${resumeContact.linkedin}) | [${resumeContact.githubDisplay}](${
            resumeContact.github
          })

---

`;
        } else if (section) {
          md += `## ${section.slideNumber} // ${section.category}: ${section.headline}
*${section.summary}*

`;

          if (card.type === "thesis") {
            md += `### Vision\n${visionText}\n\n`;
          } else if (card.type === "venture") {
            md += formatExpToMarkdown("beginner");
          } else if (card.type === "scale") {
            md += formatExpToMarkdown("affirm-swe-mgr");
            md += formatExpToMarkdown("affirm-dse-mgr");
          } else if (card.type === "ecosystem") {
            md += formatExpToMarkdown("affirm-dse");
            md += formatExpToMarkdown("galvanize-lead-swe");
            md += formatExpToMarkdown("tech-interactive");
            md += formatExpToMarkdown("computer-history-museum");
          } else if (card.type === "foundations") {
            md += `### Education\n${education
              .map((e) => `* **${e.institution}** | ${e.detail}`)
              .join("\n")}\n\n`;
          }

          md += `---\n\n`;
        }
      });
    } else {
      atomicModules.forEach((mod) => {
        switch (mod.type) {
          case "header":
            md += `# ${resumeContact.name}
**${resumeContact.title}**
${resumeContact.subtitle ? `*${resumeContact.subtitle}*\n` : ""}${resumeContact.location}${
              resumeContact.relocation ? ` - **${resumeContact.relocation}**` : ""
            }
${resumeContact.phone} | ${resumeContact.email}
[${resumeContact.linkedinDisplay}](${resumeContact.linkedin}) | [${resumeContact.githubDisplay}](${
              resumeContact.github
            })

---

`;
            break;

          case "vision":
            md += `## Vision\n${visionText}\n\n---\n\n`;
            break;

          case "experience":
            if (mod.experienceId) {
              md += formatExpToMarkdown(mod.experienceId);
            }
            break;

          case "education":
            md += `## Education\n${education
              .map((e) => `* **${e.institution}** | ${e.detail}`)
              .join("\n")}\n\n`;
            break;
        }
      });
    }

    return md;
  }, [cards, atomicModules, deckViewMode]);

  // Copy Markdown
  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(dynamicMarkdown);
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2200);
    } catch {
      setCopiedMd(true);
      setTimeout(() => setCopiedMd(false), 2200);
    }
  };

  // Print
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Google M3 Workspace Control Bar (no-print) */}
      <section className="no-print rounded-3xl bg-[#FFFFFF] border border-[#DADCE0] px-4 py-3 sm:px-6 sm:py-4 shadow-xs flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-[#5F6368]">
        <div className="flex items-center gap-2.5">
          <span className="p-1 rounded-full bg-[#E8F0FE] text-[#1A73E8]">
            <GripVertical size={15} />
          </span>
          <span className="text-[#202124] font-bold text-sm">
            {deckViewMode === "tied-deck" ? "Story stack" : "Story modules"}
          </span>
          <span className="text-[#DADCE0] select-none">•</span>
          <span>
            {deckViewMode === "tied-deck"
              ? `${cards.length} stackable chapter cards`
              : `${atomicModules.length} individual sections`}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google M3 Segmented Button: Deck View Mode */}
          <div className="flex items-center rounded-full bg-[#F1F3F4] border border-[#DADCE0] p-0.5">
            <button
              type="button"
              onClick={() => handleSwitchViewMode("tied-deck")}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer text-xs font-mono font-medium ${
                deckViewMode === "tied-deck"
                  ? "bg-[#1A73E8] text-white shadow-xs font-bold"
                  : "text-[#5F6368] hover:text-[#202124]"
              }`}
              title="Related sections tied together as stackable cards"
            >
              <Layers size={13} />
              <span>Stackable Cards</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchViewMode("atomic-modules")}
              className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-all cursor-pointer text-xs font-mono font-medium ${
                deckViewMode === "atomic-modules"
                  ? "bg-[#FFFFFF] text-[#202124] shadow-xs font-bold border border-[#DADCE0]"
                  : "text-[#5F6368] hover:text-[#202124]"
              }`}
              title="Individual atomic replica sections"
            >
              <FileText size={13} />
              <span>Atomic</span>
            </button>
          </div>

          {/* Google M3 Segmented Button: Layout Mode */}
          <div className="flex items-center rounded-full bg-[#F1F3F4] border border-[#DADCE0] p-0.5">
            {deckViewMode === "tied-deck" && (
              <button
                type="button"
                onClick={() => setLayoutMode("deck")}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-mono font-medium ${
                  layoutMode === "deck"
                    ? "bg-[#FFFFFF] text-[#1A73E8] shadow-xs font-bold border border-[#DADCE0]"
                    : "text-[#5F6368] hover:text-[#202124]"
                }`}
                title="3D Layered Card Stack"
              >
                <Sparkles size={13} className="text-[#1A73E8]" />
                <span>3D Stack</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setLayoutMode("linear")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-mono font-medium ${
                layoutMode === "linear"
                  ? "bg-[#FFFFFF] text-[#202124] shadow-xs font-bold border border-[#DADCE0]"
                  : "text-[#5F6368] hover:text-[#202124]"
              }`}
              title="Vertical Scroll Stack"
            >
              <List size={13} />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode("bento")}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full transition-all cursor-pointer text-xs font-mono font-medium ${
                layoutMode === "bento"
                  ? "bg-[#FFFFFF] text-[#202124] shadow-xs font-bold border border-[#DADCE0]"
                  : "text-[#5F6368] hover:text-[#202124]"
              }`}
              title="2-Column Grid"
            >
              <LayoutGrid size={13} />
              <span>Grid</span>
            </button>
          </div>

          {/* Reset Order */}
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F1F3F4] text-[#5F6368] hover:text-[#1A73E8] border border-[#DADCE0] transition-colors cursor-pointer"
            title="Reset to default order"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </section>

      {/* Main Canvas Area */}
      <main className="max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
        {deckViewMode === "tied-deck" && layoutMode === "deck" ? (
          /* 3D Stackable Card Deck */
          <StackableCardDeck cards={cards} onCardsChange={setCards} />
        ) : deckViewMode === "tied-deck" ? (
          /* Vertical or Grid Reorderable List of Tied Cards */
          <Reorder.Group
            axis="y"
            values={cards}
            onReorder={setCards}
            className={`space-y-6 ${
              layoutMode === "bento"
                ? "grid grid-cols-1 md:grid-cols-2 gap-6 space-y-0"
                : "space-y-6"
            }`}
          >
            {cards.map((card) => {
              const isFullSpan =
                layoutMode === "bento" &&
                (card.type === "profile" ||
                  card.type === "scale" ||
                  card.type === "ecosystem");

              return (
                <Reorder.Item
                  key={card.id}
                  value={card}
                  className={`list-none ${isFullSpan ? "md:col-span-2" : "col-span-1"}`}
                  whileDrag={{ scale: 1.015, zIndex: 40 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <UnifiedDeckCardRenderer card={card} />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        ) : (
          /* Atomic Individual Modules */
          <Reorder.Group
            axis="y"
            values={atomicModules}
            onReorder={setAtomicModules}
            className={`space-y-4 ${
              layoutMode === "bento"
                ? "grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0"
                : "space-y-4"
            }`}
          >
            {atomicModules.map((mod) => {
              const isFullSpan =
                layoutMode === "bento" &&
                (mod.type === "header" ||
                  mod.type === "vision" ||
                  mod.id === "module-exp-beginner" ||
                  mod.id === "module-exp-affirm-l7" ||
                  mod.type === "education");

              return (
                <Reorder.Item
                  key={mod.id}
                  value={mod}
                  className={`list-none ${isFullSpan ? "md:col-span-2" : "col-span-1"}`}
                  whileDrag={{ scale: 1.015, zIndex: 40 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <ModuleCardRenderer module={mod} />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>
        )}
      </main>

      {/* Google M3 Bottom Action Footer (no-print) */}
      <footer className="max-w-4xl mx-auto mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Google Blue Primary Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-full bg-[#1A73E8] text-white hover:bg-[#1557B0] active:bg-[#174EA6] px-6 py-3 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all cursor-pointer border border-[#1A73E8] hover:shadow-md active:scale-[0.98]"
            title="Print this story"
          >
            <Download size={15} />
            <span>Print story</span>
          </button>

          {/* Secondary Google Outlined Button */}
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FFFFFF] hover:bg-[#F1F3F4] text-[#202124] border border-[#DADCE0] px-5 py-3 text-xs font-mono font-medium transition-colors cursor-pointer shadow-2xs"
            title="Copy this story as markdown"
          >
            {copiedMd ? (
              <>
                <Check size={14} className="text-[#1E8E3E]" />
                <span className="text-[#1E8E3E] font-bold">Copied .md</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-[#5F6368]" />
                <span>Copy story</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#5F6368]">
          <a
            href={resumeContact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1A73E8] transition-colors"
          >
            LinkedIn
          </a>
          <span>&bull;</span>
          <a
            href={resumeContact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1A73E8] transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
