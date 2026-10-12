"use client";

import { useEffect } from "react";
import { FileText } from "lucide-react";
import Footer from "@/components/Footer";
import ScrollMorphAvatar from "@/components/animations/ScrollMorphAvatar";
import ScrollMorphPlayButton from "@/components/animations/ScrollMorphPlayButton";
import RetreatWaveform from "@/components/retreat/RetreatWaveform";
import LeadersBody from "@/components/leaders/LeadersBody";
import {
  EducationInstitutionsBar,
  KeyTopicsBar,
  MyEnterpriseToolkitBar,
  TrustedPartnersBar,
} from "@/components/brand/PartnerLogos";
import { useAnalytics } from "@/context/AnalyticsProvider";
import {
  ENGINEERING_LEADERS_CONTACT_BLURB,
  ENGINEERING_LEADERS_DESCRIPTION,
  ENGINEERING_LEADERS_HEADLINE,
  ENGINEERING_LEADERS_KICKER,
  ENGINEERING_LEADERS_PHILOSOPHY_BOOK,
  ENGINEERING_LEADERS_STACK_LABEL,
  ENGINEERING_LEADERS_TOPICS,
  ENGINEERING_LEADERS_TOPICS_LABEL,
} from "@/data/engineeringLeadersPage";
import {
  RESUME_PDF_DOWNLOAD_NAME,
  RESUME_PDF_PATH,
} from "@/data/urls";

/** Cream paper surface from the earlier retreat leaf (not homepage lavender). */
const RETREAT_CREAM = "#FFFDF7";

/**
 * /engineering-leaders: homepage-hero sibling (coin + play, mono display) on
 * cream paper, then leader-framed sections + Let's talk footer.
 */
export default function RetreatPage() {
  const { logResumeView } = useAnalytics();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = RETREAT_CREAM;
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between overflow-x-clip">
      <ScrollMorphAvatar />
      <ScrollMorphPlayButton />

      <div className="no-print w-full">
        <main className="w-full">
          <header
            id="hero"
            className="@container relative text-center px-4 max-w-5xl mx-auto scroll-mt-20 min-w-0 w-full overflow-x-clip"
            data-retreat="stage"
          >
            <div
              id="hero-stage"
              className="grid h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)] grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] justify-items-center min-w-0 w-full"
            >
              <div className="flex flex-col items-center justify-end gap-3 sm:gap-4 w-full min-h-0 pb-3 sm:pb-4">
                <div className="relative">
                  <div
                    id="hero-avatar-anchor"
                    data-profile-anchor="hero"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 relative"
                  />
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 sm:ml-4">
                    <div
                      id="hero-play-anchor"
                      className="h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest block">
                  {ENGINEERING_LEADERS_KICKER}
                </span>
              </div>

              <h1 className="w-full max-w-full min-w-0 px-0.5 text-[length:clamp(1.05rem,min(6.2cqi,calc(100cqi/15.5)),4.7rem)] font-black tracking-tight text-foreground leading-[1.08] mx-auto overflow-x-clip">
                <span className="block">{ENGINEERING_LEADERS_HEADLINE}</span>
                <span
                  className="block invisible select-none pointer-events-none"
                  aria-hidden="true"
                >
                  {"\u00a0"}
                </span>
              </h1>

              <div
                id="hero-below"
                className="flex flex-col items-center justify-start gap-5 sm:gap-6 w-full min-h-0 min-w-0 max-w-full pt-3 sm:pt-4 pb-8 sm:pb-10"
              >
                {/*
                  Pull the waveform into the h1 trailing spacer line (same
                  clamp/leading as the headline) so description → Download
                  resume matches homepage subtitle → Download resume on desktop.
                */}
                <div className="w-full min-w-0 max-w-full -mt-[calc(1.08*clamp(1.05rem,min(6.2cqi,calc(100cqi/15.5)),4.7rem))]">
                  <RetreatWaveform />
                </div>

                <p
                  className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto w-full max-w-full min-w-0 text-pretty px-1"
                  data-retreat="description"
                >
                  {ENGINEERING_LEADERS_DESCRIPTION}
                </p>

                <a
                  href={`${basePath}${RESUME_PDF_PATH}`}
                  download={RESUME_PDF_DOWNLOAD_NAME}
                  onClick={() => logResumeView("download_pdf")}
                  data-retreat="download-resume"
                  className="inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Download Tyler Lindow's resume PDF"
                >
                  <FileText size={15} className="shrink-0" />
                  <span>Download resume</span>
                </a>

                {/* Same shared credentials strip as homepage (can't drift). */}
                <div
                  id="trusted-partners"
                  className="w-full min-w-0 max-w-full scroll-mt-24"
                >
                  <TrustedPartnersBar />
                  <div
                    id="education"
                    className="w-full min-w-0 max-w-full scroll-mt-24"
                  >
                    <EducationInstitutionsBar />
                  </div>
                </div>

                {/* Kept pending owner keep/remove; below shared credentials. */}
                <div
                  className="w-full min-w-0 max-w-full"
                  data-leaders="toolkit-topics-pending"
                >
                  <MyEnterpriseToolkitBar
                    label={ENGINEERING_LEADERS_STACK_LABEL}
                  />
                  <KeyTopicsBar
                    label={ENGINEERING_LEADERS_TOPICS_LABEL}
                    topics={ENGINEERING_LEADERS_TOPICS}
                  />
                </div>
              </div>
            </div>
            <div
              id="hero-overflow-spacer"
              className="w-full"
              aria-hidden="true"
            />
          </header>

          <LeadersBody />
        </main>
      </div>

      <Footer
        profilePhotoAnchor
        contactBlurb={ENGINEERING_LEADERS_CONTACT_BLURB}
        philosophyBook={ENGINEERING_LEADERS_PHILOSOPHY_BOOK}
      />
    </div>
  );
}
