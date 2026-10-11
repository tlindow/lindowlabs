"use client";

import { useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { RETREAT_CALENDLY_URL } from "@/data/retreatPage";

const CALENDLY_SCRIPT =
  "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget?: (opts: {
        url: string;
        parentElement: HTMLElement;
      }) => void;
    };
  }
}

/**
 * Same Calendly event as today's contact leaf:
 * https://calendly.com/tylerlindow/get-your-time-back
 *
 * Renders Calendly's inline time picker for that event (availability from
 * Calendly + Tyler's connected Google Calendar). Falls back to the same
 * external link if the widget script cannot load.
 */
export default function RetreatCalendly() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    const mountFallbackLink = () => {
      if (cancelled || !hostRef.current) return;
      hostRef.current.innerHTML = "";
      const a = document.createElement("a");
      a.href = RETREAT_CALENDLY_URL;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className =
        "retreat-cta inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-mono font-bold";
      a.textContent = "Choose a time";
      hostRef.current.appendChild(a);
    };

    const init = () => {
      if (cancelled || !hostRef.current) return;
      if (!window.Calendly?.initInlineWidget) {
        mountFallbackLink();
        return;
      }
      hostRef.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url: RETREAT_CALENDLY_URL,
        parentElement: hostRef.current,
      });
    };

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CALENDLY_SCRIPT}"]`
    );
    if (existing) {
      if (window.Calendly?.initInlineWidget) init();
      else {
        existing.addEventListener("load", init, { once: true });
        existing.addEventListener("error", mountFallbackLink, { once: true });
      }
    } else {
      const script = document.createElement("script");
      script.src = CALENDLY_SCRIPT;
      script.async = true;
      script.onload = init;
      script.onerror = mountFallbackLink;
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3" data-retreat="scheduler">
      <div
        ref={hostRef}
        className="calendly-inline-widget min-h-[680px] w-full rounded-2xl overflow-hidden"
        data-url={RETREAT_CALENDLY_URL}
        style={{ minWidth: "320px", height: "700px" }}
      />
      <p className="text-center text-xs font-mono opacity-80">
        <a
          href={RETREAT_CALENDLY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline underline-offset-2"
        >
          <Calendar size={12} className="shrink-0" aria-hidden="true" />
          Open in Calendly
        </a>
      </p>
    </div>
  );
}
