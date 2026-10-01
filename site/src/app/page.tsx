"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScroll, useMotionValue, useSpring } from "framer-motion";
import { FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageAudioPlayer, { pageAudioLabel } from "@/components/PageAudioPlayer";
import {
  TrustedPartnersBar,
  EducationInstitutionsBar,
} from "@/components/brand/PartnerLogos";
import About from "@/components/About";
import WhatYouGet from "@/components/WhatYouGet";
import Footer from "@/components/Footer";
import ScrollMorphAvatar, {
  HERO_PIN_SCROLL_DISTANCE,
} from "@/components/animations/ScrollMorphAvatar";
import { useAnalytics } from "@/context/AnalyticsProvider";
import { pageAudio } from "@/data/pageAudio";
import { SITE_SUPPORT } from "@/data/positioning";

export default function Home() {
  const { scrollY } = useScroll();
  const rawProgress = useMotionValue(0);
  const avatarProgress = useSpring(rawProgress, {
    stiffness: 220,
    damping: 24,
    mass: 0.4,
  });

  const rawContactProgress = useMotionValue(0);
  const contactProgress = useSpring(rawContactProgress, {
    stiffness: 220,
    damping: 24,
    mass: 0.4,
  });

  const hasReachedContactRef = useRef(false);
  const wasAtTopRef = useRef(false);
  const prevYRef = useRef(0);
  const directToHero = useMotionValue(0);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const { logResumeView } = useAnalytics();

  const computeContactTargetScrollY = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const contactEl = document.getElementById("contact-avatar-target");
    if (!contactEl) return 0;
    const rect = contactEl.getBoundingClientRect();
    const contactAbsoluteY = rect.top + window.scrollY;
    return contactAbsoluteY - window.innerHeight * 0.5;
  }, []);

  const computeContactProgress = useCallback(
    (latestY: number) => {
      const targetMidScrollY = computeContactTargetScrollY();
      if (targetMidScrollY <= 0) return 0;
      const transitDistance = Math.min(
        320,
        typeof window !== "undefined" ? window.innerHeight * 0.45 : 320
      );
      const startScrollY = targetMidScrollY - transitDistance;

      if (latestY <= startScrollY) return 0;
      if (latestY >= targetMidScrollY) return 1;
      return (latestY - startScrollY) / transitDistance;
    },
    [computeContactTargetScrollY]
  );

  // If page loads already scrolled down, initialize progress appropriately
  useEffect(() => {
    if (typeof window !== "undefined") {
      const heroP = Math.min(Math.max(window.scrollY / HERO_PIN_SCROLL_DISTANCE, 0), 1);
      rawProgress.set(heroP);
      avatarProgress.jump(heroP);

      requestAnimationFrame(() => {
        const contactTargetScrollY = computeContactTargetScrollY();
        if (contactTargetScrollY > 0 && window.scrollY >= contactTargetScrollY - 20) {
          hasReachedContactRef.current = true;
          directToHero.set(1);
        }

        const contactP = computeContactProgress(window.scrollY);
        rawContactProgress.set(contactP);
        contactProgress.jump(contactP);
      });
    }
  }, [
    rawProgress,
    avatarProgress,
    rawContactProgress,
    contactProgress,
    directToHero,
    computeContactTargetScrollY,
    computeContactProgress,
  ]);

  // Synchronize avatar & navbar progress with scroll position:
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latestY) => {
      const contactTargetScrollY = computeContactTargetScrollY();
      const isScrollingDown = latestY > prevYRef.current;
      prevYRef.current = latestY;

      // 1. Once profile picture has reached the "Let's talk" section:
      // engage direct-to-hero mode for any subsequent upward scroll
      if (contactTargetScrollY > 0 && latestY >= contactTargetScrollY - 20) {
        hasReachedContactRef.current = true;
        wasAtTopRef.current = false;
        directToHero.set(1);
      }

      // 2. If direct-to-hero mode is active:
      if (hasReachedContactRef.current) {
        // Keep nav and contact springs strictly at 0 so no phantom values can pull avatar
        rawProgress.set(0);
        avatarProgress.jump(0);
        rawContactProgress.set(0);
        contactProgress.jump(0);

        // Keep directToHero engaged as avatar travels to and stays at top center hero
        directToHero.set(1);

        if (latestY <= 5) {
          wasAtTopRef.current = true;
        }

        // Only start a fresh downward journey once the user has been at top (<= 5)
        // AND then intentionally scrolls back DOWN past 25px:
        if (wasAtTopRef.current && isScrollingDown && latestY > 25) {
          hasReachedContactRef.current = false;
          wasAtTopRef.current = false;
          directToHero.set(0);
          const heroP = Math.min(Math.max(latestY / HERO_PIN_SCROLL_DISTANCE, 0), 1);
          rawProgress.set(heroP);
        }
      } else {
        // Normal downward flow (Hero -> Nav -> Contact):
        const heroP = Math.min(Math.max(latestY / HERO_PIN_SCROLL_DISTANCE, 0), 1);
        rawProgress.set(heroP);

        const contactP = computeContactProgress(latestY);
        rawContactProgress.set(contactP);
      }
    });

    return () => unsubscribe();
  }, [
    scrollY,
    rawProgress,
    avatarProgress,
    rawContactProgress,
    contactProgress,
    directToHero,
    computeContactTargetScrollY,
    computeContactProgress,
  ]);

  // Handle window resizing or dynamic layout changes
  useEffect(() => {
    const handleLayoutChange = () => {
      if (typeof window !== "undefined") {
        const contactP = computeContactProgress(window.scrollY);
        rawContactProgress.set(contactP);
      }
    };

    window.addEventListener("resize", handleLayoutChange);
    const observer = new ResizeObserver(handleLayoutChange);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("resize", handleLayoutChange);
      observer.disconnect();
    };
  }, [rawContactProgress, computeContactProgress]);

  const handleReturnToHero = () => {
    hasReachedContactRef.current = true;
    wasAtTopRef.current = false;
    directToHero.set(1);
    rawProgress.set(0);
    avatarProgress.jump(0);
    rawContactProgress.set(0);
    contactProgress.jump(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Keep body/overscroll in sync with the homepage purple surface only.
  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "#F3EEF8";
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  return (
    <div className="homepage-theme min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between overflow-x-clip">
      {/* Scroll-animated profile picture bridging hero, navbar, and contact section */}
      <ScrollMorphAvatar
        progress={avatarProgress}
        contactProgress={contactProgress}
        directToHero={directToHero}
        onReturnToHero={handleReturnToHero}
      />

      {/* ========================================================= */}
      {/* 1. TOP NAVIGATION BAR (FIXED, NO-PRINT) */}
      {/* ========================================================= */}
      <Navbar
        progress={avatarProgress}
        contactProgress={contactProgress}
        directToHero={directToHero}
        onReturnToHero={handleReturnToHero}
      />

      {/* ========================================================= */}
      {/* 2. MAIN VIEW */}
      {/* ========================================================= */}
      <div className="no-print w-full">
        <main className="w-full">
          <PageAudioPlayer
            src={pageAudio["/"].src}
            label={pageAudioLabel(pageAudio["/"].durationSeconds)}
          />

          {/* FULL PAGE HERO HEADER SECTION */}
          <header
            id="hero"
            className="flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto space-y-6 sm:space-y-8 relative pt-4 sm:pt-6 pb-12 sm:pb-16 scroll-mt-20"
          >
            {/* Typographic Product Title */}
            <div className="space-y-4 sm:space-y-6 text-center max-w-4xl mx-auto flex flex-col items-center">
              {/* Enlarged Profile Picture Slot Centered Above ex-affirm, ex-founder */}
              <div
                id="hero-avatar-anchor"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 relative"
              />

              <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest block">
                ex-Affirm, ex-founder
              </span>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.05] mx-auto">
                <span className="block">Elevating</span>
                <span className="block">capital-tech</span>
              </h1>

              <div className="pt-2">
                <p className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto">
                  {SITE_SUPPORT}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <a
                href={`${basePath}/resume`}
                onClick={() => logResumeView("hero_cta")}
                className="inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                title="Read Tyler Lindow's resume"
              >
                <FileText size={15} className="shrink-0" />
                <span>Read resume</span>
              </a>
            </div>

            {/* Trusted Partners (Previous Employers) */}
            <div id="trusted-partners" className="w-full scroll-mt-24">
              <TrustedPartnersBar />
            </div>

            {/* Educational Institutions */}
            <div id="education" className="w-full scroll-mt-24">
              <EducationInstitutionsBar />
            </div>
          </header>

          <About />

          {/* ======================================================= */}
          {/* 2. VALUE PROPOSITION: WHAT YOU GET IF YOU BUY ME       */}
          {/* ======================================================= */}
          <WhatYouGet />
        </main>
      </div>

      {/* ========================================================= */}
      {/* 4. FOOTER (LET'S TALK, PHILOSOPHY)                        */}
      {/* ========================================================= */}
      <Footer />
    </div>
  );
}
