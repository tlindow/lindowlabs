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
  "/get-your-time-back",
  "/visitors",
]);

/**
 * Persistent site chrome: sticky top nav on every route, with the lavender
 * homepage theme applied to the nav on recruiter surfaces.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const lavenderNav = LAVENDER_ROUTES.has(pathname);

  // Sticky nav must share a tall scroll container with page content. A nav-only
  // wrapper is only as tall as the header, so position:sticky cannot pin.
  //
  // relative z-0 on the page shell traps every descendant stacking context
  // (fixed morph + filter, absolute play with translate, WebGL canvas layers,
  // framer-motion transforms) below the sticky nav sibling (z-50). Without
  // this, hero photo / play can paint over the bar mid-scroll at ~1024-1280.
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
          <Navbar />
          <div className="relative z-0">{children}</div>
        </div>
      </PageAudioProvider>
    </NavbarActionsProvider>
  );
}
