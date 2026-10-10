"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavbarActions } from "@/context/NavbarActions";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";
import NavPageAudioPlayer, {
  NavPageAudioMobileScrubber,
} from "@/components/page-audio/NavPageAudioPlayer";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const { returnToHero } = useNavbarActions();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const goHome = (e: MouseEvent) => {
    if (pathname !== "/") return;
    e.preventDefault();
    if (!returnToHero()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Always painted at scroll 0. No scroll-linked opacity, visibility, or
  // translate: the old fade-in (scrollY / hero progress) was removed so the
  // bar is persistent from first paint and stays sticky while scrolling.
  return (
    // No overflow-x-clip here: Safari also clips Y when overflow-x is clip,
    // which hid the absolute mobile menu that hangs below this bar.
    // relative: docked page-audio mobile timeline (scrub + times) sits under this bar.
    // z-50 + isolate: sticky chrome sits above the page shell (relative z-0 in
    // SiteChrome), so hero morph / play / coins always slide under this bar.
    // overflow-anchor: none — sticky header size/visibility changes during the
    // Let's talk ↔ nav photo handoff must not retarget scrollY (scroll hitch).
    <header className="sticky top-0 z-50 isolate w-full bg-background opacity-100 border-b border-border no-print relative [overflow-anchor:none]">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center gap-2 min-w-0">
        {/* Brand cluster: logo, name, then docked profile (+ page-audio when present).
            Inner relative wrap stays content-sized so the undocked measure target
            (absolute left-full) sits beside the name, not at the flex-1 edge. */}
        <div className="flex items-center flex-1 min-w-0 [overflow-anchor:none]">
          <div className="relative flex items-center gap-1.5 sm:gap-2 min-w-0">
            <Link
              href="/"
              className="relative flex items-center gap-2 sm:gap-2.5 group cursor-pointer focus:outline-none min-w-0"
              aria-label="Lindow Labs - Tyler Lindow, back to top"
              onClick={goHome}
            >
              {/* Compact Lindow Labs mark (same asset as /learning + brand). */}
              <img
                src={`${basePath}/brand/lindow-labs-icon.svg`}
                alt="Lindow Labs"
                width={28}
                height={28}
                className="h-6 w-6 sm:h-7 sm:w-7 shrink-0"
              />

              <div className="flex flex-col min-w-0 text-left">
                <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-indigo-dark transition-colors leading-tight font-mono truncate">
                  Tyler Lindow
                </span>
                <span className="text-[10px] text-muted font-mono leading-none hidden sm:inline truncate">
                  Developer Experience &amp; Platform
                </span>
              </div>
            </Link>

            {/* Profile photo after hero scroll; + player when pageAudio has a clip. */}
            <NavPageAudioPlayer />
          </div>
        </div>

        {/* Desktop + mobile: Login only (Name left | Login right) */}
        <nav aria-label="Primary" className="flex items-center shrink-0">
          <a
            href={LEARNING_DASHBOARD_URL}
            className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-sand/80 hover:bg-sand text-foreground/90 hover:text-indigo-dark border border-border hover:border-indigo-dark/40 shadow-2xs"
            title="Log in to Lindow Labs Learning"
          >
            Login
          </a>
        </nav>
      </div>
      <NavPageAudioMobileScrubber />
    </header>
  );
}
