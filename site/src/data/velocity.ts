import velocityJson from "@/data/velocity.json";

export type VelocityRepoId = "lindowlabs" | "tinker" | "beginner";

export type VelocityRepo = {
  id: VelocityRepoId | string;
  fullName: string;
  public: boolean;
};

export type VelocityHeadline = {
  prsLast7Days: number;
  weeklyAverage4Weeks: number;
  medianHoursToMerge4Weeks: number | null;
};

export type VelocityWeek = {
  weekStart: string;
  counts: Record<string, number>;
};

export type VelocityShipped = {
  title: string;
  repo: string;
  mergedAt: string;
  url: string;
};

export type VelocityData = {
  generatedAt: string;
  beginnerIncluded: boolean;
  repos: VelocityRepo[];
  headline: VelocityHeadline;
  weeks: VelocityWeek[];
  recentShipped: VelocityShipped[];
};

export const velocityData = velocityJson as VelocityData;

export const VELOCITY_REPO_LABELS: Record<string, string> = {
  lindowlabs: "lindowlabs",
  tinker: "tinker",
  beginner: "beginner",
};

/** Stack fill colors that stay readable on the lavender homepage theme. */
export const VELOCITY_REPO_COLORS: Record<string, string> = {
  lindowlabs: "#4F46E5",
  tinker: "#7C3AED",
  beginner: "#A78BFA",
};

export function formatMedianHours(hours: number | null): string {
  if (hours == null) return "n/a";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 48) return `${hours.toFixed(hours < 10 ? 1 : 0)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

export function formatWeekLabel(weekStart: string): string {
  const date = new Date(`${weekStart}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatMergedDate(isoDate: string): string {
  const date = new Date(`${isoDate.slice(0, 10)}T00:00:00Z`);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
