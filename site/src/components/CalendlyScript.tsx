"use client";

import { useEffect } from "react";
import Script from "next/script";

const WIDGET_CSS =
  "https://assets.calendly.com/assets/external/widget.css";
const WIDGET_JS =
  "https://assets.calendly.com/assets/external/widget.js";

/**
 * Loads Calendly widget.js + widget.css via next/script (no badge, no
 * window.onload). Popup opens from ScheduleCalendarButton on click.
 */
export default function CalendlyScript() {
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

  return <Script src={WIDGET_JS} strategy="afterInteractive" />;
}
