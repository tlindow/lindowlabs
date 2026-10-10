/**
 * Owner-only /learning curriculum as one essay: title, intro, six modules.
 * Prose is verbatim from Tyler. Non-owners never receive this payload.
 */

import {
  curriculumExerciseLinks,
  type CurriculumExerciseLinks,
} from "@/lib/learning/openInTinker";

/** Free SRE book (Google). Used as Get the book for module 1. */
export const SRE_FREE_BOOK_URL =
  "https://sre.google/sre-book/table-of-contents/";

export type ReadingCurriculumItem = {
  /** Stable id for React keys. */
  id: string;
  /** 1-based order in the essay. */
  number: number;
  /**
   * Module heading after the number, verbatim
   * (e.g. "Site Reliability Engineering (Google), Ch 3, 4, 6, 14 and 15.").
   */
  heading: string;
  /** Short book title for tests / cross-checks. */
  title: string;
  /** Author attribution for tests / cross-checks. */
  author: string;
  /** Chapter scope for tests / cross-checks. */
  scope: string;
  /** Body prose under the heading (verbatim). */
  prose: string;
  /** Considered-instead paragraph body (verbatim; label rendered separately). */
  consideredInstead: string;
  /** Where to get the physical/ebook copy (publisher or free official). */
  getBookUrl: string;
  /** Linked exercise; summary matches the essay Exercise line exactly. */
  exercise: CurriculumExerciseLinks;
};

/** Essay title (owner desk H1). */
export const curriculumEssayTitle =
  "A curriculum for an engineering manager in developer experience and payments";

/** Intro paragraph under the title (verbatim). */
export const curriculumEssayIntro =
  "You led merchant and partner integrations at Affirm, ran the merchant domain architecture review, and owned reliability for Merchant Portal. Your Tinker essays show where your understanding is thinner than those claims. You can't yet say how API resources map to routes. You aren't confident defending your own availability number. You lean on analogies from other fields when fintech has its own frameworks. And you've said you never mastered data structures and algorithms. This curriculum closes those gaps in order of how often an interviewer will press on them. Each module is a book, because you've written that you learn best from something that reads like a book and that scattered notes don't stick. Each book comes with one exercise in Tinker.";

/**
 * Ordered modules. Exercise folder ids stay stable; order matches the essay.
 * Lineup: SRE, Lauret, Khononov, Glenbrook, Kleppmann Ch 7, Grokking.
 */
export const readingCurriculum: ReadingCurriculumItem[] = [
  {
    id: "site-reliability-engineering",
    number: 1,
    heading: "Site Reliability Engineering (Google), Ch 3, 4, 6, 14 and 15.",
    title: "Site Reliability Engineering",
    author: "Google",
    scope: "Ch 3, 4, 6, 14 and 15",
    prose:
      'Your strongest resume claims are reliability claims: Merchant Portal from ~99.7% to 99.9%, and outage detection cut from ~1 hour to under 5 minutes. In "Merchant portal reliability" you wrote that you weren\'t comfortable claiming the 99.9%, and that the 10 incidents came from adding logging you didn\'t have before. Defending that takes two ideas together: SLOs (reliability targets) and error budgets explain why 99.9% matters, and monitoring and postmortem culture explain why more visibility shows more incidents. These five chapters are the only book source that covers both, written by the team that defined the terms. It comes first because it backs up the number an interviewer is most likely to ask about.',
    consideredInstead:
      "Implementing Service Level Objectives (Hidalgo) goes deeper on SLOs, but it leaves out incidents and postmortems, which is half your story. The Site Reliability Workbook is a set of worked examples that assumes you already know these concepts.",
    getBookUrl: SRE_FREE_BOOK_URL,
    exercise: curriculumExerciseLinks(
      "merchant-portal-slos",
      "write SLOs and an error budget for a merchant portal, then a small check that alerts when errors burn through the budget too fast."
    ),
  },
  {
    id: "design-of-web-apis",
    number: 2,
    heading: "The Design of Web APIs (Lauret).",
    title: "The Design of Web APIs",
    author: "Arnaud Lauret",
    scope: "Whole book",
    prose:
      'Integrations are APIs that other companies build on. In "Buy the web APIs book?" you described a resource as "sort of like an object," then stopped at "I don\'t know" when asked how endpoints map to it. A DevX or integrations interview will ask you to judge an API design, and that judgment needs a model of resources first. Lauret builds that model from the resource outward, and uses OpenAPI, the same spec format your api-design exercises use.',
    consideredInstead:
      "Designing Web APIs (Jin, Sahni, Shevat) is strong on running an API as a product, covering versioning, scaling and developer programs, but it assumes the design intuition the gap says is missing. API Design Patterns (Geewax) is a catalog for people who already design APIs.",
    getBookUrl: "https://www.manning.com/books/the-design-of-web-apis",
    exercise: curriculumExerciseLinks(
      "api-design",
      "model Merchant, Order and Refund as resources, map each one to routes and methods, then write the OpenAPI spec."
    ),
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
    exercise: curriculumExerciseLinks(
      "bounded-contexts",
      "split a small checkout codebase into Merchant, Payments and Disputes contexts, naming each in the words your team actually used."
    ),
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
    exercise: curriculumExerciseLinks(
      "card-payment-lifecycle",
      "trace one card payment through authorization, capture, clearing and settlement as a state machine in code."
    ),
  },
  {
    id: "designing-data-intensive-applications",
    number: 5,
    heading: "Designing Data-Intensive Applications (Kleppmann), Ch 7 only.",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    scope: "Ch 7 only",
    prose:
      'You moved Merchant Portal off Snowflake and onto the merchant data platform\'s RPCs. In "I\'m still learning how to code everyday" you said data management is the core of the work and you haven\'t done much of it. In payments, a data mistake means money moves twice. Ch 7, on transactions, covers exactly that failure. The rest of the book is about scaling and storage, which your resume doesn\'t need to defend.',
    consideredInstead:
      "Database Internals (Petrov) goes down to storage engines, which is deeper than an EM needs. The Postgres docs on transaction isolation cover the same ground, but they're online reference, and books come first.",
    getBookUrl: "https://dataintensive.net/",
    exercise: curriculumExerciseLinks(
      "idempotent-refund",
      "build an idempotent refund endpoint, meaning a refund sent twice only refunds once."
    ),
  },
  {
    id: "grokking-algorithms",
    number: 6,
    heading: "Grokking Algorithms (Bhargava), alongside everything else.",
    title: "Grokking Algorithms",
    author: "Aditya Bhargava",
    scope: "alongside everything else",
    prose:
      "No resume line backs this one. It's a hiring screen, since many EM loops still include a coding round. You wrote that you never mastered data structures and algorithms, and that Formation's material reads like notes, not a book. Grokking reads like a book and keeps each idea short, so it runs alongside the other modules.",
    consideredInstead:
      "Introduction to Algorithms (CLRS) is the full reference, but it's far heavier than a job search allows. Cracking the Coding Interview is a question bank to practice from, not a book to learn from, so it fits better after Grokking.",
    getBookUrl: "https://www.manning.com/books/grokking-algorithms",
    exercise: curriculumExerciseLinks(
      "settlement-binary-search",
      "one algorithm per session, applied to merchant data, like binary search over sorted settlement records."
    ),
  },
];
