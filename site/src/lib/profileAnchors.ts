/**
 * Profile-photo anchors: in-page slots that "own" Tyler's photo while visible.
 * Mark with data-profile-anchor (e.g. "hero" | "contact"). The nav photo shows
 * only when no marked anchor intersects the viewport.
 */

export const PROFILE_ANCHOR_ATTR = "data-profile-anchor";
export const PROFILE_PHOTO_ATTR = "data-profile-photo";

/** CSS selector for every profile-photo anchor. */
export const PROFILE_ANCHOR_SELECTOR = `[${PROFILE_ANCHOR_ATTR}]`;

/**
 * rootMargin: shrink the top so the hero exits slightly before the nav handoff
 * finishes; expand the bottom so Let's talk counts as visible while the coin
 * is still leaving the nav (contact morph starts ~320px before mid-viewport).
 */
export const PROFILE_ANCHOR_ROOT_MARGIN = "-72px 0px 360px 0px";

export type ProfileAnchorId = string;

export type ProfileAnchorVisibility = {
  /** True when any [data-profile-anchor] intersects the tuned root. */
  anyAnchorVisible: boolean;
  /** Anchor ids currently intersecting (from data-profile-anchor values). */
  visibleAnchors: ReadonlySet<ProfileAnchorId>;
  heroVisible: boolean;
  contactVisible: boolean;
};
