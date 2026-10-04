"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { NavbarActionsProvider } from "@/context/NavbarActions";

const LAVENDER_ROUTES = new Set([
  "/",
  "/schedule-time",
  "/time",
  "/get-your-time-back",
]);

/**
 * Persistent site chrome: sticky top nav on every route, with the lavender
 * homepage theme applied to the nav on recruiter surfaces.
 */
export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const lavenderNav = LAVENDER_ROUTES.has(pathname);

  return (
    <NavbarActionsProvider>
      <div className={lavenderNav ? "homepage-theme" : undefined}>
        <Navbar />
      </div>
      {children}
    </NavbarActionsProvider>
  );
}
