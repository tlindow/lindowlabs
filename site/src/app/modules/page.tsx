import type { Metadata } from "next";
import Link from "next/link";
import DraggableResumeCanvas from "@/components/modules/DraggableResumeCanvas";
import { GoogleQuadDivider } from "@/components/modules/ModuleCards";
import { ArrowLeft, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Story deck: Tyler Lindow",
  description:
    "Lean public story for Tyler Lindow. The working resume is maintained in Formation.",
  openGraph: {
    title: "Story deck: Tyler Lindow",
    description:
      "Lean public story for Tyler Lindow. The working resume is maintained in Formation.",
    url: "https://tlindow.github.io/modules",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Story deck: Tyler Lindow",
    description:
      "Lean public story for Tyler Lindow. The working resume is maintained in Formation.",
  },
};

export default function ResumeModulesPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#202124] py-8 sm:py-16 px-3 sm:px-6 print:py-0 print:px-0 print:min-h-0 print:bg-white">
      <div className="max-w-4xl mx-auto print:max-w-none print:m-0 print:p-0">
        {/* Google M3 Top Breadcrumb & Switcher Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#5F6368] hover:text-[#1A73E8] transition-colors uppercase tracking-wider font-semibold"
            >
              <ArrowLeft size={13} />
              <span>Home</span>
            </Link>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#202124] font-mono">
              Story deck
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#5F6368] font-mono">
              A lean public story. The working resume is maintained in Formation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-xs font-mono font-bold border border-[#D2E3FC] shadow-2xs">
              <Sparkles size={13} className="text-[#1A73E8]" />
              <span>Material 3 Deck</span>
            </span>
          </div>
        </header>

        {/* Google Quad-Color Spectrum Divider */}
        <GoogleQuadDivider className="mb-6 h-[3px] no-print" />

        {/* Draggable & Stackable Workbench Canvas */}
        <DraggableResumeCanvas />
      </div>
    </div>
  );
}
