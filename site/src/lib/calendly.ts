/**
 * Calendly popup booking (widget.js loaded via CalendlyScript).
 */

import { captureLandingUtms, withPageUtms } from "@/lib/funnel";

export const CALENDLY_CONNECT_URL =
  "https://calendly.com/tylerlindow/connect";

export const CALENDLY_SCHEDULE_LABEL = "Schedule time with me";

type CalendlyApi = {
  initPopupWidget: (options: { url: string }) => void;
};

declare global {
  interface Window {
    Calendly?: CalendlyApi;
  }
}

/** Open the connect popup with stored landing utm_* on the URL. */
export function openCalendlyPopup(): void {
  if (typeof window === "undefined") return;
  captureLandingUtms();
  const url = withPageUtms(CALENDLY_CONNECT_URL);
  if (window.Calendly?.initPopupWidget) {
    window.Calendly.initPopupWidget({ url });
    return;
  }
  // Script not ready yet: fall back to a new tab with the same UTM URL.
  window.open(url, "_blank", "noopener,noreferrer");
}
