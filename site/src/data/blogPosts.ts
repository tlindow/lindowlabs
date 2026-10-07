export interface SlideData {
  id: number;
  slideNumber: string; // e.g. "01/04"
  quote: string;
  subtext?: string;
  theme?: "warm" | "dark" | "indigo";
}

export type ValuePillarId =
  | "core"
  | "executive-presence"
  | "methodical-enjoyable"
  | "systems-thinker"
  | "culture-builder";

export interface BlogPost {
  id: string;
  slug: string;
  pretitle?: string;
  pillarId?: ValuePillarId;
  pillarLabel?: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    handle: string;
    linkedin: string;
  };
  tags: string[];
  summary: string;
  previewText?: string;
  slides: SlideData[];
  content: string[]; // Fallback body. Published case studies live in content/essays.
  /**
   * Optional per-post clip path (legacy). Prefer pathname entries in
   * `pageAudio` for the hero/nav player.
   */
  audioSrc?: string;
  audioDurationSeconds?: number;
}

const defaultAuthor = {
  name: "Tyler Lindow",
    role: "Engineering Manager | Developer experience, platform, merchant & partner integrations | Ex-Affirm | Ex-founder",
  avatar: "/IMG_0548.jpeg",
  handle: "@tlindow",
  linkedin: "https://www.linkedin.com/in/tlindow",
};

export const blogPosts: BlogPost[] = [
  {
    id: "building-product-as-system-architecture",
    slug: "building-product-as-system-architecture",
    pretitle: "My work product",
    pillarId: "culture-builder",
    pillarLabel: "B2B Fintech Case Study",
    title: "Building Product as System Architecture",
    subtitle:
      "System architecture is an act of building the core product. This is the merchant lifecycle work that keeps the portal able to earn trust.",
    date: "2026-09-11",
    readTime: "3 min read",
    author: defaultAuthor,
    tags: [
      "System Architecture",
      "Product Engineering",
      "Affirm",
      "Merchant Portal",
      "Reliability",
    ],
    summary:
      "In 2025, I took the lead to bring more cohesion across Partner and Merchant Engineering at Affirm through a merchant-domain architecture review that set which team owns which merchant data.",
    previewText:
      "Building system architecture is too often seen as simply a requirement to appease enterprise customers. System architecture, along with any technical debt work, is always an act of building the core product.",
    slides: [
      {
        id: 1,
        slideNumber: "01/03",
        quote:
          "System architecture, along with any technical debt work, is always an act of building the core product.",
      },
      {
        id: 2,
        slideNumber: "02/03",
        quote:
          "We got sign-off from 2 Directors, the Principal Architect, and every team's EM.",
      },
      {
        id: 3,
        slideNumber: "03/03",
        quote:
          "Requiring operational support at a product- and engineering-led company is a necessary growth pattern for building a system that feels like a human.",
      },
    ],
    content: [],
  },
  {
    id: "building-teams-as-raising-funds",
    slug: "building-teams-as-raising-funds",
    pretitle: "My work product",
    pillarId: "methodical-enjoyable",
    pillarLabel: "01 Methodical & Empathetic",
    title: "Building Teams as Raising Funds",
    subtitle:
      "Raising funds for your position requires an intentional process: building teams by raising the funding potential of individuals and constructing a personal belief to grow the business.",
    date: "2026-09-11",
    readTime: "2 min read",
    author: defaultAuthor,
    tags: [
      "Engineering Leadership",
      "Team Building",
      "Affirm",
      "Career Growth",
    ],
    summary:
      "During my first years as an engineering manager, I promoted a junior engineer to an intermediate position in about 1 year. Over my tenure at Affirm, my team grew from 1 to 9 engineers.",
    previewText:
      "Building teams by raising the funding potential of an individual doesn't happen by mistake and it also does not happen quickly. Raising funds for your position requires an intentional process, and one that is not taken for granted.",
    slides: [
      {
        id: 1,
        slideNumber: "01/03",
        quote:
          "This work of building teams by raising the funding potential of an individual doesn't happen by mistake and it also does not happen quickly.",
      },
      {
        id: 2,
        slideNumber: "02/03",
        quote:
          "Raising funds for your position requires an intentional process, and one that is not taken for granted. A goal and a gift.",
      },
      {
        id: 3,
        slideNumber: "03/03",
        quote:
          'Building a team, just like promoting someone, requires constructing a personal belief that "I know how to grow this business."',
      },
    ],
    content: [],
  },
  {
    id: "over-index-on-intuition",
    slug: "over-index-on-intuition",
    pretitle: "Leadership opinion",
    title: "What Would You Build? Over-Indexing on Intuition in the Age of AI",
    subtitle:
      "When execution becomes frictionless, the most valuable asset we have left is our creative energy.",
    date: "2026-08-26",
    readTime: "3 min read",
    author: defaultAuthor,
    tags: [
      "Engineering Leadership",
      "Developer Intuition",
      "AI & DevX",
      "Product Strategy",
    ],
    summary:
      "I think it's product sense. There have been so many times working with engineers where having a strong point of view on the product is what truly sets someone apart.",
    previewText:
      "When execution becomes frictionless, having a strong point of view on the product is what truly sets an engineer apart.",
    slides: [
      {
        id: 1,
        slideNumber: "01/04",
        quote:
          'When I was managing engineering teams at Affirm, the most revealing question I could ask a developer was simply: "What would you build?"',
      },
      {
        id: 2,
        slideNumber: "02/04",
        quote: 'Sometimes, the response was, "Just tell me what to build."',
      },
      {
        id: 3,
        slideNumber: "03/04",
        quote:
          "The most valuable asset we have left, from software to science education, is our creative energy.",
      },
      {
        id: 4,
        slideNumber: "04/04",
        quote:
          "If we want to stay relevant, we have to over-index on our intuition.",
      },
    ],
    content: [
      `I think it's product sense. There have been so many times in working with engineers where I tend to be maybe overly empathetic, if that's possible—at least in the context of building a company. But this is one area where I would feel a little frustrated if someone said, "I don't have an opinion about the product."`,
      `When I was managing engineering teams at Affirm, the most revealing question I could ask a developer was simply:`,
      `> "What would you build?"`,
      `Maybe that seems counterintuitive in a corporate context of, "Just tell me what to build."`,
      `That last piece of the process we've relied on so much in this industry pre-AI is someone's creative energy. It's the most costly thing—it can get us into rabbit holes, and it can get us into dark places at times because we give so much of ourselves. But it is very important for us to tap into that safely, and use that tool to our advantage in this market.`,
      `One question to ask yourself is: *What does it mean to tap into my creative energy safely? And what does it mean for me to have an opinion about a product?* A great place to start is to look at the software products you already love, and figure out why you love them. Dissect them, and reverse-engineer the product a bit.`,
      `I think that is going to be a critical, must-master skill to survive in this transition into an AI world where the only thing we really have left is what makes us human—what makes us understand when something feels right. That is one of the most valuable things we have left, and so we need to over-index on that and bring that to the forefront as engineers.`,
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAdjacentPosts(slug: string): {
  previous?: BlogPost;
  next?: BlogPost;
} {
  const index = blogPosts.findIndex((post) => post.slug === slug);
  if (index < 0) return {};
  return {
    previous: index > 0 ? blogPosts[index - 1] : undefined,
    next: index < blogPosts.length - 1 ? blogPosts[index + 1] : undefined,
  };
}

export function getBlogPostByPillar(pillarId: ValuePillarId): BlogPost | undefined {
  return blogPosts.find((p) => p.pillarId === pillarId);
}
