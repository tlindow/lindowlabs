"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavbarActions } from "@/context/NavbarActions";
import { LEARNING_DASHBOARD_URL } from "@/data/urls";
import NavPageAudioPlayer from "@/components/page-audio/NavPageAudioPlayer";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const { returnToHero } = useNavbarActions();

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
        <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
          <Link
            href="/"
            className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0 group cursor-pointer focus:outline-none"
            aria-label="Tyler Lindow - Back to top"
            onClick={goHome}
          >
            <div
              id="navbar-avatar-target"
              className="relative w-full h-full rounded-full"
              aria-hidden="true"
            >
              {/* Empty reserved slot the profile coin docks into — dotted circle only */}
              <div className="w-full h-full rounded-full border-2 border-dashed border-border/80 bg-transparent pointer-events-none" />
            </div>
          </Link>

          {/* Full player beside the coin once scrolled (or on non-home pages). */}
          <NavPageAudioPlayer />

          <Link
            href="/"
            className="flex flex-col min-w-0 text-left group cursor-pointer focus:outline-none"
            aria-label="Tyler Lindow - Back to top"
            onClick={goHome}
          >
            <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-indigo-dark transition-colors leading-tight font-mono truncate">
              Tyler Lindow
            </span>
            <span className="text-[10px] text-muted font-mono leading-none hidden sm:inline">
              Developer Experience &amp; Platform
            </span>
          </Link>
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
    </header>
  );
}
