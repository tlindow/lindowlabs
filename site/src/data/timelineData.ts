import React from "react";
import {
  Landmark,
  Sprout,
  Mic,
  Globe,
  Coffee,
  Compass,
  Code2,
  FolderOpen,
  MessageCircle,
  Video,
  FileText,
  Rss,
  Cpu,
} from "lucide-react";
import {
  BeginnerSeedMark,
  TinkerGlobeMark,
  HapiCupMark,
} from "@/components/brand/BeginnerMarks";

export interface TimelineAction {
  label: string;
  href: string;
  isExternal?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export interface TimelineItem {
  id: string;
  date: string;
  yearNumber: string;
  title: string;
  tag: string;
  category: "origin" | "mentoring" | "venture" | "product" | "speaking" | "stack";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accentColor: string;
  accentBg: string;
  dotColor: string;
  kicker: string;
  summary: string;
  highlights: string[];
  actions: TimelineAction[];
}

export const timelineMilestones: TimelineItem[] = [
  {
    id: "origin",
    date: "2019 · Chicago, IL",
    yearNumber: "2019",
    title: "Field Museum Research & The Coding Spark",
    tag: "Chicago · Origin",
    category: "origin",
    icon: Landmark,
    accentColor: "text-sky",
    accentBg: "bg-sky-light",
    dotColor: "bg-sky",
    kicker: "The Spark That Changed Everything",
    summary:
      "While conducting evolutionary biology research at the Field Museum in Chicago, Tyler watched a developer pull up a terminal to debug an interactive visitor kiosk. That moment sparked an obsession with software. Tyler enrolled in an immersive coding program, mastered JavaScript and React, and found his calling building for the web.",
    highlights: [
      "Evolutionary biology & scientific inquiry at Chicago's Field Museum",
      "Interactive museum kiosk sparked an obsession with terminal & web software",
      "Dove full-time into JavaScript, React, Canvas, and creative algorithms",
    ],
    actions: [
      {
        label: "View Creative Code Repos",
        href: "https://github.com/tlindow?tab=repositories",
        isExternal: true,
        variant: "secondary",
      },
      {
        label: "Connect on LinkedIn",
        href: "https://www.linkedin.com/in/tlindow",
        isExternal: true,
        variant: "outline",
      },
    ],
  },
  {
    id: "mentoring",
    date: "2021 — Present",
    yearNumber: "2021",
    title: "1:1 Developer Mentoring & Community Pairing",
    tag: "Coaching & Pairing",
    category: "mentoring",
    icon: Compass,
    accentColor: "text-violet",
    accentBg: "bg-violet-light",
    dotColor: "bg-violet",
    kicker: "Lifting Others Up",
    summary:
      "Tyler began working directly with aspiring developers, bootcamp graduates, and self-taught engineers navigating career pivots. Mentoring centers around live pair programming, architectural trade-offs, portfolio presentation, and strategic career coaching with no pressure.",
    highlights: [
      "Live pair programming, architectural reviews, and debugging sessions",
      "Career transition guidance for bootcamp grads & self-taught engineers",
      "Portfolio critique, GitHub presence refinement, and open office hours",
    ],
    actions: [
      {
        label: "Book 1:1 on Calendly",
        href: "https://calendly.com/tylerlindow/elevate",
        isExternal: true,
        variant: "primary",
      },
      {
        label: "Send a Message",
        href: "mailto:tyler@lindowlabs.dev",
        variant: "secondary",
      },
    ],
  },
  {
    id: "beginner",
    date: "2024 — Present · San Diego",
    yearNumber: "2024",
    title: "Founding beginner — The PWA App Store",
    tag: "Founder & Platform",
    category: "venture",
    icon: Sprout,
    accentColor: "text-sprout",
    accentBg: "bg-sprout-light",
    dotColor: "bg-sprout",
    kicker: "Everyone is a Founder",
    summary:
      "Founded beginner — an innovative platform and installable PWA App Store where diverse creators, healers, and independent builders mint web applications and receive direct backing from their communities. Built with modern web standards, mobile-first PWA architecture, and Stripe Connect.",
    highlights: [
      "Installable PWA marketplace with instant creator deployment",
      "Empowering underrepresented makers, healers, and community builders",
      "Stripe Connect micro-economy and community funding model",
    ],
    actions: [
      {
        label: "Visit beginner.work",
        href: "https://www.beginner.work",
        isExternal: true,
        variant: "primary",
      },
      {
        label: "Check GitHub",
        href: "https://github.com/tlindow",
        isExternal: true,
        variant: "secondary",
      },
    ],
  },
  {
    id: "hapi",
    date: "2024 — Present · San Diego (92102)",
    yearNumber: "2024+",
    title: "hāpi — Cold-Pressed Hop Elixirs & Tap-to-Order PWA",
    tag: "Craft & Commerce",
    category: "venture",
    icon: Coffee,
    accentColor: "text-amber",
    accentBg: "bg-amber-light",
    dotColor: "bg-amber",
    kicker: "Local San Diego Craft",
    summary:
      "Rooted in San Diego's Stockton & Golden Hill neighborhoods (92102), Tyler founded hāpi — a botanical craft beverage brand and mobile ordering PWA serving cold-pressed hop elixirs designed for focus, mood elevation, and social connection without alcohol.",
    highlights: [
      "San Diego neighborhood craft botanical wellness brand",
      "Bespoke mobile-first ordering PWA with friction-free checkout",
      "Community night cafe pop-ups and local botanical craft",
    ],
    actions: [
      {
        label: "Explore hāpi",
        href: "https://www.beginner.work/hapi",
        isExternal: true,
        variant: "primary",
      },
    ],
  },
  {
    id: "tinker",
    date: "2025 — Present",
    yearNumber: "2025",
    title: "tinker — Quiet Web Shell Powered by Claude",
    tag: "AI Product & Search Edge",
    category: "product",
    icon: Globe,
    accentColor: "text-rose",
    accentBg: "bg-rose-light",
    dotColor: "bg-rose",
    kicker: "A Quiet Place to Be on the Web",
    summary:
      "Created tinker: an ad-free, distraction-free web shell running Claude on the search edge. Features simple phone/PIN authentication, plain-language interview flows to turn raw thoughts into structured documents, and a privacy-first, zero-tracking philosophy.",
    highlights: [
      "Ad-free, quiet search edge powered by Anthropic's Claude",
      "Plain-language guided interview flows that structure raw thinking",
      "Privacy-focused, phone/PIN auth, and zero third-party trackers",
    ],
    actions: [
      {
        label: "Open tinker",
        href: "https://www.beginner.work",
        isExternal: true,
        variant: "primary",
      },
      {
        label: "View Repositories",
        href: "https://github.com/tlindow",
        isExternal: true,
        variant: "secondary",
      },
    ],
  },
  {
    id: "speaking",
    date: "April 18, 2026 · San Diego",
    yearNumber: "2026",
    title: "DEVx Keynote: Human Minds & AI Models",
    tag: "Keynote & Research",
    category: "speaking",
    icon: Mic,
    accentColor: "text-violet",
    accentBg: "bg-violet-light",
    dotColor: "bg-violet",
    kicker: "Featured Keynote Presentation",
    summary:
      "Delivered the featured keynote talk 'Human Minds & AI Models' at DEVx Network San Diego on April 18, 2026. Explored the deep structural parallels between biological cognition, learning feedback loops, and autonomous AI agents — demonstrating why understanding human learning dynamics unlocks better agentic systems.",
    highlights: [
      "Featured keynote at DEVx Network San Diego (recorded live)",
      "Cognitive science & learning systems applied to AI agent architectures",
      "Full 16:9 presentation video available to watch with timestamp markers",
    ],
    actions: [
      {
        label: "Watch Keynote (YouTube)",
        href: "https://www.youtube.com/watch?v=STI5pw5F5Lo&t=631s",
        isExternal: true,
        variant: "primary",
      },
      {
        label: "Inquire for Speaking",
        href: "mailto:tyler@lindowlabs.dev",
        variant: "secondary",
      },
    ],
  },
  {
    id: "stack",
    date: "Present & Beyond",
    yearNumber: "Now",
    title: "Technology Stack, Content & What's Next",
    tag: "Engineering & Ecosystem",
    category: "stack",
    icon: Cpu,
    accentColor: "text-mint",
    accentBg: "bg-mint-light",
    dotColor: "bg-mint",
    kicker: "Modern Stack & Ongoing Craft",
    summary:
      "Every project is crafted using modern web foundations: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, and AI edge integrations. Tyler regularly shares video walkthroughs, essays, and learnings on LinkedIn.",
    highlights: [
      "Core stack: Next.js, React 19, TypeScript, Tailwind CSS 4, Framer Motion",
      "AI tooling: Anthropic Claude, autonomous coding agents, edge search synthesis",
      "Regular technical write-ups, demo videos, and lessons on LinkedIn",
    ],
    actions: [
      {
        label: "Follow on LinkedIn",
        href: "https://www.linkedin.com/in/tlindow",
        isExternal: true,
        variant: "primary",
      },
      {
        label: "GitHub Profile",
        href: "https://github.com/tlindow",
        isExternal: true,
        variant: "secondary",
      },
    ],
  },
];

export const mentoringOfferings = [
  {
    icon: Code2,
    title: "Code Reviews & Pairing",
    description:
      "Walk through your code together, talk through architectural trade-offs, and sharpen your problem-solving skills.",
    color: "bg-sky-light",
    iconColor: "text-sky",
  },
  {
    icon: Compass,
    title: "Career Coaching",
    description:
      "Navigate bootcamps, self-study, the job search, or your next career move with someone who has been there.",
    color: "bg-peach-light",
    iconColor: "text-peach",
  },
  {
    icon: FolderOpen,
    title: "Portfolio & Brand Building",
    description:
      "Build a GitHub presence, personal site, and project portfolio that showcases your real engineering capability.",
    color: "bg-mint-light",
    iconColor: "text-mint",
  },
  {
    icon: MessageCircle,
    title: "Open Office Hours",
    description:
      "No agenda needed — bring your questions, ideas, or come talk through problems out loud in a safe space.",
    color: "bg-violet-light",
    iconColor: "text-violet",
  },
];

export const featuredVentures = [
  {
    title: "tinker",
    tagline: "A quiet place to be on the web",
    description:
      "An ad-free, distraction-free web shell powered by Claude on the search edge. Features phone/PIN auth, plain-language interview flows, and direct answer synthesis.",
    tech: ["Anthropic Claude", "TypeScript", "Serverless", "PWA"],
    url: "https://www.beginner.work",
    icon: TinkerGlobeMark,
    accent: "group-hover:border-violet/50 border-border",
    badge: "AI Product",
    badgeColor: "bg-violet-light text-violet",
    hover: "group-hover:text-violet",
    glow: "group-hover:shadow-violet/15",
  },
  {
    title: "beginner",
    tagline: "Everyone is a founder",
    description:
      "A founder platform and installable PWA App Store where diverse makers, healers, and builders mint their own web apps and receive direct community funding.",
    tech: ["Next.js", "TypeScript", "PWA", "Stripe Connect", "PostgreSQL"],
    url: "https://www.beginner.work",
    icon: BeginnerSeedMark,
    accent: "group-hover:border-sprout/50 border-border",
    badge: "Company & Platform",
    badgeColor: "bg-sprout-light text-foreground",
    hover: "group-hover:text-sprout",
    glow: "group-hover:shadow-sprout/15",
  },
  {
    title: "hāpi",
    tagline: "A night cafe serving hop elixirs",
    description:
      "A San Diego craft beverage brand and mobile ordering PWA. Hop-based botanicals, community events, and frictionless tap-to-order experiences.",
    tech: ["TypeScript", "PWA", "Design System", "Mobile-First"],
    url: "https://www.beginner.work/hapi",
    icon: HapiCupMark,
    accent: "group-hover:border-amber/50 border-border",
    badge: "Craft & Commerce",
    badgeColor: "bg-amber-light text-foreground",
    hover: "group-hover:text-amber",
    glow: "group-hover:shadow-amber/20",
  },
  {
    title: "Dreaming with Marisól",
    tagline: "Spiritual guidance & herbal medicine",
    description:
      "Full digital experience and custom booking portal for a spiritual practitioner, herbalist, and community healer.",
    tech: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
    url: "https://github.com/tlindow/dreamingwithmarisol",
    accent: "group-hover:border-rose/50 border-border",
    badge: "Client Experience",
    badgeColor: "bg-rose-light text-rose",
    hover: "group-hover:text-rose",
    glow: "group-hover:shadow-rose/15",
  },
];

export const creativeExperiments = [
  {
    title: "p5.js Creative Coding",
    description:
      "Generative art sketches, spiraling circle algorithms, and visual math experiments in the browser.",
    tech: ["p5.js", "Canvas", "JavaScript"],
    url: "https://github.com/tlindow/p5jstest",
    accent: "hover:border-violet/40",
  },
  {
    title: "Greywater Projection",
    description:
      "Interactive data visualization and resource projection tool calculating sustainable water reuse.",
    tech: ["D3.js", "JavaScript", "SVG"],
    url: "https://github.com/tlindow/greywater_projection",
    accent: "hover:border-sky/40",
  },
  {
    title: "Booking Module Service",
    description:
      "Component-as-a-service handling date picker logic, pricing tiers, and calendar reservations.",
    tech: ["React", "JavaScript", "CSS"],
    url: "https://github.com/tlindow/booking-module",
    accent: "hover:border-peach/40",
  },
];

export const techStackList = [
  { name: "TypeScript", bg: "bg-sky-light", dot: "bg-sky" },
  { name: "JavaScript", bg: "bg-amber-light", dot: "bg-amber" },
  { name: "React 19", bg: "bg-sky-light", dot: "bg-sky" },
  { name: "Next.js 16", bg: "bg-violet-light", dot: "bg-violet" },
  { name: "Tailwind CSS 4", bg: "bg-sky-light", dot: "bg-sky" },
  { name: "Framer Motion", bg: "bg-rose-light", dot: "bg-rose" },
  { name: "Anthropic Claude", bg: "bg-peach-light", dot: "bg-peach" },
  { name: "Node.js", bg: "bg-mint-light", dot: "bg-mint" },
  { name: "PostgreSQL", bg: "bg-indigo-light", dot: "bg-indigo" },
  { name: "PWA Architecture", bg: "bg-sprout-light", dot: "bg-sprout" },
  { name: "Docker", bg: "bg-sky-light", dot: "bg-sky" },
  { name: "Git & GitHub", bg: "bg-sand", dot: "bg-foreground" },
];

export const speakingTopicsList = [
  {
    title: "Human Minds & AI Models",
    description:
      "The structural parallels between human cognition and machine learning — and why understanding human learning dynamics unlocks better AI agent design.",
    bg: "bg-violet-light",
    tag: "AI & Cognition",
  },
  {
    title: "Building in Public & Founder Journeys",
    description:
      "Lessons from starting beginner, bootstrapping in San Diego, and turning real-world community needs into software.",
    bg: "bg-peach-light",
    tag: "Startups & Product",
  },
  {
    title: "Agentic Developer Tooling & Workflows",
    description:
      "How autonomous coding agents, mobile-first iteration, and modern AI workflows fundamentally transform engineering velocity.",
    bg: "bg-sky-light",
    tag: "Engineering",
  },
  {
    title: "Creative Coding & Expressive Web",
    description:
      "Using code as an expressive medium — shaders, physics animations, generative art, and tactile user interfaces.",
    bg: "bg-amber-light",
    tag: "Design & Motion",
  },
];

export const contentFormatsList = [
  {
    icon: Video,
    title: "Video Walkthroughs",
    description:
      "Short-form demos and walkthroughs of projects, tools, and techniques shared on LinkedIn.",
    iconBg: "bg-rose-light",
    iconColor: "text-rose",
  },
  {
    icon: FileText,
    title: "Technical Essays",
    description:
      "Posts about building products, architectural trade-offs, and lessons learned along the way.",
    iconBg: "bg-sky-light",
    iconColor: "text-sky",
  },
  {
    icon: Rss,
    title: "Developer Insights",
    description:
      "Reflections on the developer journey, cognitive science, and community building.",
    iconBg: "bg-amber-light",
    iconColor: "text-amber",
  },
];
