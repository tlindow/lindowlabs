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
    // relative: docked page-audio mobile scrubber sits under this bar.
    <header className="sticky top-0 z-50 w-full bg-background opacity-100 border-b border-border no-print relative">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center gap-2 min-w-0">
        {/* Brand cluster: logo, name, coin dock target, then docked page-audio. */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          <Link
            href="/"
            className="relative flex items-center gap-2 sm:gap-2.5 group cursor-pointer focus:outline-none min-w-0"
            aria-label="Lindow Labs — Tyler Lindow, back to top"
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

            {/* Invisible morph dock target (out of flow): no dotted ring, no pre-dock gap.
                Sized for ScrollMorphAvatar measurement; the fixed coin paints into this spot. */}
            <div
              id="navbar-avatar-target"
              className="pointer-events-none absolute left-full top-1/2 z-0 ml-2 h-8 w-8 -translate-y-1/2 opacity-0 sm:ml-3 sm:h-9 sm:w-9"
              aria-hidden="true"
            />
          </Link>

          {/* Full player to the right of name + coin once scrolled (or on non-home pages). */}
          <NavPageAudioPlayer />
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
