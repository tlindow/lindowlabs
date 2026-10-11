/**
 * Scroll-derived ownership of Tyler's profile photo on homepage-style leaves
 * (home + /get-your-time-back retreat hero).
 *
 * The WebGL morph coin travels hero → nav only. Let's talk (shared Footer)
 * shows a plain static circular photo; the morph stays hidden there (same as
 * while docked at nav). Nav photo may show ONLY while docked at the nav.
 *
 * Click-to-hero suspends the nav photo for the whole trip so the morph never
 * shares the screen with the nav img.
 */

export type ProfileDockOwner = "hero" | "nav" | "contact";

/** Routes that use the hero↔nav↔contact profile dock (not always-nav). */
const PROFILE_DOCK_PATHS = new Set(["/", "/get-your-time-back"]);

export function isProfileDockPath(pathname: string): boolean {
  return PROFILE_DOCK_PATHS.has(pathname);
}

/**
 * Must match AVATAR_MORPH_SCROLL_DISTANCE / HERO_PIN_SCROLL_DISTANCE in
 * ScrollMorphAvatar. Morph progress p1 hits 1 at this scrollY.
 */
export const NAV_DOCK_SCROLL_PX = 240;

/** Matches homepage contact transit band in page.tsx. */
export function contactTransitDistance(viewportHeight: number): number {
  return Math.min(320, viewportHeight * 0.45);
}

/**
 * Absolute scrollY where contact mid-viewport handoff completes
 * (contactAbsoluteY - viewportHeight * 0.5).
 */
export function contactMidScrollY(
  contactAbsoluteY: number,
  viewportHeight: number
): number {
  return contactAbsoluteY - viewportHeight * 0.5;
}

/**
 * Which slot owns the visible photo at this scrollY.
 * - hero: morph coin at / leaving hero (nav photo must stay hidden)
 * - nav: morph faded at nav dock (exactly one: the nav img)
 * - contact: static Let's talk photo (nav + morph hidden)
 */
export function getProfileDockOwner(
  scrollY: number,
  contactTargetScrollY: number,
  viewportHeight: number
): ProfileDockOwner {
  if (!Number.isFinite(scrollY) || scrollY < 0) return "hero";

  if (contactTargetScrollY > 0) {
    const start =
      contactTargetScrollY - contactTransitDistance(viewportHeight);
    // Contact owns as soon as scroll enters the Let's talk handoff band —
    // static footer photo owns the slot; nav img + morph stay hidden.
    if (scrollY >= start) return "contact";
  }

  // Nav owns only after the hero→nav morph has finished (p1 ≈ 1).
  if (scrollY >= NAV_DOCK_SCROLL_PX * 0.98) return "nav";

  return "hero";
}

export function measureContactTargetScrollY(): number {
  if (typeof window === "undefined") return 0;
  const contactEl = document.getElementById("contact-avatar-target");
  if (!contactEl) return 0;
  const rect = contactEl.getBoundingClientRect();
  const contactAbsoluteY = rect.top + window.scrollY;
  return contactMidScrollY(contactAbsoluteY, window.innerHeight);
}

/** Click-to-hero only: suppress nav photo while the morph flies past mid-page. */
let directToHeroActive = false;
const directToHeroListeners = new Set<() => void>();

export function setDirectToHeroActive(active: boolean): void {
  if (directToHeroActive === active) return;
  directToHeroActive = active;
  for (const listener of directToHeroListeners) listener();
}

export function getDirectToHeroActive(): boolean {
  return directToHeroActive;
}

export function subscribeDirectToHeroActive(onStoreChange: () => void): () => void {
  directToHeroListeners.add(onStoreChange);
  return () => {
    directToHeroListeners.delete(onStoreChange);
  };
}
