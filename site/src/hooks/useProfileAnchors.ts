"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import {
  PROFILE_ANCHOR_ROOT_MARGIN,
  PROFILE_ANCHOR_SELECTOR,
  type ProfileAnchorVisibility,
} from "@/lib/profileAnchors";

type AnchorSnapshot = {
  ids: string[];
};

const EMPTY: AnchorSnapshot = { ids: [] };

let cached: AnchorSnapshot = EMPTY;
const listeners = new Set<() => void>();
let observer: IntersectionObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let intersecting = new Map<Element, string>();

function snapshotFromMap(): AnchorSnapshot {
  const ids = [...new Set(intersecting.values())].sort();
  if (
    ids.length === cached.ids.length &&
    ids.every((id, i) => id === cached.ids[i])
  ) {
    return cached;
  }
  cached = { ids };
  return cached;
}

function emit() {
  const next = snapshotFromMap();
  cached = next;
  for (const listener of listeners) listener();
}

function anchorIdFor(el: Element): string {
  return el.getAttribute("data-profile-anchor") || "anonymous";
}

function observeElement(el: Element) {
  if (!observer) return;
  observer.observe(el);
}

function refreshObservedElements() {
  if (typeof document === "undefined" || !observer) return;
  const nodes = document.querySelectorAll(PROFILE_ANCHOR_SELECTOR);
  const live = new Set(nodes);
  for (const el of intersecting.keys()) {
    if (!live.has(el)) {
      intersecting.delete(el);
      try {
        observer.unobserve(el);
      } catch {
        /* already gone */
      }
    }
  }
  for (const el of nodes) {
    observeElement(el);
  }
  emit();
}

function ensureObserver() {
  if (typeof window === "undefined" || observer) return;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          intersecting.set(entry.target, anchorIdFor(entry.target));
        } else {
          intersecting.delete(entry.target);
        }
      }
      emit();
    },
    {
      root: null,
      rootMargin: PROFILE_ANCHOR_ROOT_MARGIN,
      threshold: 0,
    }
  );

  refreshObservedElements();

  mutationObserver = new MutationObserver(() => {
    refreshObservedElements();
  });
  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["data-profile-anchor"],
  });
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  ensureObserver();
  listeners.add(onStoreChange);
  return () => {
    listeners.delete(onStoreChange);
    if (listeners.size === 0) {
      observer?.disconnect();
      mutationObserver?.disconnect();
      observer = null;
      mutationObserver = null;
      intersecting = new Map();
      cached = EMPTY;
    }
  };
}

function getSnapshot(): AnchorSnapshot {
  ensureObserver();
  return cached;
}

function getServerSnapshot(): AnchorSnapshot {
  return EMPTY;
}

/**
 * Tracks which data-profile-anchor elements intersect the viewport
 * (with tuned rootMargin for hero/contact handoff).
 */
export function useProfileAnchors(): ProfileAnchorVisibility {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const visibleAnchors = useMemo(
    () => new Set(snap.ids),
    [snap.ids]
  );

  const heroVisible = visibleAnchors.has("hero");
  const contactVisible = visibleAnchors.has("contact");

  return {
    anyAnchorVisible: snap.ids.length > 0,
    visibleAnchors,
    heroVisible,
    contactVisible,
  };
}

/** Convenience: nav photo may show only when no profile anchor is in view. */
export function useNavProfilePhotoVisible(): boolean {
  const { anyAnchorVisible } = useProfileAnchors();
  return !anyAnchorVisible;
}

export function usePrefersReducedMotion(): boolean {
  const subscribeMotion = useCallback((onChange: () => void) => {
    if (typeof window === "undefined") return () => {};
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => onChange();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return useSyncExternalStore(
    subscribeMotion,
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}
