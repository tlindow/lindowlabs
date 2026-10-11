"use client";

import { Calendar } from "lucide-react";
import { RETREAT_CALENDLY_URL } from "@/data/retreatPage";

/**
 * Same Calendly event the page used before the retreat rebuild:
 * https://calendly.com/tylerlindow/get-your-time-back (account tylerlindow).
 *
 * Primary action matches today's mechanism: "Choose a time" opens that event.
 * Inline iframe shows the same event's picker in place when Calendly allows it.
 * Availability comes from Calendly + Tyler's Google Calendar, not this app.
 */
export default function RetreatCalendly() {
  const embedSrc = `${RETREAT_CALENDLY_URL}?embed_domain=lindowlabs.dev&embed_type=Inline`;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5" data-retreat="scheduler">
      <a
        href={RETREAT_CALENDLY_URL}
        target="_blank"
        rel="noopener noreferrer"
        data-retreat="calendly-link"
        className="retreat-cta inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm sm:text-base font-semibold focus:outline-none"
        title="Choose a time with Tyler Lindow"
      >
        <Calendar size={15} className="shrink-0" aria-hidden="true" />
        <span>Choose a time</span>
      </a>

      <div className="calendly-inline-widget w-full overflow-hidden rounded-2xl">
        <iframe
          title="Choose a time on Calendly"
          src={embedSrc}
          className="w-full border-0"
          style={{ minWidth: "320px", height: "700px" }}
          loading="lazy"
        />
      </div>
    </div>
  );
}
