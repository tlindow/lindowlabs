/**
 * Funnel measurement: Vercel Analytics custom events + Calendly / click UTMs.
 * Event names stay short and stable.
 */

import { track } from "@vercel/analytics";

/** UTM keys persisted from the landing URL and forwarded to Calendly. */
export const FUNNEL_UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
] as const;

const SESSION_UTM_KEY = "lindowlabs.funnel.utm";

export type FunnelEvent =
  | "schedule_with_tyler_hero"
  | "schedule_with_tyler_contact"
  | "download_resume"
  | "linkedin_icon"
  | "email_icon"
  | "nav_linkedin_icon"
  | "nav_email_icon"
  | "nav_for_recruiters"
  | "nav_for_engineering_leaders";

export type FunnelUtmProps = Partial<
  Record<(typeof FUNNEL_UTM_KEYS)[number], string>
>;

/** Capture landing utm_* into sessionStorage once (first load wins). */
export function captureLandingUtms(): FunnelUtmProps {
  if (typeof window === "undefined") return {};
  try {
    const existing = window.sessionStorage.getItem(SESSION_UTM_KEY);
    if (existing) {
      return JSON.parse(existing) as FunnelUtmProps;
    }
    const page = new URLSearchParams(window.location.search);
    const props: FunnelUtmProps = {};
    for (const key of FUNNEL_UTM_KEYS) {
      const value = page.get(key);
      if (value) props[key] = value;
    }
    window.sessionStorage.setItem(SESSION_UTM_KEY, JSON.stringify(props));
    return props;
  } catch {
    return {};
  }
}

/** Read persisted landing UTMs (empty object when none). */
export function readStoredUtms(): FunnelUtmProps {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(SESSION_UTM_KEY);
    if (!raw) return captureLandingUtms();
    return JSON.parse(raw) as FunnelUtmProps;
  } catch {
    return {};
  }
}

/** Fire a Vercel Analytics custom event with stored utm_* properties. */
export function trackFunnel(event: FunnelEvent): void {
  try {
    const props = readStoredUtms();
    if (Object.keys(props).length > 0) {
      track(event, props);
    } else {
      track(event);
    }
  } catch {
    // Analytics must never break navigation.
  }
}

/**
 * Append stored (or current-page) utm_* onto a Calendly href at click time.
 */
export function withPageUtms(href: string): string {
  if (typeof window === "undefined") return href;
  try {
    const stored = readStoredUtms();
    const page = new URLSearchParams(window.location.search);
    const url = new URL(href, window.location.origin);
    for (const key of FUNNEL_UTM_KEYS) {
      const value = stored[key] || page.get(key);
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  } catch {
    return href;
  }
}

/** Track then open an external href (optional Calendly UTM merge). */
export function openTrackedExternal(
  href: string,
  event: FunnelEvent,
  options?: { forwardUtms?: boolean }
): void {
  trackFunnel(event);
  const next = options?.forwardUtms ? withPageUtms(href) : href;
  window.open(next, "_blank", "noopener,noreferrer");
}
