import { FORMATION_SUMMARY, HEADLINE } from "@/data/positioning";

export interface BulletPoint {
  category?: string;
  text: string;
  highlightMetric?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  level?: string;
  location: string;
  period: string;
  duration?: string;
  bullets: BulletPoint[];
  companyCategory?: string;
  accentColor?: string;
  accentBg?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  honors?: string;
  period?: string;
  location?: string;
  description?: string;
  accentColor?: string;
  accentBg?: string;
}

export interface ToolkitSkill {
  name: string;
  featured?: boolean;
}

export interface ToolkitCategory {
  title: string;
  skills: ToolkitSkill[];
}

export interface MetricHighlight {
  number: string;
  value?: string;
  label: string;
  context: string;
  description?: string;
  accent: string;
  bg: string;
}

export interface ContactInfo {
  name: string;
  title: string;
  subtitle?: string;
  location: string;
  relocation?: string;
  /** Display phone, e.g. "(650) 580-5788". Empty string omits the slot. */
  phone: string;
  email: string;
  linkedin: string;
  linkedinDisplay: string;
  github: string;
  githubDisplay: string;
}

/** Public contact for mailto, JSON-LD, AI surfaces, and shared resumeContact.email. */
export const PUBLIC_CONTACT_EMAIL = "tyler@lindowlabs.dev";

/** Plain resume phone (same number as LEARNING_ALLOWED_PHONES / prior char-code parts). */
export const RESUME_PHONE = "(650) 580-5788";

/** Digits-only form for tel: links. */
export function resumePhoneDigits(phone: string = RESUME_PHONE): string {
  return phone.replace(/\D/g, "");
}

export const resumeContact: ContactInfo = {
  name: "Tyler Lindow",
  title: HEADLINE,
  location: "San Diego, CA",
  relocation: "Open to relocation",
  phone: RESUME_PHONE,
  email: PUBLIC_CONTACT_EMAIL,
  linkedin: "https://www.linkedin.com/in/tlindow",
  linkedinDisplay: "linkedin.com/in/tlindow",
  github: "https://github.com/tlindow",
  githubDisplay: "github.com/tlindow",
};

export const professionalSummary = {
  text: FORMATION_SUMMARY,
  metrics: [
    {
      number: "Marketing",
      value: "Marketing",
      label: "Top of funnel",
      context: "Marketing as engineering leadership",
      description: "Marketing as engineering leadership",
      accent: "text-indigo-dark",
      bg: "bg-indigo-light",
    },
    {
      number: "Portals",
      value: "Portals",
      label: "Enterprise B2B",
      context: "B2B portals as trust stores",
      description: "B2B portals as trust stores",
      accent: "text-sky",
      bg: "bg-sky-light",
    },
    {
      number: "DevX",
      value: "DevX",
      label: "Beginner market",
      context: "Educational institutions and the developer market",
      description: "Educational institutions and the developer market",
      accent: "text-violet",
      bg: "bg-violet-light",
    },
  ] as MetricHighlight[],
};

export const technicalToolkit: ToolkitCategory[] = [
  {
    title: "AI & Agentic Systems",
    skills: [
      { name: "LLMs & RAG", featured: true },
      { name: "Agentic Coding Frameworks", featured: true },
      { name: "PyTorch", featured: true },
      { name: "Antigravity", featured: true },
      { name: "Jules", featured: true },
      { name: "Luma", featured: false },
    ],
  },
  {
    title: "Languages & Frameworks",
    skills: [
      { name: "Python", featured: true },
      { name: "JavaScript", featured: true },
      { name: "React", featured: true },
      { name: "Node.js", featured: true },
      { name: "Flask", featured: false },
    ],
  },
  {
    title: "Cloud, Data & SRE",
    skills: [
      { name: "Snowflake", featured: true },
      { name: "Vercel", featured: true },
      { name: "SRE Support", featured: true },
    ],
  },
  {
    title: "Developer Tools & Workflows",
    skills: [
      { name: "Cursor", featured: true },
      { name: "VS Code", featured: true },
      { name: "IntelliJ IDEA", featured: false },
    ],
  },
];

export const allToolkitSkills: string[] = [
  "Python",
  "PyTorch",
  "JavaScript",
  "React",
  "Node.js",
  "Flask",
  "LLMs & RAG",
  "Agentic Coding Frameworks",
  "Snowflake",
  "Vercel",
  "Cursor",
  "IntelliJ IDEA",
  "VS Code",
  "SRE Support",
  "Jules",
  "Antigravity",
  "Luma",
];

export const allBusinessToolkitSkills: string[] = [
  "Developer Advocacy & Evangelism",
  "Partner Engineering",
  "Enterprise B2B portals",
  "Go-To-Market (GTM) Strategy",
  "Developer Paved Paths & Enablement",
  "Cross-Functional Stakeholder Alignment",
  "Voice of the Developer Synthesis",
  "Multi-City Field Research & Customer Discovery",
  "Technical Community Architecture",
];

export interface ExperienceBullet {
  tag: string;
  text: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  locationAndPeriod: string;
  timelineSubheader?: string;
  bullets: ExperienceBullet[];
}

export const experiences: ExperienceEntry[] = [
  {
    id: "beginner",
    company: "Beginner Work Inc.",
    role: "Founder and CEO",
    locationAndPeriod: "San Diego, CA | Mar 2026 – Jul 2026 (wound down before a raise)",
    bullets: [],
  },
  {
    id: "affirm-swe-mgr",
    company: "Affirm",
    role: "Software Engineering Manager, Merchant Engineering",
    locationAndPeriod: "San Diego, CA (Remote) | Mar 2025 – Feb 2026 (role eliminated)",
    bullets: [
      {
        tag: "Merchant portal:",
        text: "Led Merchant Advocacy Engineering (9 engineers at peak, deliberately reshaped to 6), owning Merchant Portal, the API-key and transaction-view surface for merchants integrated via ecommerce platforms or direct API. Led the team in moving Merchant Portal's reads off Snowflake onto the merchant data platform's read-replica-backed RPCs, raising availability from ~99.7% to 99.9% with zero BFCM 2025 incidents.",
      },
    ],
  },
  {
    id: "affirm-dse-mgr",
    company: "Affirm",
    role: "Developer Support Engineering Manager, Partner Engineering",
    locationAndPeriod: "San Diego, CA (Remote) | Jul 2021 – Mar 2025",
    bullets: [
      {
        tag: "Partner engineering:",
        text: "Company-scale engineering management for developer support and partner integrations.",
      },
      {
        tag: "Trust store:",
        text: "The enterprise B2B portal and the developers who integrate it.",
      },
    ],
  },
  {
    id: "affirm-dse",
    company: "Affirm",
    role: "Developer Support Engineer, Partner Engineering",
    locationAndPeriod: "San Francisco, CA (Hybrid) | Sep 2019 – Jul 2021",
    bullets: [
      {
        tag: "Partner surface:",
        text: "Developer-facing merchant integration support.",
      },
    ],
  },
  {
    id: "galvanize-lead-swe",
    company: "Galvanize Inc",
    role: "Lead Software Engineering Immersive Resident",
    locationAndPeriod: "San Francisco, CA | May 2019 – Aug 2019",
    bullets: [],
  },
  {
    id: "tech-interactive",
    company: "The Tech Interactive",
    role: "Gallery Programs Specialist → Experience Development Specialist & Prototyping Studio Coordinator",
    locationAndPeriod: "San Jose, CA | May 2017 – Jan 2019",
    bullets: [],
  },
  {
    id: "computer-history-museum",
    company: "Computer History Museum",
    role: "Workshop Instructor, Education Programs → Design Code Build Instructor",
    locationAndPeriod: "Mountain View, CA | Mar 2017 – Nov 2018",
    bullets: [],
  },
];

export const educationList: EducationItem[] = [
  {
    institution: "Deep Atlas",
    degree: "Residency, Applied AI and Machine Learning",
    location: "San Francisco, CA & Remote",
    accentColor: "text-indigo-dark",
    accentBg: "bg-indigo-light",
  },
  {
    institution: "Northwestern University",
    degree: "Graduate Coursework, Learning Sciences",
    location: "Evanston, IL",
    description:
      "Deep exploration of constructionist pedagogy, cognitive modeling, and how human learning dynamics shape intuitive technical systems.",
    accentColor: "text-violet",
    accentBg: "bg-violet-light",
  },
  {
    institution: "Olin College of Engineering",
    degree: "SEER Program (Summer Engineering Education Research)",
    location: "Needham, MA",
    description:
      "Engineering education research focused on student learning, curriculum prototyping, and design-led pedagogy.",
    accentColor: "text-indigo-dark",
    accentBg: "bg-indigo-light",
  },
  {
    institution: "Hack Reactor",
    degree: "Advanced Software Engineering Immersive",
    location: "San Francisco, CA",
    description:
      "Intensive full-stack software engineering, distributed systems, and modern web application architecture.",
    accentColor: "text-peach",
    accentBg: "bg-peach-light",
  },
  {
    institution: "University of California, San Diego",
    degree: "B.S. NanoEngineering – Cum Laude",
    location: "La Jolla, CA",
    honors: "Cum Laude",
    description:
      "Cross-disciplinary nanoscale materials science, physical modeling, and chemical systems.",
    accentColor: "text-sky",
    accentBg: "bg-sky-light",
  },
];

export const professionalExperience: ExperienceItem[] = experiences.map((e) => {
  const parts = e.locationAndPeriod.split(" | ");
  return {
    id: e.id,
    company: e.company,
    role: e.role,
    location: parts[0] || "",
    period: parts[1] || "",
    bullets: e.bullets.map((b) => ({
      category: b.tag.replace(/:$/, ""),
      text: b.text,
    })),
  };
});

