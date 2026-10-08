"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { useScroll, useMotionValue, useSpring } from "framer-motion";
import { FileText } from "lucide-react";
import {
  TrustedPartnersBar,
  EducationInstitutionsBar,
} from "@/components/brand/PartnerLogos";
import About from "@/components/About";
import WhatYouGet from "@/components/WhatYouGet";
import Footer from "@/components/Footer";
import HeroPageAudioButton from "@/components/page-audio/HeroPageAudioButton";
import ScrollMorphAvatar, {
  HERO_PIN_SCROLL_DISTANCE,
} from "@/components/animations/ScrollMorphAvatar";
import { useAnalytics } from "@/context/AnalyticsProvider";
import { useRegisterReturnToHero } from "@/context/NavbarActions";
import { usePrefersReducedMotion } from "@/hooks/useProfileAnchors";
import { setDirectToHeroActive } from "@/lib/profileDock";
import { SITE_SUPPORT } from "@/data/positioning";

export default function Home() {
  const { scrollY } = useScroll();
  const prefersReducedMotion = usePrefersReducedMotion();
  const rawProgress = useMotionValue(0);
  // Prefer reduced motion: stiff spring ≈ 1:1 with scroll (no lag/catch).
  const springConfig = useMemo(
    () =>
      prefersReducedMotion
        ? { stiffness: 1000, damping: 100, mass: 0.1 }
        : { stiffness: 220, damping: 24, mass: 0.4 },
    [prefersReducedMotion]
  );
  const avatarProgress = useSpring(rawProgress, springConfig);

  const rawContactProgress = useMotionValue(0);
  const contactProgress = useSpring(rawContactProgress, springConfig);
  const hasReachedContactRef = useRef(false);
  const wasAtTopRef = useRef(false);
  const prevYRef = useRef(0);
  // Cached contact mid-viewport scrollY. Never call getBoundingClientRect from
  // the scroll handler — that forced layout every frame and hitching the
  // Let's talk ↔ nav handoff (scroll stall / anchoring jump).
  const contactTargetScrollYRef = useRef(0);
  const directToHero = useMotionValue(0);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const { logResumeView } = useAnalytics();

  const measureContactTargetScrollY = useCallback(() => {
    if (typeof window === "undefined") return 0;
    const contactEl = document.getElementById("contact-avatar-target");
    if (!contactEl) return 0;
    const rect = contactEl.getBoundingClientRect();
    const contactAbsoluteY = rect.top + window.scrollY;
    return contactAbsoluteY - window.innerHeight * 0.5;
  }, []);

  const refreshContactTargetCache = useCallback(() => {
    contactTargetScrollYRef.current = measureContactTargetScrollY();
  }, [measureContactTargetScrollY]);

  const computeContactProgress = useCallback((latestY: number) => {
    const targetMidScrollY = contactTargetScrollYRef.current;
    if (targetMidScrollY <= 0) return 0;
    const transitDistance = Math.min(
      320,
      typeof window !== "undefined" ? window.innerHeight * 0.45 : 320
    );
    const startScrollY = targetMidScrollY - transitDistance;

    if (latestY <= startScrollY) return 0;
    if (latestY >= targetMidScrollY) return 1;
    return (latestY - startScrollY) / transitDistance;
  }, []);

  // Measure contact target once ready; refresh on resize only (not on scroll).
  useEffect(() => {
    if (typeof window === "undefined") return;

    const refresh = () => {
      refreshContactTargetCache();
      if (!hasReachedContactRef.current) {
        const contactP = computeContactProgress(window.scrollY);
        rawContactProgress.set(contactP);
        contactProgress.jump(contactP);
      }
    };

    refresh();
    // Second pass after fonts/layout settle.
    const raf = requestAnimationFrame(refresh);

    window.addEventListener("resize", refresh, { passive: true });
    const contactEl = document.getElementById("contact-avatar-target");
    const ro = new ResizeObserver(refresh);
    if (contactEl) ro.observe(contactEl);
    // Body size changes (hero spacer) can move contact absolute Y.
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", refresh);
      ro.disconnect();
    };
  }, [
    refreshContactTargetCache,
    computeContactProgress,
    rawContactProgress,
    contactProgress,
  ]);

  // If page loads already scrolled down, initialize progress appropriately.
  // Never auto-engage directToHero — scroll both directions uses hero↔nav↔contact.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const heroP = Math.min(Math.max(window.scrollY / HERO_PIN_SCROLL_DISTANCE, 0), 1);
      rawProgress.set(heroP);
      avatarProgress.jump(heroP);

      requestAnimationFrame(() => {
        refreshContactTargetCache();
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
    refreshContactTargetCache,
    computeContactProgress,
  ]);

  // Synchronize avatar progress with scroll. Uses the cached contact target only
  // — no layout reads on the scroll path. Scroll-up from Let's talk reverses
  // contact → nav → hero (same springs). directToHero is click-to-hero only.
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latestY) => {
      const isScrollingDown = latestY > prevYRef.current;
      prevYRef.current = latestY;

      // Click-initiated direct-to-hero: springs stay zeroed until the user
      // lands at top and scrolls down again to resume the normal path.
      if (hasReachedContactRef.current) {
        rawProgress.set(0);
        avatarProgress.jump(0);
        rawContactProgress.set(0);
        contactProgress.jump(0);
        directToHero.set(1);

        if (latestY <= 5) {
          wasAtTopRef.current = true;
        }

        if (wasAtTopRef.current && isScrollingDown && latestY > 25) {
          hasReachedContactRef.current = false;
          wasAtTopRef.current = false;
          directToHero.set(0);
          setDirectToHeroActive(false);
          const heroP = Math.min(Math.max(latestY / HERO_PIN_SCROLL_DISTANCE, 0), 1);
          rawProgress.set(heroP);
        }
        return;
      }

      // Normal both-direction flow (Hero ↔ Nav ↔ Contact).
      // Jump contact progress only at the endpoints so the coin rests exactly
      // at nav (0) or Let's talk (1). Mid-transit uses the spring; morph
      // z-index rises above the sticky bar while contact owns the photo so
      // the coin is never trapped invisible under the nav.
      const heroP = Math.min(Math.max(latestY / HERO_PIN_SCROLL_DISTANCE, 0), 1);
      rawProgress.set(heroP);
      const contactP = computeContactProgress(latestY);
      rawContactProgress.set(contactP);
      if (contactP <= 0.001 || contactP >= 0.999) {
        contactProgress.jump(contactP);
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
    computeContactProgress,
  ]);
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
    // Intentional skip-nav flight (coin click / back-to-top only).
    hasReachedContactRef.current = true;
    wasAtTopRef.current = false;
    directToHero.set(1);
    setDirectToHeroActive(true);
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
      setDirectToHeroActive(false);
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
          {/* FULL PAGE HERO: fill viewport under sticky nav so 1fr rows resolve */}
          <header
            id="hero"
            className="@container relative text-center px-4 max-w-5xl mx-auto scroll-mt-20 min-w-0 w-full overflow-x-clip"
          >
            <div
              id="hero-stage"
              className="grid h-[calc(100svh-3.5rem)] sm:h-[calc(100svh-4rem)] grid-rows-[minmax(0,1fr)_auto_minmax(0,1fr)] justify-items-center min-w-0 w-full"
            >
              {/* Above: photo + label, pinned to the bottom of the top 1fr */}
              <div className="flex flex-col items-center justify-end gap-3 sm:gap-4 w-full min-h-0 pb-3 sm:pb-4">
                <div className="relative">
                  <div
                    id="hero-avatar-anchor"
                    data-profile-anchor="hero"
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 relative"
                  />
                  {/* Play/pause docks to nav on scroll; shared <audio> keeps playback. */}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 sm:ml-4">
                    <HeroPageAudioButton />
                  </div>
                </div>

                <span className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest block">
                  ex-Affirm, ex-founder
                </span>
              </div>

              {/* Fluid size: clamp to container so Space Mono never overflows at
                  320-430px. Block spans prefer two lines; wrap if still tight. */}
              <h1 className="w-full max-w-full min-w-0 px-0.5 text-[length:clamp(1.05rem,min(6.2cqi,calc(100cqi/15.5)),4.7rem)] font-black tracking-tight text-foreground leading-[1.08] mx-auto overflow-x-clip">
                <span className="block">Engineering leadership</span>
                <span className="block">for devX genius</span>
              </h1>

              {/* Below: support, CTA, logo panel — top of bottom 1fr; overflow paints into spacer */}
              <div
                id="hero-below"
                className="flex flex-col items-center justify-start gap-5 sm:gap-6 w-full min-h-0 min-w-0 max-w-full pt-3 sm:pt-4 pb-8 sm:pb-10"
              >
                <p className="text-sm sm:text-base md:text-lg font-mono text-muted mx-auto w-full max-w-full min-w-0 text-pretty px-1">
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

                {/* Previous employers + education logos in one panel */}
                <div id="trusted-partners" className="w-full min-w-0 max-w-full scroll-mt-24">
                  <TrustedPartnersBar />
                  <div id="education" className="w-full min-w-0 max-w-full scroll-mt-24">
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
      <Footer profilePhotoAnchor />
    </div>
  );
}
