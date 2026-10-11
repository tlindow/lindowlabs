"use client";

import { RETREAT_CALENDLY_URL } from "@/data/retreatPage";

/**
 * Inline Calendly for https://calendly.com/tylerlindow/get-your-time-back.
 * Availability comes from that Calendly event + Tyler's Google Calendar.
 */
export default function RetreatCalendly() {
  const embedSrc = `${RETREAT_CALENDLY_URL}?embed_domain=lindowlabs.dev&embed_type=Inline`;

  return (
    <div className="w-full max-w-3xl mx-auto" data-retreat="scheduler">
      <div className="calendly-inline-widget w-full overflow-hidden rounded-[var(--tk-radius-card)]">
        <iframe
          title="Choose a time on Calendly"
          src={embedSrc}
          className="w-full border-0"
          style={{ minWidth: "320px", height: "700px" }}
          loading="lazy"
          data-retreat="calendly-embed"
        />
      </div>
    </div>
  );
}
