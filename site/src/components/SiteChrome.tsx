"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { NavbarActionsProvider } from "@/context/NavbarActions";
import { PageAudioProvider } from "@/context/PageAudioProvider";

const LAVENDER_ROUTES = new Set([
  "/",
  "/schedule-time",
  "/time",
  "/visitors",
]);

/** Full-bleed retreat leaf: no site nav / nav audio player chrome. */
const HIDE_NAV_ROUTES = new Set(["/get-your-time-back"]);

/**
 * Persistent site chrome: sticky top nav on most routes, with the lavender
 * homepage theme applied to the nav on recruiter surfaces. Retreat hides nav.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const lavenderNav = LAVENDER_ROUTES.has(pathname);
  const hideNav = HIDE_NAV_ROUTES.has(pathname);

  // Sticky nav must share a tall scroll container with page content. A nav-only
  // wrapper is only as tall as the header, so position:sticky cannot pin.
  //
  // relative z-0 on the page shell traps page content (hero play, coins, etc.)
  // below the sticky nav sibling (z-50). The profile morph coin + play portal
  // to document.body at z-60 so they paint over the nav during hero→nav.
  return (
    <NavbarActionsProvider>
      <PageAudioProvider>
        <div
          className={
            lavenderNav
              ? "homepage-theme min-h-screen"
              : "min-h-screen"
          }
        >
          {hideNav ? null : <Navbar />}
          <div className="relative z-0">{children}</div>
        </div>
      </PageAudioProvider>
    </NavbarActionsProvider>
  );
}
