/** Normalize a course title for overlay join keys. */
export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Known short keys for the current Reading plan titles. */
export function courseKeyFromTitle(title: string): string {
  const n = normalizeTitle(title);
  if (n.includes("site-reliability") || n === "sre") return "sre";
  if (n.includes("domain-driven-design") || n === "ddd") return "ddd";
  if (n.includes("transformative-tools") || n.includes("tools-for-thought")) {
    return "ttft";
  }
  if (n.includes("typescript") && n.includes("react")) return "ts-react";
  return n.slice(0, 48) || "course";
}

export function lessonKeyFromChapter(n: number): string {
  return `ch${n}`;
}

export function lessonKeyFromLabel(label: string, url: string | null): string {
  const ch = label.match(/\bch(?:apter)?\s*(\d+)\b/i);
  if (ch) return lessonKeyFromChapter(Number(ch[1]));
  if (url) {
    try {
      const path = new URL(url).pathname.replace(/\/+$/, "");
      const last = path.split("/").filter(Boolean).pop();
      if (last) return normalizeTitle(last);
    } catch {
      /* ignore */
    }
  }
  return normalizeTitle(label) || "lesson";
}
