"use client";

import { useEffect } from "react";

/**
 * INTENTIONAL REGRESSION (throwaway / LL-86 proof): fixed layer paints over the
 * sticky nav (z-index ≥ nav). Visual QA overlap check must catch this.
 */
export default function VisualQaStickyNavOverlap() {
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("data-visual-qa-regression", "sticky-nav-overlap");
    el.textContent = "REGRESSION: over sticky nav";
    Object.assign(el.style, {
      position: "fixed",
      top: "0",
      left: "0",
      right: "0",
      height: "56px",
      zIndex: "60",
      background: "rgba(220, 38, 38, 0.35)",
      color: "#fff",
      fontSize: "12px",
      fontFamily: "monospace",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    });
    document.body.appendChild(el);
    return () => {
      el.remove();
    };
  }, []);

  return null;
}
