/** Types and labels for the /visitors live totals endpoint. */

export const VISITORS_API_URL =
  "https://tinker.beginner.work/api/site/visitors";

export type VisitorsWeek = {
  week: string;
  views: number;
};

export type VisitorsSource = {
  source: string;
  views: number;
};

export type VisitorsPage = {
  path: string;
  views: number;
};

/** Resume is the site root of the funnel; explore rolls up home + blog + /visitors + /learning. */
export type VisitorsFunnel = {
  resume: number;
  explore: number;
  schedule_time: number;
  booked: number | null;
};

export type VisitorsData = {
  since: string | null;
  weeks: VisitorsWeek[];
  sources: VisitorsSource[];
  pages: VisitorsPage[];
  funnel: VisitorsFunnel;
};

export const FUNNEL_STEPS: {
  key: keyof VisitorsFunnel;
  label: string;
}[] = [
  { key: "resume", label: "Resume" },
  { key: "explore", label: "Explore" },
  { key: "schedule_time", label: "Schedule time" },
  { key: "booked", label: "Calendly booking" },
];

/** Format ISO date as "Mon D, YYYY" in UTC. */
export function formatCountingSince(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Label for a week key. Prefer ISO week strings like "2026-W40" (Monday of
 * that week as "Sep 28"). Falls back to YYYY-MM-DD, else the raw string.
 */
export function formatWeekStart(week: string): string {
  const isoWeek = /^(\d{4})-W(\d{2})$/i.exec(week.trim());
  if (isoWeek) {
    const year = Number(isoWeek[1]);
    const weekNum = Number(isoWeek[2]);
    if (weekNum >= 1 && weekNum <= 53) {
      const monday = mondayOfIsoWeek(year, weekNum);
      return monday.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    }
  }

  const day = /^(\d{4})-(\d{2})-(\d{2})$/.exec(week.trim());
  if (day) {
    const date = new Date(`${day[0]}T00:00:00Z`);
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    }
  }

  return week;
}

/** Monday (UTC) of ISO week `week` in ISO year `year`. */
function mondayOfIsoWeek(year: number, week: number): Date {
  // 4 Jan is always in ISO week 1.
  const jan4 = new Date(Date.UTC(year, 0, 4));
  const jan4Dow = jan4.getUTCDay() || 7; // Mon=1 ... Sun=7
  const mondayWeek1 = new Date(jan4);
  mondayWeek1.setUTCDate(jan4.getUTCDate() - (jan4Dow - 1));
  const monday = new Date(mondayWeek1);
  monday.setUTCDate(mondayWeek1.getUTCDate() + (week - 1) * 7);
  return monday;
}

export function formatViews(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
