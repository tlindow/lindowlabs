"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import { resumeContact } from "@/data/resumeData";
import { useAnalytics, useExperiment } from "@/context/AnalyticsProvider";

export default function CheckoutDrawer() {
  const [isSectionInView, setIsSectionInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [devCountText, setDevCountText] = useState("500+ DEVs");
  const [volumeText, setVolumeText] = useState("$400K volume");

  const { logRecruitClick } = useAnalytics();
  const { recruit_cta_label, recruit_cta_style } = useExperiment();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const section = document.getElementById("pricing") || document.getElementById("launch-wallet");
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Section is in view once its top enters the upper portion of the viewport
      const inView = rect.top <= windowHeight * 0.8 && rect.bottom >= 120;
      setIsSectionInView(inView);

      // Compute scroll progress through the launch wallet section for rainbow bar
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = rect.height;
      const currentScroll = window.scrollY + windowHeight;

      const startOffset = sectionTop + 80;
      const totalScrollable = Math.max(1, sectionHeight);
      const rawProgress = (currentScroll - startOffset) / totalScrollable;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      setScrollProgress(clamped);

      // Increment DEVs and volume right when each card comes into view (top crosses bottom 85% of viewport)
      const isInView = (el: HTMLElement | null, ratio = 0.85) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= windowHeight * ratio;
      };

      const techEl = document.getElementById("wallet-card-tech-interactive");
      const galvEl = document.getElementById("wallet-card-galvanize");
      const affirmEl = document.getElementById("wallet-card-affirm");
      const begEl = document.getElementById("wallet-card-beginner");

      // Developer relationships increment right when each card enters view
      if (isInView(begEl)) {
        setDevCountText("677+ DEVs");
      } else if (isInView(affirmEl)) {
        setDevCountText("630+ DEVs");
      } else if (isInView(galvEl)) {
        setDevCountText("623+ DEVs");
      } else if (isInView(techEl)) {
        setDevCountText("603+ DEVs");
      } else {
        setDevCountText("500+ DEVs");
      }

      // Volume accumulates right when each card / milestone enters view
      if (isInView(begEl)) {
        setVolumeText("Flagship partner volume");
      } else if (isInView(affirmEl)) {
        const affRect = affirmEl!.getBoundingClientRect();
        const viewLine = windowHeight * 0.85;
        const progressInAffirm = (viewLine - affRect.top) / Math.max(1, affRect.height);
        if (progressInAffirm >= 0.6) {
          setVolumeText("Flagship partner volume");
        } else if (progressInAffirm >= 0.3) {
          setVolumeText("$110.4M+ volume");
        } else {
          setVolumeText("$10.4M+ volume");
        }
      } else if (isInView(galvEl)) {
        setVolumeText("$400K volume");
      } else {
        setVolumeText("$400K volume");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getCtaStyleClass = () => {
    switch (recruit_cta_style) {
      case "pulse_accent":
        return "bg-indigo-dark text-sand hover:bg-labs-primary-dark ring-2 ring-indigo/40 animate-pulse hover:animate-none shadow-sm";
      case "sprout_glow":
        return "bg-indigo-dark text-sand hover:bg-labs-primary-dark ring-2 ring-sky/60 shadow-md shadow-indigo/20";
      case "high_contrast":
        return "bg-foreground text-background hover:bg-foreground/90 ring-1 ring-foreground/20";
      case "forest_solid":
      default:
        return "bg-indigo-dark text-sand hover:bg-labs-primary-dark";
    }
  };

  return (
    <AnimatePresence>
      {isSectionInView && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 280 }}
          className="fixed bottom-0 left-0 right-0 z-40 no-print font-mono"
        >
          <div className="bg-background/95 backdrop-blur-md border-t border-border shadow-2xl">
            {/* Rainbow accent line that fills as you scroll */}
            <div className="h-[2px] w-full bg-border/40 relative overflow-hidden">
              <div
                className="h-full labs-rainbow-gradient transition-all duration-150"
                style={{ width: `${Math.max(8, scrollProgress * 100)}%` }}
              />
            </div>

            <div className="mx-auto max-w-6xl px-3 sm:px-6 md:px-8 pt-2.5 pb-4 sm:py-3 flex items-center justify-end gap-3 sm:gap-6">
              {/* Dynamic Accumulating Subtotal Amounts (stacks right next to button) */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-0.5 sm:gap-5 sm:divide-x sm:divide-border/60 shrink-0 py-0.5">
                {/* Developer Relationships Subtotal */}
                <div className="flex items-baseline gap-1 sm:gap-1.5 shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider whitespace-nowrap">
                    Dev Relationships:
                  </span>
                  <motion.span
                    key={devCountText}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs sm:text-sm md:text-base font-bold font-mono text-[#2d5a3d] tracking-tight whitespace-nowrap"
                  >
                    {devCountText}
                  </motion.span>
                </div>

                {/* Attributed volume subtotal */}
                <div className="sm:pl-5 flex items-baseline gap-1 sm:gap-1.5 shrink-0">
                  <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider whitespace-nowrap">
                    Attributed volume:
                  </span>
                  <motion.span
                    key={volumeText}
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs sm:text-base md:text-lg font-black font-mono text-indigo-dark tracking-tight whitespace-nowrap"
                  >
                    {volumeText}
                  </motion.span>
                </div>
              </div>

              {/* Primary CTA right next to totals */}
              <a
                href={resumeContact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  logRecruitClick({
                    location: "checkout_drawer",
                    label: recruit_cta_label,
                    variant: `${recruit_cta_style}:${recruit_cta_label}`,
                  })
                }
                className={`group inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl px-4 sm:px-5 py-3 sm:py-2.5 min-h-[44px] sm:min-h-0 text-sm font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap shrink-0 ${getCtaStyleClass()}`}
                title="Recruit Tyler — connect on LinkedIn"
              >
                <LinkedInIcon size={15} className="shrink-0" />
                <span>{recruit_cta_label}</span>
                <ArrowUpRight size={15} className="opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
