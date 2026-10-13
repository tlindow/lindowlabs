"use client";

import { useEffect } from "react";

/**
 * INTENTIONAL REGRESSION (throwaway / LL-86 proof): throw a removeChild-style
 * DOM error on mount, matching the Calendly badge double-init crash (#197).
 */
export default function VisualQaRegressionNoise() {
  useEffect(() => {
    const orphan = document.createElement("div");
    try {
      document.body.removeChild(orphan);
    } catch (err) {
      // Re-throw so Playwright pageerror / console catches it.
      setTimeout(() => {
        throw err;
      }, 0);
    }
  }, []);

  return null;
}
