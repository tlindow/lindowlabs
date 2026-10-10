/**
 * Personalized reading curriculum for the private /learning page (owner only).
 * Each item seals a gap relative to resume lines, motivated by Tinker essays.
 * Books over online resources. Every book has a repo exercise done in Tinker.
 *
 * Essay quotes: only include a short quote when it is already checked into
 * this repo's data. Titles alone are fine when the essay body is not here.
 */

import {
  curriculumExerciseLinks,
  type CurriculumExerciseLinks,
} from "@/lib/learning/openInTinker";

export type ReadingCurriculumItem = {
  /** Stable id for React keys. */
  id: string;
  /** Book title. */
  title: string;
  /** Author or publisher attribution. */
  author: string;
  /** Where to start or which chapters. */
  scope: string;
  /** Resume line this book backs. */
  resumeLine: string;
  /**
   * Tinker essay title that motivated the pick, or null when the source is
   * reading notes / another non-essay cue.
   */
  essayTitle: string | null;
  /**
   * Short quote from the essay, only when already present in repo data.
   * Otherwise null (do not invent or pull live Tinker bodies into the desk).
   */
  essayQuote: string | null;
  /** Non-essay source line when essayTitle is null (e.g. DDD reading notes). */
  essaySource: string | null;
  /** Optional note (e.g. free online edition). */
  bookNote: string | null;
  /** Linked exercise under exercises/<id>. */
  exercise: CurriculumExerciseLinks;
};

/** Ordered reading curriculum shown on /learning after owner sign-in. */
export const readingCurriculum: ReadingCurriculumItem[] = [
  {
    id: "design-of-web-apis",
    title: "The Design of Web APIs",
    author: "Arnaud Lauret",
    scope: "Whole book",
    resumeLine: "Affirm merchant and partner integrations",
    essayTitle: "Buy the web APIs book?",
    essayQuote: null,
    essaySource: null,
    bookNote: null,
    exercise: curriculumExerciseLinks(
      "api-design",
      "Model Merchant, Order, and Refund as resources, map routes and methods, then write the OpenAPI spec (plain English first)."
    ),
  },
  {
    id: "domain-driven-design",
    title: "Domain-Driven Design",
    author: "Eric Evans",
    scope: "From Ch 2",
    resumeLine: "Merchant domain architecture review",
    essayTitle: "why would you ever go back and read the code?",
    essayQuote: null,
    essaySource: null,
    bookNote: null,
    exercise: curriculumExerciseLinks(
      "bounded-contexts",
      "Split a small checkout codebase into bounded contexts (Merchant, Payments, Disputes) using the team's language."
    ),
  },
  {
    id: "site-reliability-engineering",
    title: "Site Reliability Engineering",
    author: "Google",
    scope: "Ch 3, 4, 6, 14, 15",
    resumeLine:
      "Merchant Portal ~99.7% to 99.9%; outage detection ~1h to under 5 min",
    essayTitle: "Merchant portal reliability",
    essayQuote: null,
    essaySource: null,
    bookNote: "Free at sre.google",
    exercise: curriculumExerciseLinks(
      "merchant-portal-slos",
      "Write SLOs and an error budget for a merchant portal, then an alert check for fast budget burn."
    ),
  },
  {
    id: "payments-systems-us",
    title: "Payments Systems in the U.S.",
    author: "Glenbrook",
    scope: "Whole book",
    resumeLine: "Affirm merchant engineering",
    essayTitle: null,
    essayQuote: null,
    essaySource: "DDD reading notes (needs fintech frameworks)",
    bookNote: null,
    exercise: curriculumExerciseLinks(
      "card-payment-lifecycle",
      "Model one card payment through authorization, capture, clearing, and settlement as a state machine."
    ),
  },
  {
    id: "designing-data-intensive-applications",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    scope: "Ch 7 only",
    resumeLine: "Merchant data platform RPCs replacing Snowflake",
    essayTitle: "I'm still learning how to code everyday",
    essayQuote: null,
    essaySource: null,
    bookNote: null,
    exercise: curriculumExerciseLinks(
      "idempotent-refund",
      "Build an idempotent refund endpoint so the same refund twice refunds once."
    ),
  },
  {
    id: "grokking-algorithms",
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    scope: "Whole book",
    resumeLine: "Still closing DS&A gaps for merchant data work",
    essayTitle: "I'm still learning how to code everyday",
    essayQuote: null,
    essaySource: null,
    bookNote: null,
    exercise: curriculumExerciseLinks(
      "settlement-binary-search",
      "One chapter's algorithm per session on merchant data (e.g. binary search over sorted settlement records)."
    ),
  },
];
