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

export type VisitorsFunnel = {
  home: number;
  resume_or_blog: number;
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
  { key: "home", label: "Home" },
  { key: "resume_or_blog", label: "Resume or blog" },
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

/** Format week start YYYY-MM-DD as a short UTC label. */
export function formatWeekStart(week: string): string {
  const date = new Date(`${week.slice(0, 10)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return week;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function formatViews(n: number): string {
  return new Intl.NumberFormat("en-US").format(n);
}
