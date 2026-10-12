"use client";

import { Calendar } from "lucide-react";
import { usePageAudio } from "@/context/PageAudioProvider";
import { usePrefersReducedMotion } from "@/hooks/useProfileAnchors";
import {
  CALENDLY_SCHEDULE_LABEL,
  openCalendlyPopup,
} from "@/lib/calendly";
import { trackFunnel } from "@/lib/funnel";

export type SchedulePlacement = "hero" | "dock" | "contact";

type ScheduleCalendarButtonProps = {
  /**
   * hero: labeled CTA beside Download resume (hands off to dock).
   * dock: compact icon in the glass player.
   * contact: labeled CTA in Let's talk beside LinkedIn / email.
   */
  placement: SchedulePlacement;
};

/** Calendly brand blue fill + white glyph / text. */
const CALENDLY_BTN_SURFACE =
  "bg-[#0069ff] hover:bg-[#0058d6] text-[#ffffff] border border-[#0069ff] hover:border-[#0058d6]";

const LABELED_BTN_CLASS =
  `inline-flex items-center gap-2 rounded-xl ${CALENDLY_BTN_SURFACE} px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/40`;

const DOCK_BTN_CLASS =
  `inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full ${CALENDLY_BTN_SURFACE} shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/40`;

/**
 * Schedule time control: opens Calendly popup (connect URL + stored UTMs).
 * Hero and dock share one logical control (opacity handoff). Contact is
 * always shown in Let's talk.
 */
export default function ScheduleCalendarButton({
  placement,
}: ScheduleCalendarButtonProps) {
  const { hasClip, isPastHero, showNavPhoto } = usePageAudio();
  const prefersReducedMotion = usePrefersReducedMotion();

  const dockVisible = hasClip && isPastHero && showNavPhoto;
  let showHere = true;
  if (placement === "dock") showHere = dockVisible;
  else if (placement === "hero") showHere = !dockVisible;

  const fadeClass = prefersReducedMotion
    ? ""
    : "motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out";

  const labeled = placement === "hero" || placement === "contact";
  const btnClass = labeled ? LABELED_BTN_CLASS : DOCK_BTN_CLASS;

  const onClick = () => {
    trackFunnel("schedule_calendar_icon", { location: placement });
    openCalendlyPopup();
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={CALENDLY_SCHEDULE_LABEL}
      title={CALENDLY_SCHEDULE_LABEL}
      tabIndex={showHere ? 0 : -1}
      aria-hidden={showHere ? undefined : true}
      data-schedule="calendar-icon"
      data-schedule-placement={placement}
      className={`${btnClass} ${fadeClass} ${
        showHere ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <Calendar
        size={labeled ? 15 : 14}
        className="shrink-0"
        aria-hidden="true"
      />
      {labeled ? <span>{CALENDLY_SCHEDULE_LABEL}</span> : null}
    </button>
  );
}
