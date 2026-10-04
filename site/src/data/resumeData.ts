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
  phone: string;
  phoneObscured?: string;
  email: string;
  linkedin: string;
  linkedinDisplay: string;
  github: string;
  githubDisplay: string;
}

export const resumeContact: ContactInfo = {
  name: "Tyler Lindow",
  title: HEADLINE,
  location: "San Diego, CA",
  relocation: "Open to relocation",
  phone: "(650) 580-5788",
  phoneObscured: "(650) •••-••••",
  email: "tyler.lindow@gmail.com",
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

export interface EducationEntry {
  institution: string;
  detail: string;
}

export const experiences: ExperienceEntry[] = [
  {
    id: "beginner",
    company: "Beginner Work Inc.",
    role: "Founder",
    locationAndPeriod: "San Diego, CA | Mar 2026 – Jul 2026 (wound down before a raise)",
    bullets: [],
  },
  {
    id: "affirm-swe-mgr",
    company: "Affirm",
    role: "Software Engineering Manager (L7), Merchant Advocacy",
    locationAndPeriod: "San Diego, CA (Remote) | Mar 2025 – Feb 2026 (role eliminated)",
    bullets: [
      {
        tag: "Merchant portal:",
        text: "Company-scale engineering management for Merchant Portal, the API-key and transaction-view surface for merchants integrated via ecommerce platforms or direct API.",
      },
    ],
  },
  {
    id: "affirm-dse-mgr",
    company: "Affirm",
    role: "Developer Support Engineering Manager (L6 to L7), Partner Engineering",
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
    role: "Developer Support Engineer (L4 to L5), Partner Engineering",
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

export const education: EducationEntry[] = [
  {
    institution: "Deep Atlas",
    detail: "Residency, Applied AI and Machine Learning",
  },
  {
    institution: "Northwestern University",
    detail: "Graduate Coursework, Learning Sciences",
  },
  {
    institution: "Olin College of Engineering",
    detail: "SEER Program (Summer Engineering Education Research)",
  },
  {
    institution: "Hack Reactor",
    detail: "Advanced Software Engineering Immersive",
  },
  {
    institution: "University of California, San Diego",
    detail: "B.S. NanoEngineering – Cum Laude",
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

export const visionText = FORMATION_SUMMARY;

export type ResumeModuleType =
  | "header"
  | "vision"
  | "experience"
  | "education"
  | "deck-section";

export interface DeckSectionData {
  id: string;
  slideNumber: string;
  category: string;
  headline: string;
  summary: string;
  theme: "green" | "yellow" | "blue" | "red" | "purple";
}

export const deckSections: Record<string, DeckSectionData> = {
  "deck-section-thesis": {
    id: "deck-section-thesis",
    slideNumber: "01",
    category: "THESIS & VISION",
    headline: "The Developer Opportunity",
    summary: FORMATION_SUMMARY,
    theme: "green",
  },
  "deck-section-venture": {
    id: "deck-section-venture",
    slideNumber: "02",
    category: "FOUNDER / DEVX",
    headline: "Beginner, dates only",
    summary: "Founder, Beginner Work Inc. Mar 2026 – Jul 2026.",
    theme: "yellow",
  },
  "deck-section-scale": {
    id: "deck-section-scale",
    slideNumber: "03",
    category: "COMPANY-SCALE EM",
    headline: "Affirm carries the experience",
    summary:
      "Company-scale engineering management for Merchant Portal, the API-key and transaction-view surface for merchants integrated via ecommerce platforms or direct API.",
    theme: "blue",
  },
  "deck-section-ecosystem": {
    id: "deck-section-ecosystem",
    slideNumber: "04",
    category: "ECOSYSTEM & ADVOCACY",
    headline: "Developer Relations & Paved Paths",
    summary:
      "Developer-facing partner support, then beginner and DevX inside educational institutions.",
    theme: "red",
  },
  "deck-section-foundations": {
    id: "deck-section-foundations",
    slideNumber: "05",
    category: "FOUNDATIONS & COGNITIVE SCIENCES",
    headline: "Applied AI, Pedagogy & Nanoscale Systems",
    summary:
      "Deep Atlas Applied AI residency, Northwestern Learning Sciences research, and UCSD NanoEngineering foundations.",
    theme: "purple",
  },
};

export interface ResumeModuleItem {
  id: string;
  type: ResumeModuleType;
  experienceId?: string;
  sectionId?: string;
}

export interface UnifiedDeckCard {
  id: string;
  type: "profile" | "thesis" | "venture" | "scale" | "ecosystem" | "foundations";
  sectionId?: string;
  experienceIds?: string[];
}

export const unifiedDeckCards: UnifiedDeckCard[] = [
  {
    id: "card-profile",
    type: "profile",
  },
  {
    id: "card-thesis",
    type: "thesis",
    sectionId: "deck-section-thesis",
  },
  {
    id: "card-venture",
    type: "venture",
    sectionId: "deck-section-venture",
    experienceIds: ["beginner"],
  },
  {
    id: "card-scale",
    type: "scale",
    sectionId: "deck-section-scale",
    experienceIds: ["affirm-swe-mgr", "affirm-dse-mgr"],
  },
  {
    id: "card-ecosystem",
    type: "ecosystem",
    sectionId: "deck-section-ecosystem",
    experienceIds: [
      "affirm-dse",
      "galvanize-lead-swe",
      "tech-interactive",
      "computer-history-museum",
    ],
  },
  {
    id: "card-foundations",
    type: "foundations",
    sectionId: "deck-section-foundations",
  },
];

export const defaultModularDeck: ResumeModuleItem[] = [
  { id: "module-header", type: "header" },
  { id: "deck-section-thesis", type: "deck-section", sectionId: "deck-section-thesis" },
  { id: "module-vision", type: "vision" },
  { id: "deck-section-venture", type: "deck-section", sectionId: "deck-section-venture" },
  { id: "module-exp-beginner", type: "experience", experienceId: "beginner" },
  { id: "deck-section-scale", type: "deck-section", sectionId: "deck-section-scale" },
  { id: "module-exp-affirm-l7", type: "experience", experienceId: "affirm-swe-mgr" },
  { id: "module-exp-affirm-l6", type: "experience", experienceId: "affirm-dse-mgr" },
  { id: "deck-section-ecosystem", type: "deck-section", sectionId: "deck-section-ecosystem" },
  { id: "module-exp-affirm-l4", type: "experience", experienceId: "affirm-dse" },
  { id: "module-exp-galvanize", type: "experience", experienceId: "galvanize-lead-swe" },
  { id: "module-exp-tech-interactive", type: "experience", experienceId: "tech-interactive" },
  { id: "module-exp-computer-history", type: "experience", experienceId: "computer-history-museum" },
  { id: "deck-section-foundations", type: "deck-section", sectionId: "deck-section-foundations" },
  { id: "module-education", type: "education" },
];

export const replicaResumeModules: ResumeModuleItem[] = [
  { id: "module-header", type: "header" },
  { id: "module-vision", type: "vision" },
  { id: "module-exp-beginner", type: "experience", experienceId: "beginner" },
  { id: "module-exp-affirm-l7", type: "experience", experienceId: "affirm-swe-mgr" },
  { id: "module-exp-affirm-l6", type: "experience", experienceId: "affirm-dse-mgr" },
  { id: "module-exp-affirm-l4", type: "experience", experienceId: "affirm-dse" },
  { id: "module-exp-galvanize", type: "experience", experienceId: "galvanize-lead-swe" },
  { id: "module-exp-tech-interactive", type: "experience", experienceId: "tech-interactive" },
  { id: "module-exp-computer-history", type: "experience", experienceId: "computer-history-museum" },
  { id: "module-education", type: "education" },
];





