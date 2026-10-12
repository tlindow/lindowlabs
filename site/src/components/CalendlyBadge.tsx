"use client";

import { useCallback, useEffect } from "react";
import Script from "next/script";
import { captureLandingUtms, withPageUtms } from "@/lib/funnel";

/** Site-wide badge booking URL (UTMs appended at init). */
export const CALENDLY_BADGE_URL = "https://calendly.com/tylerlindow/connect";

const BADGE_TEXT = "Schedule time with me";
const BADGE_COLOR = "#0069ff";
const BADGE_TEXT_COLOR = "#ffffff";

const WIDGET_CSS =
  "https://assets.calendly.com/assets/external/widget.css";
const WIDGET_JS =
  "https://assets.calendly.com/assets/external/widget.js";

type CalendlyApi = {
  initBadgeWidget: (options: {
    url: string;
    text: string;
    color: string;
    textColor: string;
    branding: boolean;
  }) => void;
  destroyBadgeWidget?: () => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

/** Module flag: SiteChrome stays mounted across client nav; init once. */
let badgeInitialized = false;

/**
 * Site-wide Calendly badge. Script loads via next/script; init runs in
 * onReady (not window.onload) so it survives client-side navigation and is
 * not duplicated. CSS lifts the badge above the floating bottom audio dock.
 */
export default function CalendlyBadge() {
  const initBadge = useCallback(() => {
    if (typeof window === "undefined" || !window.Calendly) return;
    if (badgeInitialized) return;
    if (document.querySelector(".calendly-badge-widget")) {
      badgeInitialized = true;
      return;
    }
    captureLandingUtms();
    window.Calendly.initBadgeWidget({
      url: withPageUtms(CALENDLY_BADGE_URL),
      text: BADGE_TEXT,
      color: BADGE_COLOR,
      textColor: BADGE_TEXT_COLOR,
      branding: true,
    });
    badgeInitialized = true;
  }, []);

  // Ensure widget.css is present (next/script does not load stylesheets).
  useEffect(() => {
    if (typeof document === "undefined") return;
    const existing = document.querySelector(
      `link[data-calendly-widget-css="true"]`
    );
    if (existing) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = WIDGET_CSS;
    link.setAttribute("data-calendly-widget-css", "true");
    document.head.appendChild(link);
  }, []);

  // Script already on the page (soft remount / HMR): init without waiting.
  useEffect(() => {
    if (badgeInitialized) return;
    if (window.Calendly) initBadge();
  }, [initBadge]);

  return (
    <Script
      src={WIDGET_JS}
      strategy="afterInteractive"
      onReady={initBadge}
    />
  );
}
