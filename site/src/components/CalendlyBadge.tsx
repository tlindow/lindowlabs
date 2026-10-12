"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";
import { withPageUtms } from "@/lib/funnel";

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
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

/** Remove prior badge DOM so client navigations never stack widgets. */
function clearCalendlyBadgeDom(): void {
  if (typeof document === "undefined") return;
  document
    .querySelectorAll(
      ".calendly-badge-widget, .calendly-badge-content, .calendly-overlay"
    )
    .forEach((node) => node.remove());
}

/**
 * Site-wide Calendly badge. Script loads via next/script; init runs in
 * onReady so it survives client-side navigation without window.onload.
 * CSS lifts the badge above the floating bottom audio dock.
 */
export default function CalendlyBadge() {
  const initedRef = useRef(false);

  const initBadge = useCallback(() => {
    if (typeof window === "undefined" || !window.Calendly) return;
    clearCalendlyBadgeDom();
    window.Calendly.initBadgeWidget({
      url: withPageUtms(CALENDLY_BADGE_URL),
      text: BADGE_TEXT,
      color: BADGE_COLOR,
      textColor: BADGE_TEXT_COLOR,
      branding: true,
    });
    initedRef.current = true;
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

  // Re-init if the script already loaded (e.g. Soft remount) without onReady.
  useEffect(() => {
    if (initedRef.current) return;
    if (window.Calendly) initBadge();
  }, [initBadge]);

  return (
    <Script
      src={WIDGET_JS}
      strategy="afterInteractive"
      onReady={initBadge}
      onLoad={initBadge}
    />
  );
}
