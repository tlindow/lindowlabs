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

/** Four-part logical case for why a module is on the desk. */
export type WhyThisModule = {
  claim: string;
  gap: string;
  risk: string;
  close: string;
};

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
  /** Physical / owned copy note, e.g. "Owned (paperback)". */
  ownership: string | null;
  /** Claim / Gap / Risk / Close case for this module. */
  whyThisModule: WhyThisModule;
  /** Linked exercise under exercises/<id>. */
  exercise: CurriculumExerciseLinks;
};

/**
 * Shown once above the reading list. Explains curriculum order.
 * Owner-only (same payload as readingCurriculum).
 */
export const curriculumOrderRationale =
  "Order: 1 and 3 back up your two strongest resume claims, so they come first. 2 and 4 deepen your domain knowledge, 5 builds on 4, and 6 runs alongside as interview prep.";

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
    ownership: null,
    whyThisModule: {
      claim:
        "you led merchant and partner integrations, which are APIs that other companies build on.",
      gap: 'in "Buy the web APIs book?" you couldn\'t say how endpoints map to resources.',
      risk: "DevX and integrations interviews ask you to judge an API design, and you'd be judging without a model.",
      close:
        "Lauret builds that model from resources outward, and the OpenAPI exercise proves you can produce one, not just recognize one.",
    },
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
    ownership: null,
    whyThisModule: {
      claim:
        "you led the merchant domain architecture review that reshaped the merchant org.",
      gap: 'in "why would you ever go back and read the code?" you described splitting work into business units by instinct, without the vocabulary for it.',
      risk: "an interviewer will ask how you decided where the boundaries go, and instinct isn't a defensible answer.",
      close:
        "bounded contexts turn that instinct into a method you can explain, and splitting the checkout codebase applies it.",
    },
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
    ownership: "Owned (paperback)",
    whyThisModule: {
      claim:
        "you took Merchant Portal from ~99.7% to 99.9% availability and cut outage detection from ~1 hour to under 5 minutes.",
      gap: 'in "Merchant portal reliability" you weren\'t comfortable defending the availability number, and the incidents came from adding logging.',
      risk: "you can't confidently own your strongest metric on the resume.",
      close:
        "SLOs and error budgets explain why more logging surfaces more incidents and why 99.9% counts. The alert exercise ties that back to your detection-time win.",
    },
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
    ownership: null,
    whyThisModule: {
      claim: "you spent six years in merchant engineering at Affirm.",
      gap: "your DDD notes say you lean on analogies from other domains instead of fintech frameworks.",
      risk: 'at a fintech, "how does money actually move" is basic knowledge for a senior EM.',
      close:
        "Glenbrook gives you the payment lifecycle, and the state-machine exercise makes you encode it exactly.",
    },
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
    ownership: null,
    whyThisModule: {
      claim:
        "you moved Merchant Portal off Snowflake onto the merchant data platform's RPCs.",
      gap: 'in "I\'m still learning how to code everyday" you said data management is at the core and you haven\'t done much of it.',
      risk: "in payments, a data mistake means money moves twice.",
      close:
        "Ch 7 covers transactions, and the idempotent refund exercise is that exact failure mode.",
    },
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
    resumeLine: "Hiring screen (not a resume line)",
    essayTitle: "I'm still learning how to code everyday",
    essayQuote: null,
    essaySource: null,
    bookNote: null,
    ownership: null,
    whyThisModule: {
      claim: "none on the resume. This one is a hiring screen, not a resume line.",
      gap: "the same essay says you never mastered data structures and algorithms.",
      risk: "many EM loops still include a coding round.",
      close:
        "it's book-format, which suits how you learn, and applying each algorithm to merchant data keeps it tied to your work.",
    },
    exercise: curriculumExerciseLinks(
      "settlement-binary-search",
      "One chapter's algorithm per session on merchant data (e.g. binary search over sorted settlement records)."
    ),
  },
];
