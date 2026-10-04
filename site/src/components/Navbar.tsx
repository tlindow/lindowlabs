"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import { useNavbarActions } from "@/context/NavbarActions";

export default function Navbar() {
  const pathname = usePathname() || "/";
  const { returnToHero } = useNavbarActions();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-md border-b border-border/80 no-print">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center justify-between w-full min-w-0 gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer focus:outline-none min-w-0"
            aria-label="Tyler Lindow - Back to top"
            onClick={(e) => {
              if (pathname !== "/") return;
              e.preventDefault();
              if (!returnToHero()) {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <div
              id="navbar-avatar-target"
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full shrink-0"
            >
              {/* Reserved layout slot for morphing avatar */}
              <div className="w-full h-full rounded-full opacity-0 pointer-events-none" />
            </div>

            <div className="flex flex-col text-left min-w-0">
              <span className="font-bold text-sm sm:text-base text-foreground group-hover:text-indigo-dark transition-colors leading-tight font-mono truncate">
                Tyler Lindow
              </span>
              <span className="text-[10px] text-muted font-mono leading-none hidden sm:inline">
                Fintech Product &amp; Engineering
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://www.linkedin.com/in/tlindow"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-sand/80 hover:bg-sand text-foreground/90 hover:text-[#0A66C2] border border-border hover:border-[#0A66C2]/40 shadow-2xs"
              title="Follow Tyler Lindow on LinkedIn"
            >
              <LinkedInIcon
                size={14}
                className="text-[#0A66C2] shrink-0 group-hover:scale-105 transition-transform"
              />
              <span className="sm:hidden">LinkedIn</span>
              <span className="hidden sm:inline">Follow me on LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
