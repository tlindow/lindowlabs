import learningJson from "@/data/learning.json";

export type LearningType = "Reading" | "Exercise";
export type LearningStatus = "In progress" | "Not started" | "Done";

export type LearningItem = {
  type: LearningType;
  name: string;
  author?: string;
  topic: string;
  status: LearningStatus | string;
  link?: string;
  note?: string;
};

export const learningItems = learningJson as LearningItem[];

const STATUS_ORDER: Record<string, number> = {
  "In progress": 0,
  "Not started": 1,
  Done: 2,
};

export function learningItemsByType(type: LearningType): LearningItem[] {
  return learningItems
    .filter((item) => item.type === type)
    .sort((a, b) => {
      const statusDiff =
        (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return a.name.localeCompare(b.name);
    });
}
