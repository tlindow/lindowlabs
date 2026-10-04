import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";
import SpaceMonoResume from "@/components/SpaceMonoResume";
import Footer from "@/components/Footer";
import PageAudioPlayer from "@/components/PageAudioPlayer";
import { PAGE_AUDIO_ENABLED, pageAudio, pageAudioLabel } from "@/data/pageAudio";
import { FORMATION_SUMMARY, HEADLINE } from "@/data/positioning";
import { parsedResume } from "@/data/resumeMarkdown";

export const metadata: Metadata = {
  title: `Resume | Tyler Lindow (${HEADLINE})`,
  description: FORMATION_SUMMARY,
  openGraph: {
    title: `Resume | Tyler Lindow (${HEADLINE})`,
    description: FORMATION_SUMMARY,
    url: "https://tlindow.github.io/resume",
    siteName: "Tyler Lindow",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `Resume | Tyler Lindow (${HEADLINE})`,
    description: FORMATION_SUMMARY,
  },
};

export default function ResumePageRoute() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono print:min-h-0 print:bg-white print:p-0 print:m-0">
      <div className="pt-4 sm:pt-6 max-w-4xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6 no-print print:hidden flex flex-wrap items-center justify-end gap-3">
        <Link
          href="/schedule-time"
          className="inline-flex items-center gap-1.5 text-xs font-mono font-medium rounded-full bg-surface hover:bg-surface-alt px-3.5 py-1.5 border border-border hover:border-indigo/40 text-muted hover:text-foreground shadow-2xs transition-all duration-200"
          title="Book 30 minutes with Tyler Lindow"
        >
          <Calendar size={13} className="text-indigo-dark shrink-0" />
          <span>Book 30 minutes</span>
        </Link>
      </div>
      {PAGE_AUDIO_ENABLED ? (
        <div className="no-print print:hidden max-w-4xl mx-auto px-4 sm:px-6 pb-2 sm:pb-4">
          <PageAudioPlayer
            src={pageAudio["/resume"].src}
            label={pageAudioLabel(pageAudio["/resume"].durationSeconds)}
            className="w-full px-0 pt-0 pb-0"
          />
        </div>
      ) : null}
      <div className="print:pt-0 print:p-0 print:m-0">
        <SpaceMonoResume parsedResume={parsedResume} />
      </div>
      <div className="no-print print:hidden max-w-4xl mx-auto px-4 sm:px-6 pb-10 sm:pb-14 flex justify-center">
        <Link
          href="/schedule-time"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-foreground text-background hover:bg-foreground/90 shadow-xs"
          title="Book 30 minutes with Tyler Lindow"
        >
          <Calendar size={15} className="shrink-0" />
          <span>Book 30 minutes</span>
        </Link>
      </div>
      <Footer />
    </div>
  );
}
