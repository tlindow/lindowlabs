"use client";

import type { MouseEvent } from "react";
import { Calendar } from "lucide-react";
import {
  CALENDLY_CONNECT_URL,
  CALENDLY_SCHEDULE_LABEL,
} from "@/lib/calendly";
import { trackFunnel, withPageUtms } from "@/lib/funnel";

export type SchedulePlacement = "hero" | "contact";

type ScheduleCalendarButtonProps = {
  /**
   * hero: labeled CTA beside Download resume (always visible at the top).
   * contact: labeled CTA in Let's talk beside LinkedIn / email.
   */
  placement: SchedulePlacement;
};

/** Calendly brand blue fill + white glyph / text. */
const CALENDLY_BTN_SURFACE =
  "bg-[#0069ff] hover:bg-[#0058d6] text-[#ffffff] border border-[#0069ff] hover:border-[#0058d6]";

const LABELED_BTN_CLASS =
  `inline-flex items-center gap-2 rounded-xl ${CALENDLY_BTN_SURFACE} px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/40`;

/**
 * Schedule time control: opens Calendly connect in a new tab (with stored
 * UTMs). Hero stays visible when the audio player docks. Contact is always
 * shown in Let's talk. Funnel click still fires before navigation.
 */
export default function ScheduleCalendarButton({
  placement,
}: ScheduleCalendarButtonProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackFunnel("schedule_calendar_icon", { location: placement });
    // Merge stored landing utm_* onto the Calendly URL before the tab opens.
    event.currentTarget.href = withPageUtms(CALENDLY_CONNECT_URL);
  };

  return (
    <a
      href={CALENDLY_CONNECT_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label={CALENDLY_SCHEDULE_LABEL}
      title={CALENDLY_SCHEDULE_LABEL}
      data-schedule="calendar-icon"
      data-schedule-placement={placement}
      className={LABELED_BTN_CLASS}
    >
      <Calendar size={15} className="shrink-0" aria-hidden="true" />
      <span>{CALENDLY_SCHEDULE_LABEL}</span>
    </a>
  );
}
