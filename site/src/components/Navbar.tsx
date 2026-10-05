"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { LinkedInIcon } from "@/components/brand/PartnerLogos";
import { useNavbarActions } from "@/context/NavbarActions";

const NAV_LINKS = [
  { href: "/visitors", label: "Visitors" },
  { href: "/learning", label: "Learning" },
] as const;

function linkClass(active: boolean) {
  return [
    "text-xs sm:text-sm font-mono font-bold transition-colors whitespace-nowrap",
    active
      ? "text-indigo-dark"
      : "text-foreground/90 hover:text-indigo-dark",
  ].join(" ");
}

export default function Navbar() {
  const pathname = usePathname() || "/";
  const { returnToHero } = useNavbarActions();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // Always painted at scroll 0. No scroll-linked opacity, visibility, or
  // translate: the old fade-in (scrollY / hero progress) was removed so the
  // bar is persistent from first paint and stays sticky while scrolling.
  return (
    <header className="sticky top-0 z-50 w-full bg-background opacity-100 border-b border-border no-print">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 min-w-0">
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
              Developer Experience &amp; Platform
            </span>
          </div>
        </Link>

        {/* Desktop / tablet: inline links + LinkedIn */}
        <nav
          aria-label="Primary"
          className="hidden sm:flex items-center gap-4 md:gap-5 shrink-0"
        >
          {NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClass(pathname === item.href)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href="https://www.linkedin.com/in/tlindow"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-mono font-bold transition-all hover:scale-[1.02] active:scale-[0.98] bg-sand/80 hover:bg-sand text-foreground/90 hover:text-[#0A66C2] border border-border hover:border-[#0A66C2]/40 shadow-2xs"
            title="Follow Tyler Lindow on LinkedIn"
          >
            <LinkedInIcon
              size={14}
              className="text-[#0A66C2] shrink-0 group-hover:scale-105 transition-transform"
            />
            <span>Follow me on LinkedIn</span>
          </a>
        </nav>

        {/* 390px / small screens: compact menu so links never overflow */}
        <div className="relative sm:hidden shrink-0">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-sand/80 text-foreground p-2 transition-colors hover:bg-sand"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {menuOpen ? (
            <div
              id={menuId}
              className="absolute right-0 top-[calc(100%+0.5rem)] w-52 rounded-xl border border-border bg-background shadow-md p-2 z-50"
            >
              <nav aria-label="Primary" className="flex flex-col gap-0.5">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "rounded-lg px-3 py-2.5",
                      linkClass(pathname === item.href),
                    ].join(" ")}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <a
                  href="https://www.linkedin.com/in/tlindow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-mono font-bold text-foreground/90 hover:text-[#0A66C2] transition-colors"
                  title="Follow Tyler Lindow on LinkedIn"
                  onClick={() => setMenuOpen(false)}
                >
                  <LinkedInIcon size={14} className="text-[#0A66C2] shrink-0" />
                  <span>LinkedIn</span>
                </a>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
