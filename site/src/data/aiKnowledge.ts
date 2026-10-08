import { BEGINNER_URL } from "@/data/urls";
export interface AIResponseAction {
  label: string;
  href: string;
  isExternal?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export interface KnowledgeTopic {
  id: string;
  keywords: string[];
  patterns: RegExp[];
  title: string;
  summary: string;
  details: string[];
  actions: AIResponseAction[];
  suggestedFollowUps: string[];
}

export const knowledgeBase: KnowledgeTopic[] = [
  {
    id: "about",
    title: "About Tyler Lindow",
    keywords: [
      "who", "about", "bio", "background", "story", "chicago", "field museum",
      "san diego", "experience", "origin", "journey", "education", "bootcamp", "history"
    ],
    patterns: [
      /who (is|are) (you|tyler)/i,
      /tell me about (yourself|tyler|your background|your story)/i,
      /where (are you|is tyler) (based|from|located)/i,
      /how did (you|tyler) (get into|start|learn) (coding|software|programming)/i,
      /what is (your|tyler's) background/i,
    ],
    summary:
      "Tyler is a software developer, builder, and mentor based in San Diego, open to relocation. He transitioned into tech after doing research at the Field Museum in Chicago, where seeing an interactive terminal application sparked his obsession with building for the web.",
    details: [
      "Based in sunny San Diego, open to relocation, building modern web applications with TypeScript, React, and Next.js.",
      "Loves the intersection of technology and creativity — generative art, interactive modules, and developer tooling.",
      "Passionate about AI in software, building in public, mentoring aspiring developers, and sharing lessons learned.",
    ],
    actions: [
      { label: "Read Tyler's Story", href: "#about" },
      { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/tlindow", isExternal: true },
    ],
    suggestedFollowUps: [
      "What technologies does Tyler use?",
      "Tell me about Tyler's mentoring programs",
      "What projects has he built?",
    ],
  },
  {
    id: "mentoring",
    title: "Mentoring & 1:1 Coaching",
    keywords: [
      "mentor", "mentoring", "coach", "coaching", "book", "session", "1:1", "one on one",
      "pairing", "code review", "career", "advice", "office hours", "work with me", "help",
      "guidance", "hire", "consult", "calendly"
    ],
    patterns: [
      /how (can I|do I|to) (work with|hire|book|schedule) (you|tyler)/i,
      /what (mentoring|coaching) (services|do you offer|is available)/i,
      /can (you|tyler) (help|mentor|coach) me/i,
      /book (a session|a call|time|1:1|mentoring)/i,
      /code review|career coaching|office hours/i,
    ],
    summary:
      "Tyler offers dedicated 1:1 mentoring and coaching sessions for developers at all stages — from self-taught beginners and bootcamp grads to engineers looking to level up their craft.",
    details: [
      "🛠️ Code Reviews & Pairing: Deep dive into your code, talk through trade-offs, architecture, and sharpen problem solving.",
      "🧭 Career Coaching: Guidance navigating bootcamps, job searches, interviews, portfolio presentation, and career pivots.",
      "📁 Portfolio & Brand Building: Polish your GitHub presence, personal brand, and standout project showcases.",
      "💬 Open Office Hours: Casual, high-value discussions to bounce ideas, debug hurdles, or talk tech.",
    ],
    actions: [
      { label: "Book a 1:1 Session on Calendly", href: "https://calendly.com/tylerlindow/elevate", isExternal: true, variant: "primary" },
      { label: "View Pricing & Engagement", href: "#pricing", variant: "secondary" },
      { label: "Send an Email Inquiry", href: "mailto:tyler@lindowlabs.dev", isExternal: true, variant: "outline" },
    ],
    suggestedFollowUps: [
      "What are Tyler's pricing and engagement tiers?",
      "How do I book a session?",
      "What projects has Tyler built?",
    ],
  },
  {
    id: "pricing",
    title: "Pricing & Engagement Models",
    keywords: [
      "price", "pricing", "cost", "rate", "rates", "fee", "fees", "how much", "tier", "tiers",
      "retainer", "advisory", "hire", "contract", "consulting", "engagement", "package"
    ],
    patterns: [
      /how much (does it cost|do you charge|is a session|for mentoring|for consulting)/i,
      /what are (your|tyler's) (rates|prices|pricing|fees|tiers)/i,
      /pricing|rates|cost|retainer/i,
      /how (can I|to) (hire|partner with|engage) (you|tyler)/i,
    ],
    summary:
      "Tyler offers three clear engagement tiers: 1:1 Mentoring & Advisory ($150 / 60-min session), Fractional Advisory Sprints ($5,000 / mo or sprint), and Retained Full-Time Engineering & Product Leadership.",
    details: [
      "🌱 1:1 Mentoring & Advisory ($150 / session): Hands-on code reviews, architecture pairing, career pivots, and GenAI workflows (booked via Calendly).",
      "⚡ Fractional Advisory & Sprints ($5,000 / mo or sprint): Strategic B2B SaaS architecture, enterprise SLA telemetry, launch de-risking, and executive advisory.",
      "💼 Full-Time Product-Eng Leadership (Custom / Retained): Embedded Software Engineering Manager / PM scaling engineering orgs and safeguarding multi-billion merchant platforms.",
    ],
    actions: [
      { label: "View Pricing Tiers", href: "#pricing", variant: "primary" },
      { label: "Book 1:1 on Calendly", href: "https://calendly.com/tylerlindow/elevate", isExternal: true, variant: "secondary" },
      { label: "Inquire via Email", href: "mailto:tyler@lindowlabs.dev", isExternal: true, variant: "outline" },
    ],
    suggestedFollowUps: [
      "How do I book a 1:1 session?",
      "What is Tyler's background at Affirm?",
      "What does Tyler mean by 'What You Get If You Buy Me'?",
    ],
  },
  {
    id: "projects",
    title: "Portfolio & Projects",
    keywords: [
      "project", "projects", "portfolio", "built", "repo", "repos", "github", "apps",
      "dreaming with marisol", "booking module", "greywater", "p5", "p5.js", "dog breed",
      "memory game", "generative art", "d3", "work", "code"
    ],
    patterns: [
      /what (have you|has tyler|projects have you) (built|made|created|worked on)/i,
      /tell me about (your|the) (projects|portfolio|apps)/i,
      /show me (your|tyler's) (work|portfolio|github)/i,
      /dreaming with marisol|booking module|greywater|dog breed|memory game/i,
    ],
    summary:
      "Tyler has created 45+ GitHub repositories spanning full-stack web applications, interactive UI components, data visualizations, and creative coding experiments.",
    details: [
      "✨ Dreaming with Marisól: Full production website for his wife's creative business, crafted with TypeScript.",
      "📅 Booking Module: High-performance Component-as-a-Service handling interactive date picking, real-time pricing calculation, and reservation booking.",
      "📊 Greywater Projection: Interactive data visualization and sustainability projection engine built with D3 and JavaScript.",
      "🎨 p5.js Experiments: Creative coding explorations in generative math, spiraling geometry, and visual canvas art.",
      "🐶 Dog Breed Search & Memory Game: Interactive React applications and browser puzzle games.",
    ],
    actions: [
      { label: "Explore Portfolio", href: "#portfolio", variant: "primary" },
      { label: "Tyler's GitHub (45+ Repos)", href: "https://github.com/tlindow", isExternal: true, variant: "secondary" },
    ],
    suggestedFollowUps: [
      "What tech stack does Tyler use?",
      "Can Tyler help review my portfolio?",
      "How can I contact Tyler?",
    ],
  },
  {
    id: "techstack",
    title: "Tech Stack & Skills",
    keywords: [
      "tech", "stack", "technology", "technologies", "tools", "languages", "skills",
      "typescript", "javascript", "react", "next.js", "nextjs", "node", "python", "tailwind",
      "css", "html", "docker", "git", "sql", "d3", "frontend", "backend", "fullstack"
    ],
    patterns: [
      /what (technologies|tech stack|tools|languages|frameworks) (do you|does tyler) (use|know|specialize in)/i,
      /what is (your|tyler's) (stack|tech stack)/i,
      /do (you|tyler) know (react|typescript|python|next\.js|node|tailwind)/i,
    ],
    summary:
      "Tyler's primary expertise is modern full-stack web development with a strong focus on TypeScript, React, Next.js, and polished interactive frontends, backed by Node.js, Python, and SQL.",
    details: [
      "⚡ Frontend: TypeScript, JavaScript (ESNext), React 19, Next.js 16 (App Router), Tailwind CSS 4, Framer Motion, HTML5, Modern CSS.",
      "🔧 Backend & Data: Node.js, Python, REST APIs, SQL, Docker, Git workflows.",
      "🎨 Creative & Viz: D3.js, p5.js, Canvas APIs, UI micro-interactions & physics-based animations.",
    ],
    actions: [
      { label: "View Tech Stack", href: "#techstack", variant: "primary" },
      { label: "Check GitHub Repos", href: "https://github.com/tlindow?tab=repositories", isExternal: true, variant: "secondary" },
    ],
    suggestedFollowUps: [
      "Can we pair on a React / TypeScript project?",
      "Tell me about Tyler's portfolio",
      "How to work with Tyler?",
    ],
  },
  {
    id: "speaking",
    title: "Speaking & Talks",
    keywords: [
      "speaking", "speaker", "talk", "talks", "topics", "keynote", "conference", "podcast",
      "meetup", "presentation", "stage", "panel"
    ],
    patterns: [
      /what (topics|talks) (do you|does tyler) (speak on|talk about)/i,
      /tell me about (your|tyler's) speaking/i,
      /can (you|tyler) speak at (our|my|a) (event|conference|meetup|podcast)/i,
      /speaking topics/i,
    ],
    summary:
      "Tyler speaks on the structural parallels between human cognition and AI models, autonomous agent architecture, developer leverage, and building software for local communities.",
    details: [
      "🧠 Human Minds & AI Models: Featured keynote delivered at DEVx Network San Diego (April 18, 2026), examining structural parallels between human learning and machine learning.",
      "🚀 Building in Public & Founder Journeys: The honest lessons, failures, and breakthroughs from founding beginner and shipping products openly.",
      "🤖 Agentic Developer Tooling & Workflows: How autonomous coding agents and mobile-first iteration transform engineering velocity.",
      "🎨 Creative Coding & Expressive Web: Treating code as an expressive medium for visual art, storytelling, and visceral web experiences.",
    ],
    actions: [
      { label: "Watch DEVx Talk on YouTube", href: "https://www.youtube.com/watch?v=STI5pw5F5Lo&t=631s", isExternal: true, variant: "primary" },
      { label: "Explore Speaking Topics", href: "#speaking", variant: "secondary" },
      { label: "Invite Tyler to Speak", href: "mailto:tyler@lindowlabs.dev?subject=Speaking%20Inquiry", isExternal: true, variant: "outline" },
    ],
    suggestedFollowUps: [
      "Tell me about the Human Minds & AI Models talk",
      "What is beginner?",
      "How to reach out via email?",
    ],
  },
  {
    id: "content",
    title: "Content & Newsletter",
    keywords: [
      "content", "newsletter", "linkedin", "videos", "posts", "write-ups", "articles",
      "blog", "writing", "learn", "follow", "subscribe", "social"
    ],
    patterns: [
      /where (do you|does tyler) (publish|post|write|share content)/i,
      /tell me about (your|the) (newsletter|content|videos|write-ups)/i,
      /how (can I|to) (follow|subscribe to) (you|tyler)/i,
    ],
    summary:
      "Tyler regularly publishes video walkthroughs, in-depth write-ups, and developer reflections, primarily on LinkedIn and through his upcoming newsletter digest.",
    details: [
      "📹 Video Walkthroughs: Short-form demos illustrating real project builds, architectural patterns, and debugging wins.",
      "📝 Technical Write-Ups: Deep dives into software decisions, lessons learned, and pragmatic tips.",
      "📬 Newsletter Digest: Curated developer insights, links worth reading, and reflections on building modern software.",
    ],
    actions: [
      { label: "Follow on LinkedIn", href: "https://www.linkedin.com/in/tlindow", isExternal: true, variant: "primary" },
      { label: "View Content Section", href: "#content", variant: "secondary" },
    ],
    suggestedFollowUps: [
      "What is Tyler building right now?",
      "How to book a mentoring session?",
      "What is Tyler's background?",
    ],
  },
  {
    id: "contact",
    title: "Contact & Connect",
    keywords: [
      "contact", "email", "reach", "message", "connect", "linkedin", "github",
      "touch", "hire", "hello", "talk", "socials", "phone", "chat"
    ],
    patterns: [
      /how (can I|to|do I) (contact|reach|message|email|connect with) (you|tyler)/i,
      /what is (your|tyler's) email/i,
      /where can I find (you|tyler) online/i,
      /let's (connect|talk|chat)/i,
    ],
    summary:
      "You can connect with Tyler directly via Email, LinkedIn, GitHub, or schedule a dedicated video call through Calendly.",
    details: [
      "📧 Email: tyler@lindowlabs.dev",
      "💼 LinkedIn: linkedin.com/in/tlindow",
      "🐙 GitHub: github.com/tlindow",
      "📅 Calendly: calendly.com/tylerlindow/elevate",
    ],
    actions: [
      { label: "Send Email (tyler@lindowlabs.dev)", href: "mailto:tyler@lindowlabs.dev", isExternal: true, variant: "primary" },
      { label: "LinkedIn Profile", href: "https://www.linkedin.com/in/tlindow", isExternal: true, variant: "secondary" },
      { label: "Book 1:1 on Calendly", href: "https://calendly.com/tylerlindow/elevate", isExternal: true, variant: "outline" },
    ],
    suggestedFollowUps: [
      "Tell me about Tyler's mentoring programs",
      "What projects has he built?",
      "What is Tyler's background?",
    ],
  },
  {
    id: "products",
    title: "Ventures: beginner, tinker & hāpi",
    keywords: [
      "beginner", "tinker", "hapi", "hāpi", "product", "products", "founder", "maker",
      "startup", "apps", "building", "stealth", "software", "claude", "app store", "ventures"
    ],
    patterns: [
      /what is (beginner|tinker|hapi|hāpi)/i,
      /tell me about (beginner|tinker|hapi|hāpi)/i,
      /what (products|ventures|apps) (do you|does tyler) (make|build|own|run)/i,
      /founder of beginner|maker of (hapi|hāpi)|tinker/i,
    ],
    summary:
      "Tyler founded Beginner Work (March to July 2026), built Tinker, and makes hāpi. He wound Beginner Work down in July 2026 rather than fund a GTM that wasn't compounding.",
    details: [
      "🌱 Beginner Work: Founder and CEO of Beginner Work from March to July 2026. Self-funded and built Tinker, an IDE for founders who want to get more technical, shipped and open-sourced as offline-first desktop and web apps; 28 early users. Ran 87 conversations with founders, Tinker's early target users, and 5 with VCs across SF, NYC, and LA, then wound the company down rather than fund a GTM that wasn't compounding.",
      "🌐 Tinker: An IDE for founders who want to get more technical: essays capturing the founder's voice, a code editor, and an AI terminal generating diffs from that context. Product: " +
        BEGINNER_URL +
        " Source: github.com/beginner-work/tinker.",
      "🍵 hāpi: A San Diego craft beverage brand and mobile ordering PWA serving hop-based botanical elixirs.",
    ],
    actions: [
      { label: "Open Tinker", href: BEGINNER_URL, isExternal: true, variant: "primary" },
      { label: "Connect on LinkedIn", href: "https://www.linkedin.com/in/tlindow", isExternal: true, variant: "secondary" },
      { label: "Book a Mentoring Session", href: "https://calendly.com/tylerlindow/elevate", isExternal: true, variant: "outline" },
    ],
    suggestedFollowUps: [
      "Tell me about the Human Minds & AI Models talk",
      "What technologies does Tyler use?",
      "How does 1:1 mentoring work?",
    ],
  },
];

export interface SearchResult {
  query: string;
  topic: KnowledgeTopic;
  confidence: number;
  matchedTerms: string[];
}

export function searchKnowledge(query: string): SearchResult | null {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return null;

  // 1. Direct Regex Pattern Matching (Highest Priority)
  for (const topic of knowledgeBase) {
    for (const pattern of topic.patterns) {
      if (pattern.test(cleanQuery)) {
        return {
          query,
          topic,
          confidence: 0.95,
          matchedTerms: [pattern.source],
        };
      }
    }
  }

  // 2. Keyword & Multi-term Scoring
  const tokens = cleanQuery.split(/\s+/).filter((t) => t.length > 1);
  let bestTopic: KnowledgeTopic | null = null;
  let bestScore = 0;
  let bestMatches: string[] = [];

  for (const topic of knowledgeBase) {
    let score = 0;
    const matches: string[] = [];

    // Check title match
    if (topic.title.toLowerCase().includes(cleanQuery)) {
      score += 4;
      matches.push(topic.title);
    }

    // Check keywords
    for (const kw of topic.keywords) {
      if (cleanQuery.includes(kw)) {
        score += 2.5;
        matches.push(kw);
      } else {
        for (const token of tokens) {
          if (kw === token || kw.includes(token) || token.includes(kw)) {
            score += 1.2;
            matches.push(kw);
          }
        }
      }
    }

    // Check content text
    const allContent = `${topic.summary} ${topic.details.join(" ")}`.toLowerCase();
    for (const token of tokens) {
      if (allContent.includes(token)) {
        score += 0.4;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
      bestMatches = Array.from(new Set(matches));
    }
  }

  if (bestTopic && bestScore >= 1.0) {
    return {
      query,
      topic: bestTopic,
      confidence: Math.min(0.9, 0.4 + bestScore * 0.1),
      matchedTerms: bestMatches,
    };
  }

  // Fallback to general About topic if no direct hit
  const defaultTopic = knowledgeBase.find((t) => t.id === "about") || knowledgeBase[0];
  return {
    query,
    topic: defaultTopic,
    confidence: 0.3,
    matchedTerms: ["default"],
  };
}

export const sampleQuestions = [
  "How does 1:1 mentoring work?",
  "What projects has Tyler built?",
  "What is Tyler's tech stack?",
  "How did Tyler transition into software?",
  "How can I get in touch?",
];
