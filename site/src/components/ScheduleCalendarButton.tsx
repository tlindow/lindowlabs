"use client";

import { Calendar } from "lucide-react";
import { usePageAudio } from "@/context/PageAudioProvider";
import { usePrefersReducedMotion } from "@/hooks/useProfileAnchors";
import {
  CALENDLY_SCHEDULE_LABEL,
  openCalendlyPopup,
} from "@/lib/calendly";
import { trackFunnel } from "@/lib/funnel";

type Placement = "hero" | "dock";

type ScheduleCalendarButtonProps = {
  /** Hero sits beside Download resume; dock is a control in the glass pill. */
  placement: Placement;
};

/** Calendly brand blue fill + white glyph (hero and dock). */
const CALENDLY_BTN_SURFACE =
  "bg-[#0069ff] hover:bg-[#0058d6] text-[#ffffff] border border-[#0069ff] hover:border-[#0058d6]";

const HERO_BTN_CLASS =
  `inline-flex h-[2.625rem] w-[2.625rem] sm:h-11 sm:w-11 items-center justify-center rounded-xl ${CALENDLY_BTN_SURFACE} shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/40`;

const DOCK_BTN_CLASS =
  `inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full ${CALENDLY_BTN_SURFACE} shrink-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0069ff]/40`;

/**
 * Calendar icon that opens Calendly's popup (connect URL + stored UTMs).
 * Hero and dock share one logical control: only one is interactive/visible
 * at a time, with the same opacity fade as the bottom audio dock.
 */
export default function ScheduleCalendarButton({
  placement,
}: ScheduleCalendarButtonProps) {
  const { hasClip, isPastHero, showNavPhoto } = usePageAudio();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dock visible past hero while nav owns the photo (same as BottomDockPlayer).
  const dockVisible = hasClip && isPastHero && showNavPhoto;
  const showHere =
    placement === "dock" ? dockVisible : !dockVisible;

  const fadeClass = prefersReducedMotion
    ? ""
    : "motion-safe:transition-opacity motion-safe:duration-300 motion-safe:ease-out";

  const onClick = () => {
    trackFunnel("schedule_calendar_icon");
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
      className={`${placement === "hero" ? HERO_BTN_CLASS : DOCK_BTN_CLASS} ${fadeClass} ${
        showHere
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <Calendar
        size={placement === "hero" ? 16 : 14}
        className="shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}
