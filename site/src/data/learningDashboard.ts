/**
 * Static content for the private Lindow Labs Learning dashboard.
 * Exercises mirror the repo's exercises/ folder; readings are the working list.
 */

import { LEARNING_DASHBOARD_URL } from "@/data/urls";

export { LEARNING_DASHBOARD_URL };

const GITHUB_EXERCISES_BASE =
  "https://github.com/tlindow/lindowlabs/tree/main/exercises";

export type LearningExercise = {
  /** Folder name under exercises/. */
  slug: string;
  /** Title taken from the exercise README H1. */
  title: string;
  /** GitHub tree URL for the exercise folder. */
  href: string;
};

export type LearningReading = {
  title: string;
  author?: string;
  note?: string;
};

export type LearningAppTile = {
  id: string;
  label: string;
  href: string;
  description: string;
};

/** Exercises that live in this repo's exercises/ folder. */
export const learningExercises: LearningExercise[] = [
  {
    slug: "proto-learning",
    title: "Protobuf Mastery: Merchant Settlements & Payout Rails",
    href: `${GITHUB_EXERCISES_BASE}/proto-learning`,
  },
  {
    slug: "nextjs-learning",
    title:
      "Next.js App Router Mastery: High-Performance Ledger & Streaming Architecture",
    href: `${GITHUB_EXERCISES_BASE}/nextjs-learning`,
  },
  {
    slug: "realtime-deal-room",
    title:
      "Exercise: Real-Time Collaboration Architecture (CoderPad / Excalidraw / DealRoom)",
    href: `${GITHUB_EXERCISES_BASE}/realtime-deal-room`,
  },
  {
    slug: "rest-api-trading",
    title: "REST API Design: Robinhood-Style Stock Trading Platform",
    href: `${GITHUB_EXERCISES_BASE}/rest-api-trading`,
  },
];

/** Working reading list for the learning dashboard. */
export const learningReadings: LearningReading[] = [
  {
    title: "Domain-Driven Design",
    author: "Eric Evans",
    note: "DDD",
  },
  {
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    note: "DDIA",
  },
  {
    title: "Payment Systems in the U.S.",
    note: "Payments rails and settlement context",
  },
];

/**
 * App tiles open in a new tab.
 * Grok Bot reuses the Switchboard deep link from beginner-work/tinker
 * (src/renderer/repo/repo.js GROK_BOT_SWITCHBOARD_HREF).
 */
export const learningAppTiles: LearningAppTile[] = [
  {
    id: "grok-bot",
    label: "Grok Bot",
    href: "grokbot://app/v1/agent?id=0a50134b-8ed0-4c4b-8f0e-bd0879d79ed5",
    description: "Switchboard agent deep link",
  },
  {
    id: "cursor",
    label: "Cursor",
    href: "https://cursor.com/agents",
    description: "Cloud agents",
  },
  {
    id: "gmail",
    label: "Gmail",
    href: "https://mail.google.com",
    description: "Inbox",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/tlindow",
    description: "Profile",
  },
];
