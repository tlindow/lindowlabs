/**
 * Scroll-derived ownership of Tyler's profile photo on the homepage.
 *
 * The WebGL morph coin travels hero → nav. Nav ↔ Let's talk is an in-place
 * crossfade (nav img ↔ morph parked at contact) — never a flight across body
 * text. The in-nav photo may show ONLY while docked at the nav (morph faded).
 *
 * Click-to-hero (direct flight contact→hero) suspends the nav photo for the
 * whole trip so the morph coin never shares the screen with the nav img.
 */

export type ProfileDockOwner = "hero" | "nav" | "contact";

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
 * - contact: morph snapped at Let's talk (nav photo hidden; no mid-page flight)
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
    // morph snaps to the contact slot; nav img crossfades out.
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
