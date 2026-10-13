import type { ClickEvent, ClickTagGroup } from "@/lib/clicks/types";

/**
 * Group visits by tag. Groups ordered by newest visit in the group;
 * visits within each group newest-first.
 */
export function groupClicksByTag(events: ClickEvent[]): ClickTagGroup[] {
  const byTag = new Map<string, ClickEvent[]>();

  for (const event of events) {
    const list = byTag.get(event.tag);
    if (list) list.push(event);
    else byTag.set(event.tag, [event]);
  }

  const groups: ClickTagGroup[] = [];
  for (const [tag, visits] of byTag) {
    visits.sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0));
    groups.push({ tag, visits });
  }

  groups.sort((a, b) => {
    const aTs = a.visits[0]?.ts ?? "";
    const bTs = b.visits[0]?.ts ?? "";
    return aTs < bTs ? 1 : aTs > bTs ? -1 : 0;
  });

  return groups;
}
