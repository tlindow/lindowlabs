/** Privacy-respecting page-view ping for tinker.beginner.work. No cookies or IDs. */

export const SITE_PING_URL = "https://tinker.beginner.work/api/site/ping";

export type SitePingPayload = {
  path: string;
  ref: string;
  utm_source: string;
  utm_campaign: string;
};

function trackingDenied(): boolean {
  if (typeof navigator === "undefined") return true;
  const nav = navigator as Navigator & {
    globalPrivacyControl?: boolean;
  };
  if (nav.globalPrivacyControl === true) return true;
  if (nav.doNotTrack === "1" || nav.doNotTrack === "yes") return true;
  const win = window as Window & { doNotTrack?: string };
  if (win.doNotTrack === "1" || win.doNotTrack === "yes") return true;
  return false;
}

function referrerHost(): string {
  try {
    const raw = document.referrer;
    if (!raw) return "";
    return new URL(raw).hostname || "";
  } catch {
    return "";
  }
}

function utmParam(name: "utm_source" | "utm_campaign"): string {
  try {
    return new URLSearchParams(window.location.search).get(name) || "";
  } catch {
    return "";
  }
}

export function buildSitePingPayload(pathname: string): SitePingPayload {
  return {
    path: pathname || "/",
    ref: referrerHost(),
    utm_source: utmParam("utm_source"),
    utm_campaign: utmParam("utm_campaign"),
  };
}

/** Fire once per page view. Failures are silent. */
export function sendSitePing(pathname: string): void {
  if (typeof window === "undefined") return;
  if (trackingDenied()) return;

  const body = JSON.stringify(buildSitePingPayload(pathname));

  try {
    if (typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(SITE_PING_URL, blob)) return;
    }
  } catch {
    // fall through to fetch
  }

  try {
    void fetch(SITE_PING_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      mode: "cors",
      credentials: "omit",
    }).catch(() => {});
  } catch {
    // silent
  }
}
