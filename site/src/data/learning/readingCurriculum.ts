/**
 * Personalized reading curriculum for the private /learning page.
 * Edit this list to change order, scope, or Why lines. Essay titles are
 * Tinker essay names in quotes (no links).
 */

export type ReadingCurriculumItem = {
  /** Stable id for React keys. */
  id: string;
  /** Book title. */
  title: string;
  /** Author or publisher attribution. */
  author: string;
  /** Where to start or which chapters. */
  scope: string;
  /**
   * Why this book is on the desk. When `essayTitle` is set, UI cites it in
   * quotes. When null, `why` stands alone (e.g. reading notes, no essay).
   */
  why: string;
  /** Tinker essay title, or null when there is no essay source. */
  essayTitle: string | null;
};

/** Ordered reading curriculum shown on /learning after sign-in. */
export const readingCurriculum: ReadingCurriculumItem[] = [
  {
    id: "design-of-web-apis",
    title: "The Design of Web APIs",
    author: "Arnaud Lauret",
    scope: "Starting now",
    why: "How endpoints map to resources.",
    essayTitle: "Buy the web APIs book?",
  },
  {
    id: "domain-driven-design",
    title: "Domain-Driven Design",
    author: "Eric Evans",
    scope: "Picking up at Ch 2",
    why: "Splitting work into meaningful business units; bounded contexts.",
    essayTitle: "why would you ever go back and read the code?",
  },
  {
    id: "site-reliability-engineering",
    title: "Site Reliability Engineering",
    author: "Google",
    scope: "Ch 3, 4, 6, 14, 15",
    why: "SLOs and monitoring.",
    essayTitle: "Merchant portal reliability",
  },
  {
    id: "payments-systems-us",
    title: "Payments Systems in the U.S.",
    author: "Glenbrook",
    scope: "Fintech domain frameworks",
    why: "Fintech domain frameworks from DDD reading notes.",
    essayTitle: null,
  },
  {
    id: "resilient-web-design",
    title: "Resilient Web Design",
    author: "Jeremy Keith",
    scope: "Whole book",
    why: "Web interfaces for learning scientists.",
    essayTitle: "I'm solid on people management",
  },
];
