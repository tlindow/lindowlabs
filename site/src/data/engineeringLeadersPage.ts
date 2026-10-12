import type { Metadata } from "next";

/**
 * Public engineering-leaders leaf: /engineering-leaders.
 * Homepage-hero layout sibling on cream paper (not lavender).
 * Formerly /get-your-time-back (permanent redirect kept for outreach links).
 */
export const ENGINEERING_LEADERS_PATH = "/engineering-leaders";

export const ENGINEERING_LEADERS_CANONICAL_URL =
  "https://lindowlabs.dev/engineering-leaders";

/** Old URL still linked from queued outreach email. */
export const ENGINEERING_LEADERS_LEGACY_PATH = "/get-your-time-back";

export const ENGINEERING_LEADERS_PAGE_TITLE = "Empowering engineering leaders";

export const ENGINEERING_LEADERS_PAGE_DESCRIPTION =
  "Get back your time with a 30-minute retreat that borrows from the museum floor, where hands-on exhibits pull you back into tinkering.";

/** Same kicker as homepage (CSS uppercase → EX-AFFIRM, EX-FOUNDER). */
export const ENGINEERING_LEADERS_KICKER = "ex-Affirm, ex-founder";

export const ENGINEERING_LEADERS_HEADLINE = "Empowering engineering leaders";

/** One line below the waveform (homepage subtitle style). Exact hero copy. */
export const ENGINEERING_LEADERS_DESCRIPTION =
  "Get back your time with a 30-minute retreat that borrows from the museum floor, where hands-on exhibits pull you back into tinkering.";

/**
 * Let's talk "Let's get in touch" → Calendly connect (shared Footer default).
 * Hero CTA is Download resume (same PDF as homepage). No get-your-time-back
 * Calendly links on this page.
 */
export const ENGINEERING_LEADERS_CALENDLY_URL =
  "https://calendly.com/tylerlindow/connect";

/** @deprecated Hero CTA is Download resume; kept for retreatPage re-export. */
export const ENGINEERING_LEADERS_CTA_LABEL = "Download resume";

/**
 * About body for leaders. Early-career lead-in (exact), then Affirm EM /
 * Beginner Work claims already on homepage/resume. No job-seeking line.
 * Uses software engineering leader (not engineering manager) on this page.
 */
export const ENGINEERING_LEADERS_ABOUT_HEADING =
  "Software engineering leader, developer experience";

export const ENGINEERING_LEADERS_ABOUT_BODY =
  "I started out teaching. At the Computer History Museum and The Tech Interactive, I taught people to design, code, and build. At Galvanize / Hack Reactor, I led as a software engineering immersive resident. At Affirm, I started as a developer support engineer, helping 300+ merchants debug their checkout integrations, and built the Snowflake pipelines that turned their feedback into platform fixes. That's where developer experience became my niche. At Affirm, I led up to 9 engineers on merchant and partner integrations and developer experience. Cut higher-transaction merchant outage detection from ~1 hour to under 5 minutes, led a merchant domain architecture review that reshaped the merchant org, and took Merchant Portal from ~99.7% to 99.9% availability with zero BFCM 2025 incidents. As founder of Beginner Work, built Tinker, an IDE for founders who want to get more technical.";

/** Affirm pillar framing (homepage WhatYouGet / resume claims). */
export const ENGINEERING_LEADERS_AFFIRM_TITLE =
  "At Affirm, I led merchant and partner integrations.";

export const ENGINEERING_LEADERS_AFFIRM_SUBTEXT =
  "Developer experience, partner integrations, and Merchant Portal reliability.";

/** Beginner / Tinker pillar (homepage WhatYouGet copy, unchanged claims). */
export const ENGINEERING_LEADERS_BEGINNER_TITLE =
  "Founder and CEO, Beginner Work.";

export const ENGINEERING_LEADERS_BEGINNER_SUBTEXT =
  "Built Tinker, an IDE for folks who want to get more technical. 28 early users from 87 founder conversations. Wound it down in July 2026 and open-sourced it.";

/** How I lead teams (homepage WhatYouGet). */
export const ENGINEERING_LEADERS_LEAD_TITLE = "How I lead teams.";

export const ENGINEERING_LEADERS_LEAD_SUBTEXT =
  "Practices for growing engineers.";

/**
 * Logo strip under the hero (homepage Previous employers slot). Tinker stack
 * from the resume: Vercel, Stytch, GitHub, Anthropic.
 */
export const ENGINEERING_LEADERS_STACK_LABEL = "My enterprise toolkit";

/**
 * Topic chips under the toolkit (homepage Devs & educational institutions slot).
 * Each topic is grounded in the resume.
 */
export const ENGINEERING_LEADERS_TOPICS_LABEL =
  "Key topics and skills I'm ready to discuss";

export const ENGINEERING_LEADERS_TOPICS = [
  "Developer experience",
  "Merchant and partner integrations",
  "Reliability and observability",
  "Domain architecture",
  "Enterprise authentication rollouts",
  "Reshaping teams and Kanban",
  "AI-assisted development",
] as const;

/**
 * Let's talk blurb on this page only (homepage keeps its open-to-roles line).
 * Exact technical "talk shop" copy.
 */
export const ENGINEERING_LEADERS_CONTACT_BLURB =
  "Want to talk shop? I'm always up for a conversation about developer experience, developer platforms, partner integrations, and reliability.";

/** Philosophy book on this leaf (homepage keeps Marie Kondo). */
export const ENGINEERING_LEADERS_PHILOSOPHY_BOOK = {
  src: "/book-don-norman.jpg",
  title: "The Design of Everyday Things",
  author: "Don Norman",
} as const;

export const engineeringLeadersPageMetadata: Metadata = {
  title: ENGINEERING_LEADERS_PAGE_TITLE,
  description: ENGINEERING_LEADERS_PAGE_DESCRIPTION,
  alternates: {
    canonical: ENGINEERING_LEADERS_CANONICAL_URL,
  },
  openGraph: {
    title: ENGINEERING_LEADERS_PAGE_TITLE,
    description: ENGINEERING_LEADERS_PAGE_DESCRIPTION,
    url: ENGINEERING_LEADERS_CANONICAL_URL,
    siteName: "Lindow Labs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: ENGINEERING_LEADERS_PAGE_TITLE,
    description: ENGINEERING_LEADERS_PAGE_DESCRIPTION,
  },
};

/** @deprecated Use ENGINEERING_LEADERS_* names. Kept for gradual import updates. */
export const RETREAT_CANONICAL_URL = ENGINEERING_LEADERS_CANONICAL_URL;
export const RETREAT_PAGE_TITLE = ENGINEERING_LEADERS_PAGE_TITLE;
export const RETREAT_PAGE_DESCRIPTION = ENGINEERING_LEADERS_PAGE_DESCRIPTION;
export const RETREAT_KICKER = ENGINEERING_LEADERS_KICKER;
export const RETREAT_HEADLINE = ENGINEERING_LEADERS_HEADLINE;
export const RETREAT_DESCRIPTION = ENGINEERING_LEADERS_DESCRIPTION;
export const RETREAT_CALENDLY_URL = ENGINEERING_LEADERS_CALENDLY_URL;
export const RETREAT_CTA_LABEL = ENGINEERING_LEADERS_CTA_LABEL;
export const retreatPageMetadata = engineeringLeadersPageMetadata;
