import fs from "node:fs";
import path from "node:path";
import {
  ContactInfo,
  ExperienceItem,
  EducationItem,
  PUBLIC_CONTACT_EMAIL,
  RESUME_PHONE_OBSCURED,
  professionalSummary as defaultSummary,
} from "@/data/resumeData";

export interface SkillCategoryItem {
  category: string;
  skills: string;
}

export interface ParsedResume {
  rawMarkdown: string;
  contact: ContactInfo;
  summaryTitle: string;
  visionText: string;
  technicalToolkit: string[];
  businessToolkit: string[];
  experiences: ExperienceItem[];
  education: EducationItem[];
  skillsList: SkillCategoryItem[];
}

/**
 * Parses raw resume markdown into structured typed data.
 */
export function parseResumeMarkdown(markdownText: string): ParsedResume {
  const lines = markdownText.split("\n");

  const contact: ContactInfo = {
    name: "Tyler Lindow",
    title: "Fintech Engineering & Product",
    subtitle: "B2B SaaS on curiosity-safe, GenAI Rails",
    location: "San Diego, CA",
    relocation: "Open to relocation",
    phoneObscured: RESUME_PHONE_OBSCURED,
    email: PUBLIC_CONTACT_EMAIL,
    linkedin: "https://linkedin.com/in/tlindow",
    linkedinDisplay: "linkedin.com/in/tlindow",
    github: "https://github.com/tlindow",
    githubDisplay: "github.com/tlindow",
  };

  let summaryTitle = "Summary";
  let visionText = defaultSummary.text;
  let technicalToolkit: string[] = [];
  let businessToolkit: string[] = [];
  const experiences: ExperienceItem[] = [];
  const education: EducationItem[] = [];
  const skillsList: SkillCategoryItem[] = [];

  let currentSection = "";
  let currentExp: Partial<ExperienceItem> | null = null;

  // Header parsing (top lines)
  let sawExplicitLocation = false;
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    const line = lines[i].trim();
    if (line.startsWith("# ")) {
      contact.name = line.replace(/^#\s+/, "").trim();
    } else if (line.startsWith("**") && line.endsWith("**") && !currentSection) {
      contact.title = line.replace(/^\*\*|\*\*$/g, "").trim();
    } else if (line.startsWith("---") || line.startsWith("##")) {
      break;
    } else if (line) {
      const parts = line.split("|").map((p) => p.trim());
      for (const part of parts) {
        if (part.includes("linkedin.com") || part.includes("github.com")) {
          const mdLinkMatch = part.match(/\[(.*?)\]\((.*?)\)/);
          if (mdLinkMatch) {
            const display = mdLinkMatch[1].trim();
            const url = mdLinkMatch[2].trim();
            if (url.includes("linkedin.com")) {
              contact.linkedin = url;
              contact.linkedinDisplay = display;
            } else if (url.includes("github.com")) {
              contact.github = url;
              contact.githubDisplay = display;
            }
          }
        } else if (part.includes("@")) {
          const emailMatch = part.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
          if (emailMatch) contact.email = emailMatch[1];
        } else if (
          part.includes("•••") ||
          part.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)
        ) {
          // Never keep full digits in parsed contact (serialized into page props).
          const area = part.match(/\(?(\d{3})\)?/);
          contact.phoneObscured = area
            ? `(${area[1]}) •••-••••`
            : RESUME_PHONE_OBSCURED;
        } else if (part.toLowerCase().includes("relocat")) {
          contact.relocation = part;
        } else if (part.includes(",") || part.toLowerCase().includes("diego") || part.toLowerCase().includes("seattle") || part.toLowerCase().includes("francisco")) {
          contact.location = part;
          sawExplicitLocation = true;
        }
      }
    }
  }

  // When the header's only place line is "Relocating to …", show that once.
  if (!sawExplicitLocation && contact.relocation) {
    contact.location = contact.relocation;
    contact.relocation = "";
  }

  // Section parsing
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("## Vision") || line.startsWith("## Summary")) {
      currentSection = "vision";
      summaryTitle = line.replace(/^##\s+/, "").trim();
      continue;
    } else if (line.startsWith("## Professional Experience") || line.startsWith("## Experience")) {
      currentSection = "experience";
      continue;
    } else if (line.startsWith("## Education")) {
      if (currentExp && currentExp.company) {
        experiences.push(currentExp as ExperienceItem);
        currentExp = null;
      }
      currentSection = "education";
      continue;
    } else if (line.startsWith("## Skills")) {
      if (currentExp && currentExp.company) {
        experiences.push(currentExp as ExperienceItem);
        currentExp = null;
      }
      currentSection = "skills";
      continue;
    } else if (line.startsWith("## ")) {
      if (currentExp && currentExp.company) {
        experiences.push(currentExp as ExperienceItem);
        currentExp = null;
      }
      currentSection = line.replace(/^##\s+/, "").toLowerCase();
      continue;
    }

    if (currentSection === "vision") {
      if (line.startsWith("**Technical Toolkit:**")) {
        const skillsStr = line.replace(/^\*\*Technical Toolkit:\*\*\s*/, "").replace(/\.$/, "");
        technicalToolkit = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
      } else if (line.startsWith("**Business & GTM Toolkit:**") || line.startsWith("**Business Toolkit:**")) {
        const skillsStr = line.replace(/^\*\*Business.*?\*\*\s*/, "").replace(/\.$/, "");
        businessToolkit = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
      } else if (line && !line.startsWith("---") && !line.startsWith("#")) {
        visionText = line;
      }
    } else if (currentSection === "experience") {
      if (line.startsWith("### ")) {
        if (currentExp && currentExp.company) {
          experiences.push(currentExp as ExperienceItem);
        }
        const titleLine = line.replace(/^###\s+/, "");
        const parts = titleLine.split("|").map((p) => p.trim());
        let company = parts[0] || "";
        let role = parts[1] || "";
        const location = parts[2] || "";
        const period = parts[3] || "";

        const roleKeywords = ["founder", "manager", "engineer", "resident", "specialist", "instructor", "lead", "director", "head", "architect"];
        const isFirstPartRole = roleKeywords.some(kw => parts[0]?.toLowerCase().includes(kw));
        const knownCompanies = ["affirm", "beginner", "galvanize", "galvanize inc", "the tech interactive", "computer history museum"];
        const isSecondPartCompany = knownCompanies.some(c => parts[1]?.toLowerCase().includes(c));

        if (parts.length >= 2 && (isFirstPartRole || isSecondPartCompany)) {
          role = parts[0] || "";
          company = parts[1] || "";
        }

        const id = `${company}-${role}-${experiences.length}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        currentExp = {
          id,
          company,
          role,
          location,
          period,
          bullets: [],
        };
      } else if (line.startsWith("*") && line.endsWith("*") && currentExp) {
        // Location & Period line e.g. *San Diego, CA (Hybrid) | Mar 2026 – Jul 2026 (5 mos)*
        const metaStr = line.replace(/^\*|\*$/g, "").trim();
        const parts = metaStr.split("|").map((p) => p.trim());
        currentExp.location = parts[0] || "";
        currentExp.period = parts[1] || "";
      } else if ((line.startsWith("* ") || line.startsWith("- ")) && currentExp) {
        const bulletContent = line.replace(/^[\*\-]\s+/, "").trim();
        let category: string | undefined = undefined;
        let text = bulletContent;

        // Allow markdown links inside the bold label (URLs contain ':').
        const categoryMatch = bulletContent.match(
          /^\*\*((?:(?!\*\*).)+):\*\*\s*(.*)$/,
        );
        if (categoryMatch) {
          category = categoryMatch[1].trim();
          text = categoryMatch[2].trim();
        }

        currentExp.bullets = currentExp.bullets || [];
        currentExp.bullets.push({
          category,
          // Keep [text](url) for the resume renderer; strip leftover bold only.
          text: text.replace(/\*\*(.*?)\*\*/g, "$1"),
        });
      }
    } else if (currentSection === "education") {
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const eduLine = line.replace(/^[\*\-]\s+/, "").trim();
        // Formation Ready uses three shapes:
        // **Institution** | degree *(City, ST)*
        // **Label:** degree
        // Label: degree
        const instMatch = eduLine.match(/^\*\*([^*]+?)\*\*\s*\|\s*(.*)$/);
        const labelMatch = eduLine.match(/^\*\*([^*:]+):\*\*\s*(.*)$/);
        const plainMatch = eduLine.match(/^([^:*]+):\s+(.*)$/);
        const matched = instMatch || labelMatch || plainMatch;
        if (matched) {
          const institution = matched[1].trim();
          let rest = matched[2].trim();
          let location = "";

          const locMatch = rest.match(/\*\((.*?)\)\*/);
          if (locMatch) {
            location = locMatch[1];
            rest = rest.replace(/\*\((.*?)\)\*/, "").trim();
          }

          let degree = rest.replace(/\*([^*]+?)\*/g, "$1").replace(/\s{2,}/g, " ").trim();
          if (location && !degree.includes(location)) {
            degree = `${degree} (${location})`;
          }

          education.push({
            institution,
            degree,
            location,
          });
        }
      }
    } else if (currentSection === "skills") {
      if (line.startsWith("* ") || line.startsWith("- ")) {
        const skillLine = line.replace(/^[\*\-]\s+/, "").trim();
        const catMatch = skillLine.match(/^\*\*([^*]+?):\*\*\s*(.*)$/);
        if (catMatch) {
          skillsList.push({
            category: catMatch[1].trim(),
            skills: catMatch[2].trim(),
          });
        }
      }
    }
  }

  if (currentExp && currentExp.company) {
    experiences.push(currentExp as ExperienceItem);
  }

  return {
    rawMarkdown: markdownText,
    contact,
    summaryTitle,
    visionText,
    technicalToolkit: technicalToolkit.length > 0 ? technicalToolkit : [
      "Python", "PyTorch", "JavaScript", "React", "Node.js", "Flask",
      "LLMs & RAG", "Agentic Coding Frameworks", "Snowflake", "Vercel",
      "Cursor", "IntelliJ IDEA", "VS Code", "SRE Support", "Jules",
      "Antigravity", "Luma",
    ],
    businessToolkit: businessToolkit.length > 0 ? businessToolkit : [
      "Developer Advocacy & Evangelism", "Partner Engineering",
      "Go-To-Market (GTM) Strategy",
      "Developer Paved Paths & Enablement", "Cross-Functional Stakeholder Alignment",
      "Voice of the Developer Synthesis", "Multi-City Field Research & Customer Discovery",
      "Technical Community Architecture",
    ],
    experiences: experiences.length > 0 ? experiences : [],
    education: education.length > 0 ? education : [],
    skillsList: skillsList.length > 0 ? skillsList : [
      { category: "AI & Agentic Systems", skills: "LLMs & RAG, Agentic Coding Frameworks, PyTorch, Antigravity, Jules, Luma, First-Principles GenAI Upskilling." },
      { category: "Languages & Frameworks", skills: "Python, JavaScript, React, Next.js, Node.js, Flask." },
      { category: "Cloud, Data & SRE", skills: "Snowflake, SQL, ETL Pipelines, SRE Support, Vercel, Git/GitHub, CI/CD, SLA telemetry." },
      { category: "Product & GTM Strategy", skills: "Developer Advocacy & Evangelism, Partner Engineering, GTM Strategy, Developer Paved Paths & Enablement, Cross-Functional Stakeholder Alignment, Voice of the Developer Synthesis, Technical Community Architecture." }
    ],
  };
}

/**
 * Loads and parses the resume markdown file directly from disk in Node / Next.js server components.
 */
export function getResumeMarkdownContent(): string {
  const possiblePaths = [
    path.join(process.cwd(), "content", "resume.md"),
    path.join(process.cwd(), "site", "content", "resume.md"),
    path.join(process.cwd(), "..", "content", "resume.md"),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return fs.readFileSync(p, "utf-8");
    }
  }

  return "";
}
