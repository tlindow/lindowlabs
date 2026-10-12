"use client";

import { useEffect } from "react";

/**
 * When #hero-below paints past the 100svh #hero-stage, reserve matching flow
 * space on #hero-overflow-spacer so the next section (About) is not covered.
 * Also ensures a minimum gap under #trusted-partners. Shared by homepage and
 * homepage so the credentials strip cannot overlap About.
 */
export function useHeroOverflowSpacer() {
  useEffect(() => {
    const stage = document.getElementById("hero-stage");
    const below = document.getElementById("hero-below");
    const spacer = document.getElementById("hero-overflow-spacer");
    const panel = document.getElementById("trusted-partners");
    if (!stage || !below || !spacer) return;

    const syncOverflow = () => {
      const stageBottom = stage.getBoundingClientRect().bottom;
      // Grid row box can be shorter than painted children (overflow: visible).
      const contentBottom = Math.max(
        below.getBoundingClientRect().bottom,
        ...Array.from(below.children, (child) =>
          child.getBoundingClientRect().bottom
        )
      );
      const spill = Math.max(0, Math.ceil(contentBottom - stageBottom));

      // ~2.5rem mobile / ~3.5rem desktop breathing room under the logo panel.
      const minGapPx = window.matchMedia("(min-width: 640px)").matches
        ? 56
        : 40;
      const panelBottom = panel
        ? panel.getBoundingClientRect().bottom
        : contentBottom;
      const naturalGap = stageBottom - panelBottom;
      const gapPad = Math.max(0, Math.ceil(minGapPx - naturalGap));
      spacer.style.height = `${Math.max(spill, gapPad)}px`;
    };

    syncOverflow();
    const ro = new ResizeObserver(syncOverflow);
    ro.observe(below);
    ro.observe(stage);
    if (panel) ro.observe(panel);
    window.addEventListener("resize", syncOverflow);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncOverflow);
    };
  }, []);
}
