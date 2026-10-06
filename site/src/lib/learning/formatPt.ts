/** Format an ISO timestamp as "<time> PT" for UI footers. */
export function formatAsOfPt(iso: string | null | undefined): string {
  if (!iso) return "unknown time PT";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "unknown time PT";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const month = get("month");
  const day = get("day");
  const year = get("year");
  const hour = get("hour");
  const minute = get("minute");
  const dayPeriod = get("dayPeriod");

  return `${month} ${day}, ${year} ${hour}:${minute} ${dayPeriod} PT`;
}
