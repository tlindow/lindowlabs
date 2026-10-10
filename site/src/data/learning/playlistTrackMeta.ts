/**
 * Playlist track length metadata. Chapter counts only when the essay lists
 * specific chapters; otherwise estimated hours only (no invented chapter totals).
 */

export type PlaylistTrackMeta = {
  /** Listed chapter labels (essay scope), or null when whole-book / unknown. */
  chapterLabels: string[] | null;
  /** Rough listen/read hours estimate for the length column. */
  estimatedHours: number;
};

/** Per curriculum book id. */
export const playlistTrackMeta: Record<string, PlaylistTrackMeta> = {
  "site-reliability-engineering": {
    chapterLabels: ["Ch 3", "Ch 4", "Ch 6", "Ch 14", "Ch 15"],
    estimatedHours: 8,
  },
  "design-of-web-apis": {
    chapterLabels: null,
    estimatedHours: 10,
  },
  "learning-domain-driven-design": {
    chapterLabels: null,
    estimatedHours: 8,
  },
  "payments-systems-us": {
    chapterLabels: null,
    estimatedHours: 6,
  },
  "designing-data-intensive-applications": {
    chapterLabels: ["Ch 7"],
    estimatedHours: 3,
  },
  "grokking-algorithms": {
    chapterLabels: null,
    estimatedHours: 8,
  },
};

/** Song-length style label: "5 ch · ~8h" or "~10h". */
export function formatTrackLength(meta: PlaylistTrackMeta | undefined): string {
  if (!meta) return "~?h";
  const hours = `~${meta.estimatedHours}h`;
  if (meta.chapterLabels && meta.chapterLabels.length > 0) {
    return `${meta.chapterLabels.length} ch · ${hours}`;
  }
  return hours;
}
