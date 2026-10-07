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
          {children}
        </div>
      </PageAudioProvider>
    </NavbarActionsProvider>
  );
}
