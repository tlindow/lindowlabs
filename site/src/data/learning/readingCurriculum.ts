/**
 * Owner-only /learning curriculum as one essay: title, intro, six modules.
 * Prose is verbatim from Tyler. Non-owners never receive this payload.
 *
 * DDIA chapter numbers are 2nd edition (O'Reilly ISBN 9781098119058):
 * Ch 7 Sharding, Ch 8 Transactions, Ch 9 The Trouble with Distributed Systems,
 * Ch 10 Consistency and Consensus.
 */

import {
  curriculumExerciseLinks,
  type CurriculumExerciseLinks,
} from "@/lib/learning/openInTinker";

/** Official book site for Vitillo 2nd edition. */
export const VITILLO_BOOK_URL = "https://understandingdistributed.systems/";

/** O'Reilly library page for DDIA 2nd edition (ISBN 9781098119058). */
export const DDIA_2E_BOOK_URL =
  "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/";

export type ReadingCurriculumItem = {
  /** Stable id for React keys. */
  id: string;
  /** 1-based order in the essay. */
  number: number;
  /**
   * Module heading after the number, verbatim
   * (e.g. "Designing Data-Intensive Applications (Kleppmann), 2nd ed., Ch 7–10.").
   */
  heading: string;
  /** Short track title (book title, or exercise name when no book). */
  title: string;
  /** Author attribution, or a short non-book label (e.g. "Exercise"). */
  author: string;
  /** Chapter scope or exercise scope line. */
  scope: string;
  /**
   * Chapters already covered in this module only (verbatim label body).
   * Not the Already read shelf; partial reads do not count as finished books.
   */
  coveredWithinModule?: string;
  /** Body prose under the heading (verbatim). */
  prose: string;
  /**
   * Considered-instead paragraph body (verbatim; label rendered separately).
   * Omit on exercise-only modules.
   */
  consideredInstead?: string;
  /**
   * Optional Already-read note body after Considered instead (verbatim;
   * label rendered separately).
   */
  alreadyReadNote?: string;
  /**
   * Where to get the physical/ebook copy. Omit when the module has no book
   * (exercise-only).
   */
  getBookUrl?: string;
  /** Linked exercises in essay order (empty when the module has none). */
  exercises: CurriculumExerciseLinks[];
};

/** True when the module has a book to get (not exercise-only). */
export function moduleHasBook(item: ReadingCurriculumItem): boolean {
  return Boolean(item.getBookUrl);
}

/** Count of modules that include a book. */
export function curriculumBookCount(
  items: ReadingCurriculumItem[] = readingCurriculum
): number {
  return items.filter(moduleHasBook).length;
}

/** Essay title (owner desk H1). */
export const curriculumEssayTitle =
  "A curriculum for an engineering manager in developer experience and payments";

/** Intro paragraph under the title (verbatim). */
export const curriculumEssayIntro =
  "You led merchant and partner integrations at Affirm, ran the merchant domain architecture review, and owned reliability for Merchant Portal. Your Tinker essays show where your understanding is thinner than those claims. You can't yet say how API resources map to routes. You've outgrown introductory reliability material but haven't studied what sits under it. You lean on analogies from other fields when fintech has its own frameworks. And you've said you never mastered data structures and algorithms. This curriculum closes those gaps in order of how often an interviewer will press on them. The API design exercise comes first so you practice turning Merchant, Order, and Refund into routes before the books. Understanding Distributed Systems (Vitillo) comes before Designing Data-Intensive Applications (Kleppmann) because it gives the vocabulary so Kleppmann's rigor lands. Grokking Algorithms runs alongside everything else. Vitillo arrives end of day Wed Oct 14.";

/**
 * Ordered modules. Exercise folder ids stay stable; order matches the essay.
 * Lineup: API design (exercise-only), Vitillo, Khononov, Glenbrook, Kleppmann
 * Ch 7-10 (2nd ed), Grokking (alongside). Only one exercise: api-design.
 */
export const readingCurriculum: ReadingCurriculumItem[] = [
  {
    id: "api-design",
    number: 1,
    heading: "API design exercise.",
    title: "API design",
    author: "Exercise",
    scope: "in Tinker",
    prose:
      "No book here. The gap is turning resources into routes, and that only sticks by building it. Each step models Merchant, Order, and Refund in the payments domain and grows an OpenAPI spec by hand, so the design choices come from writing it, not from reading about it.",
    exercises: [
      curriculumExerciseLinks(
        "api-design",
        "model Merchant, Order and Refund as resources, map each one to routes and methods, then write the OpenAPI spec."
      ),
    ],
  },
  {
    id: "understanding-distributed-systems",
    number: 2,
    heading: "Understanding Distributed Systems (Vitillo), 2nd edition.",
    title: "Understanding Distributed Systems",
    author: "Roberto Vitillo",
    scope: "Whole book, 2nd edition",
    prose:
      "It covers the same ground as Kleppmann (replication, sharding, consistency, failure, resiliency) in shorter practitioner chapters, giving the vocabulary so Kleppmann lands.",
    consideredInstead:
      "System Design Interview (Alex Xu) is easier but teaches patterns to recite rather than reasons.",
    getBookUrl: VITILLO_BOOK_URL,
    exercises: [],
  },
  {
    id: "learning-domain-driven-design",
    number: 3,
    heading: "Learning Domain-Driven Design (Khononov).",
    title: "Learning Domain-Driven Design",
    author: "Vladik Khononov",
    scope: "Whole book",
    prose:
      'The merchant domain architecture review reshaped an org. In "why would you ever go back and read the code?" you said reading the codebase let you "split work into meaningful business units." That\'s bounded contexts, done by instinct. An interviewer will ask how you chose those lines, so the gap is strategic design: how to find subdomains, draw boundaries, and match them to teams. Khononov opens with exactly that and connects it to how teams are organized, which is what a manager has to defend.',
    consideredInstead:
      "Domain-Driven Design (Evans) is the original, but it spends most of its pages on modeling objects in code and leaves strategic design for the last part. Implementing Domain-Driven Design (Vernon) is aimed at the engineer writing the code, not the manager drawing the boundaries.",
    getBookUrl:
      "https://www.oreilly.com/library/view/learning-domain-driven-design/9781098100124/",
    exercises: [],
  },
  {
    id: "payments-systems-us",
    number: 4,
    heading: "Payments Systems in the U.S. (Glenbrook).",
    title: "Payments Systems in the U.S.",
    author: "Glenbrook",
    scope: "Whole book",
    prose:
      'Your DDD notes say you need "frameworks, architectures, or common ways of doing things in the fintech domain," and that borrowing analogies from other fields is a problem. At a fintech, how money moves is assumed knowledge for a senior EM. Glenbrook is the reference for card networks, ACH, wires and settlement, which is the system Affirm\'s merchants plug into.',
    consideredInstead:
      "The Anatomy of the Swipe (Siddiqui) is a readable story of the card industry, but it covers cards as a business, not payment systems as a structure, and it leaves out ACH and settlement.",
    getBookUrl:
      "https://glenbrook.com/product/payments-systems-in-the-us-a-guide-for-the-payments-professionals/",
    exercises: [],
  },
  {
    id: "designing-data-intensive-applications",
    number: 5,
    heading:
      "Designing Data-Intensive Applications (Kleppmann), 2nd edition, Ch 7, 8, 9 and 10.",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    scope: "2nd edition, Ch 7, 8, 9 and 10",
    prose:
      "Tyler's reliability work was about integrations failing: slow partners, a fragile dependency, outages that took an hour to notice. Chapters 9 and 10 explain what's underneath those failures, including partial failure, unreliable networks and clocks, and what it takes for separate systems to agree. That's the layer he hasn't studied, and it's what lets an engineering leader judge reliability designs instead of just reacting to outages. Chapter 8 covers transactions, where a payments mistake moves money twice. Understanding Distributed Systems (Vitillo) comes first so this is the rigorous version.",
    consideredInstead:
      "*Site Reliability Engineering* (Google) was started and sat below Tyler's level, since it restates availability and SLO work he already led. *Release It!* (Nygard) teaches the right patterns but at a practitioner pace. Kleppmann's Chapters 9 and 10 explain why those patterns are needed, which is the harder and more durable layer. Database Internals (Petrov) goes down to storage engines, which is deeper than an EM needs.",
    getBookUrl: DDIA_2E_BOOK_URL,
    exercises: [],
  },
  {
    id: "grokking-algorithms",
    number: 6,
    heading: "Grokking Algorithms (Bhargava), alongside everything else.",
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    scope: "alongside everything else",
    prose:
      "No resume line backs this one. It's a hiring screen, since many EM loops still include a coding round. You wrote that you never mastered data structures and algorithms, and that Formation's material reads like notes, not a book. Grokking Algorithms runs alongside everything else.",
    consideredInstead:
      "Introduction to Algorithms (CLRS) is the full reference, but it's far heavier than a job search allows. Cracking the Coding Interview is a question bank to practice from, not a book to learn from, so it fits better after Grokking.",
    getBookUrl: "https://www.manning.com/books/grokking-algorithms",
    exercises: [],
  },
];
