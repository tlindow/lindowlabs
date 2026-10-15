"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import BottomDockPlayer from "@/components/page-audio/BottomDockPlayer";
import { NavbarActionsProvider } from "@/context/NavbarActions";
import { PageAudioProvider } from "@/context/PageAudioProvider";

const LAVENDER_ROUTES = new Set(["/", "/visitors"]);

/**
 * Persistent site chrome: sticky top nav, floating bottom audio dock on
 * page-audio leaves, lavender theme on home surfaces.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const lavenderNav = LAVENDER_ROUTES.has(pathname);

  // Sticky nav must share a tall scroll container with page content.
  // relative z-0 on the page shell traps page content below sticky nav (z-50).
  // Profile morph + play portal to document.body at z-60 during hero→dock.
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
          <BottomDockPlayer />
        </div>
      </PageAudioProvider>
    </NavbarActionsProvider>
  );
}
