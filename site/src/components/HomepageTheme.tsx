"use client";

import { useEffect, type ReactNode } from "react";

/** Applies the recruiter homepage lavender theme and body background. */
export default function HomepageTheme({ children }: { children: ReactNode }) {
  useEffect(() => {
    const previous = document.body.style.background;
    document.body.style.background = "#F3EEF8";
    return () => {
      document.body.style.background = previous;
    };
  }, []);

  return (
    <div className="homepage-theme min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between overflow-x-clip">
      {children}
    </div>
  );
}
