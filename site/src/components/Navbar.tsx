"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import { useNavbarActions } from "@/context/NavbarActions";
import { ENGINEERING_LEADERS_PATH } from "@/data/engineeringLeadersPage";
import { resumeContact } from "@/data/resumeData";
import { trackFunnel } from "@/lib/funnel";

const AUDIENCE_PILL_CLASS =
  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-sand/80 hover:bg-sand text-foreground/90 hover:text-indigo-dark border border-border hover:border-indigo-dark/40 shadow-2xs";

const NAV_ICON_BTN_CLASS =
  "inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border border-border bg-sand/80 text-foreground/90 hover:bg-sand hover:text-indigo-dark hover:border-indigo-dark/40 shadow-2xs transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40";

export default function Navbar() {
  const pathnameRaw = usePathname() || "/";
  // Static export / trailing-slash hosts may report /engineering-leaders/.
  const pathname =
    pathnameRaw.length > 1 && pathnameRaw.endsWith("/")
      ? pathnameRaw.slice(0, -1)
      : pathnameRaw;
  const { returnToHero } = useNavbarActions();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const onLeadersPage =
    pathname === ENGINEERING_LEADERS_PATH ||
    pathname === "/get-your-time-back";

  const goHome = (e: MouseEvent) => {
    if (pathname !== "/") return;
    e.preventDefault();
    if (!returnToHero()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    // No audio player in the top nav — playback docks in BottomDockPlayer.
    // overflow-anchor: none — sticky header size changes must not retarget scrollY.
    <header className="sticky top-0 z-50 isolate w-full bg-background opacity-100 border-b border-border no-print relative [overflow-anchor:none]">
      <div className="relative max-w-5xl mx-auto px-3 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center gap-2 min-w-0">
        <div className="flex items-center flex-1 min-w-0 [overflow-anchor:none]">
          <Link
            href="/"
            className="relative flex items-center gap-2 sm:gap-2.5 group cursor-pointer focus:outline-none min-w-0"
            aria-label="Lindow Labs - Tyler Lindow, back to top"
            onClick={goHome}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
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
        </div>

        <div className="relative z-[2] flex items-center gap-1.5 sm:gap-2 shrink-0">
          <a
            href={resumeContact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={NAV_ICON_BTN_CLASS}
            aria-label="Message me on LinkedIn"
            title="Message me on LinkedIn"
            data-nav="linkedin"
            onClick={() => trackFunnel("nav_linkedin_icon")}
          >
            <span className="inline-flex" aria-hidden="true">
              <LinkedInIcon size={15} className="shrink-0" />
            </span>
          </a>
          <a
            href={`mailto:${resumeContact.email}`}
            className={NAV_ICON_BTN_CLASS}
            aria-label={`Email ${resumeContact.email}`}
            title={`Email ${resumeContact.email}`}
            data-nav="email"
            onClick={() => trackFunnel("nav_email_icon")}
          >
            <Mail size={15} className="shrink-0" aria-hidden="true" />
          </a>

          <nav aria-label="Audience" className="flex items-center shrink-0 ml-0.5 sm:ml-1">
            {onLeadersPage ? (
              <Link
                href="/"
                className={AUDIENCE_PILL_CLASS}
                title="For recruiters"
                data-nav="for-recruiters"
                onClick={() => trackFunnel("nav_for_recruiters")}
              >
                For recruiters{" "}
                <span aria-hidden="true" className="ml-0.5">
                  →
                </span>
              </Link>
            ) : (
              <Link
                href={ENGINEERING_LEADERS_PATH}
                className={AUDIENCE_PILL_CLASS}
                title="For engineering leaders"
                data-nav="for-engineering-leaders"
                onClick={() => trackFunnel("nav_for_engineering_leaders")}
              >
                For engineering leaders{" "}
                <span aria-hidden="true" className="ml-0.5">
                  →
                </span>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
