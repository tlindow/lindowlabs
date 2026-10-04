"use client";

import { useEffect, useRef, useCallback } from "react";
import { useScroll, useMotionValue, useSpring } from "framer-motion";
import { FileText } from "lucide-react";
import PageAudioPlayer from "@/components/PageAudioPlayer";
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
import { useRegisterReturnToHero } from "@/context/NavbarActions";
import { PAGE_AUDIO_ENABLED, pageAudio, pageAudioLabel } from "@/data/pageAudio";
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

  // When the below-h1 stack (support, CTA, logos) paints past the 100svh stage,
  // reserve matching flow space so About is not covered. Also ensure a minimum
  // gap below the logo panel (spill-only height left the panel flush on About).
  // Spacer lives outside the 100svh grid, so h1 stays at 50svh.
  useEffect(() => {
    const stage = document.getElementById("hero-stage");
    const below = document.getElementById("hero-below");
    const spacer = document.getElementById("hero-overflow-spacer");
    const panel = document.getElementById("trusted-partners");
    if (!stage || !below || !spacer) return;

    const syncOverflow = () => {
      const stageBottom = stage.getBoundingClientRect().bottom;
      // Grid row box can be shorter than painted children (overflow: visible).
      const contentBottom = Math.max(
        below.getBoundingClientRect().bottom,
        ...Array.from(below.children, (child) => child.getBoundingClientRect().bottom)
      );
      const spill = Math.max(0, Math.ceil(contentBottom - stageBottom));

      // ~2.5rem mobile / ~3.5rem desktop breathing room under the logo panel.
      const minGapPx = window.matchMedia("(min-width: 640px)").matches ? 56 : 40;
      const panelBottom = panel
        ? panel.getBoundingClientRect().bottom
        : contentBottom;
      // Natural lavender gap already inside the stage, below the panel.
      const naturalGap = stageBottom - panelBottom;
      // About starts at stageBottom + spacerHeight; require >= minGapPx under panel.
      const gapPad = Math.max(0, Math.ceil(minGapPx - naturalGap));
      spacer.style.height = `${Math.max(spill, gapPad)}px`;
    };

    syncOverflow();
    const ro = new ResizeObserver(syncOverflow);
    ro.observe(below);
    ro.observe(stage);
    if (panel) ro.observe(panel);
    window.addEventListener("resize", syncOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncOverflow);
    };
  }, []);

  const handleReturnToHero = useCallback(() => {
    hasReachedContactRef.current = true;
    wasAtTopRef.current = false;
    directToHero.set(1);
    rawProgress.set(0);
    avatarProgress.jump(0);
    rawContactProgress.set(0);
    contactProgress.jump(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [
    avatarProgress,
    contactProgress,
    directToHero,
    rawContactProgress,
    rawProgress,
  ]);

  useRegisterReturnToHero(handleReturnToHero);

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

      <div className="no-print w-full">
        <main className="w-full">
          {PAGE_AUDIO_ENABLED ? (
            <PageAudioPlayer
              src={pageAudio["/"].src}
              label={pageAudioLabel(pageAudio["/"].durationSeconds)}
            />
          ) : null}

          {/* FULL PAGE HERO: fill viewport under sticky nav so 1fr rows resolve */}
          <header
            id="hero"
            className="@container relative text-center px-4 max-w-5xl mx-auto scroll-mt-20"
          >
            <div
              id="hero-stage"
              className="grid h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)] grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] justify-items-center"
            >
              {/* Above: photo + label, pinned to the bottom of the top 1fr */}
              <div className="flex flex-col items-center justify-end gap-3 sm:gap-4 w-full min-h-0 pb-3 sm:pb-4">
                <div
                  id="hero-avatar-anchor"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 relative"
                />

                <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest block">
                  ex-Affirm, ex-founder
                </span>
              </div>

              {/* Fluid size: fixed text-4xl..8xl overflowed Space Mono black at common widths
                  (each phrase wrapped). Clamp + nowrap keeps exactly two lines, as large as fits. */}
              <h1 className="w-full max-w-full text-[length:clamp(1.55rem,7.7cqi,4.7rem)] font-black tracking-tight text-foreground leading-[1.05] mx-auto">
                <span className="block whitespace-nowrap">Engineering leadership</span>
                <span className="block whitespace-nowrap">for fintech platforms</span>
              </h1>

              {/* Below: support, CTA, logo panel — top of bottom 1fr; overflow paints into spacer */}
              <div
                id="hero-below"
                className="flex flex-col items-center justify-start gap-5 sm:gap-6 w-full min-h-0 pt-3 sm:pt-4 pb-8 sm:pb-10"
              >
                <p className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto">
                  {SITE_SUPPORT}
                </p>

                <a
                  href={`${basePath}/resume`}
                  onClick={() => logResumeView("hero_cta")}
                  className="inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Read Tyler Lindow's resume"
                >
                  <FileText size={15} className="shrink-0" />
                  <span>Read resume</span>
                </a>

                {/* Previous employers + DevX / education logos in one panel */}
                <div id="trusted-partners" className="w-full scroll-mt-24">
                  <TrustedPartnersBar />
                  <div id="education" className="w-full scroll-mt-24">
                    <EducationInstitutionsBar />
                  </div>
                </div>
              </div>
            </div>
            {/* Reserves flow space when #hero-below paints past the 100svh stage */}
            <div id="hero-overflow-spacer" className="w-full" aria-hidden="true" />
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
