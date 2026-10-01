import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import SpaceMonoResume from "@/components/SpaceMonoResume";
import Navbar from "@/components/Navbar";
import PageAudioPlayer from "@/components/PageAudioPlayer";
import { PAGE_AUDIO_ENABLED, pageAudio, pageAudioLabel } from "@/data/pageAudio";
import { parsedResume } from "@/data/resumeMarkdown";

export const metadata: Metadata = {
  title: "Resume | Tyler Lindow (Engineering Manager | Fintech Platform & 0→1 | Ex-Founder)",
  description:
    "Fintech engineering manager with 6+ years at Affirm across Partner Engineering, merchant onboarding, and marketing products. Ex-founder (Beginner Work Inc.).",
  openGraph: {
    title: "Resume | Tyler Lindow (Engineering Manager | Fintech Platform & 0→1 | Ex-Founder)",
    description:
      "Fintech engineering manager with 6+ years at Affirm across Partner Engineering, merchant onboarding, and marketing products. Ex-founder (Beginner Work Inc.).",
    url: "https://tlindow.github.io/resume",
    siteName: "Tyler Lindow",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume | Tyler Lindow (Engineering Manager | Fintech Platform & 0→1 | Ex-Founder)",
    description:
      "Fintech engineering manager with 6+ years at Affirm across Partner Engineering, merchant onboarding, and marketing products. Ex-founder (Beginner Work Inc.).",
  },
};

export default function ResumePageRoute() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono print:min-h-0 print:bg-white print:p-0 print:m-0">
      <Navbar />
      <div className="pt-20 sm:pt-24 max-w-4xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6 no-print">
        <a
          href={`${basePath}/`}
          className="group inline-flex items-center gap-2 text-xs font-mono font-medium rounded-full bg-surface hover:bg-surface-alt px-3.5 py-1.5 border border-border hover:border-indigo/40 text-muted hover:text-foreground shadow-2xs transition-all duration-200"
        >
          <ArrowLeft size={13} className="text-indigo-dark transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Home</span>
        </a>
      </div>
      {PAGE_AUDIO_ENABLED ? (
        <div className="no-print max-w-4xl mx-auto px-4 sm:px-6 pb-2 sm:pb-4">
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
    </div>
  );
}
