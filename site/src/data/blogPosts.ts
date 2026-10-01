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
  content: string[]; // Fallback body. The four case studies live in content/essays.
  /** Optional commentary clip under public/audio/pages/. Omit for no player. */
  audioSrc?: string;
  audioDurationSeconds?: number;
}

const defaultAuthor = {
  name: "Tyler Lindow",
    role: "Engineering Manager | Fintech Platform & 0→1 | Ex-Founder",
  avatar: "/IMG_0548.jpeg",
  handle: "@tlindow",
  linkedin: "https://www.linkedin.com/in/tlindow",
};

export const blogPosts: BlogPost[] = [
  {
    id: "leading-the-affirm-dot-com-redesign",
    slug: "leading-the-affirm-dot-com-redesign",
    pretitle: "My work product",
    pillarId: "core",
    pillarLabel: "B2B Fintech Case Study",
    title: "Leading the affirm.com Redesign",
    subtitle:
      "How I led my engineers through the affirm.com rebuild.",
    date: "2026-09-11",
    readTime: "2 min read",
    author: defaultAuthor,
    tags: [
      "Engineering Leadership",
      "Affirm",
      "Perseverance",
    ],
    summary:
      "In October of 2025, we revamped the affirm.com marketing website in order to create design continuity between web and mobile apps and drive more conversion for the ~1M monthly viewers of the site.",
    previewText:
      "In October of 2025, we revamped the affirm.com marketing website in order to create design continuity between web and mobile apps and drive more conversion for the ~1M monthly viewers of the site.",
    slides: [
      {
        id: 1,
        slideNumber: "01/03",
        quote:
          "Engineers are important... and even if we are not seen for all of our efforts right now, you know what you accomplished.",
      },
      {
        id: 2,
        slideNumber: "02/03",
        quote:
          "In 2026, engineering leadership is about perseverance. In the wake of developers being told that their jobs are being taken away by AI, it's about reminding them to not lose focus.",
      },
      {
        id: 3,
        slideNumber: "03/03",
        quote:
          "Remind each other that engineering will forever be a human pursuit.",
      },
    ],
    content: [],
    audioSrc: "/audio/pages/blog-affirm-dot-com-rebuild.mp3",
    audioDurationSeconds: 54.94,
  },
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
      "In September of 2025, I took the lead to bring more cohesion across the merchant engineering organization at Affirm to develop the merchant lifecycle orchestrator deployable target.",
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
          "By December of 2025, we had director sign-off on the architecture.",
      },
      {
        id: 3,
        slideNumber: "03/03",
        quote:
          "Requiring operational support at a product- and engineering-led company is a necessary growth pattern for building a system that feels like a human.",
      },
    ],
    content: [],
    audioSrc: "/audio/pages/blog-building-product-as-system-architecture.mp3",
    audioDurationSeconds: 57.91,
  },
  {
    id: "velocity-labs",
    slug: "velocity-labs",
    pretitle: "My work product",
    pillarId: "methodical-enjoyable",
    pillarLabel: "01 Methodical & Empathetic",
    title: "Velocity Labs",
    subtitle:
      "Velocity Labs gave my team a practice for working through production incidents on our legacy platform and embracing AI-driven development.",
    date: "2026-09-11",
    readTime: "3 min read",
    author: defaultAuthor,
    tags: [
      "Velocity Labs",
      "Affirm",
      "AI Development",
      "Reliability",
    ],
    summary:
      "In September of 2025, I implemented Velocity Labs for my team in order to manage new and ongoing production incidents occurring on our legacy platform every week and provide ourselves a chance to develop revenue-driving software for Affirm in the new year.",
    previewText:
      "In September of 2025, I implemented Velocity Labs for my team in order to manage new and ongoing production incidents occurring on our legacy platform every week and provide ourselves a chance to develop revenue-driving software for Affirm in the new year.",
    slides: [
      {
        id: 1,
        slideNumber: "01/03",
        quote:
          "Velocity Labs had a simple objective: get engineers on my team developing more with less, and embracing AI-driven development.",
      },
      {
        id: 2,
        slideNumber: "02/03",
        quote:
          "The reason we weren't getting as much done before wasn't because we had adopted a brittle legacy system; it was because organizationally, we did not have a growth mindset.",
      },
      {
        id: 3,
        slideNumber: "03/03",
        quote:
          "The intelligence age is helping us move faster, but the real gains in adopting AI technology will help us unlock products that make it easy to try new things and extend trust with customers.",
      },
    ],
    content: [],
    audioSrc: "/audio/pages/blog-velocity-labs.mp3",
    audioDurationSeconds: 61.47,
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
      "During my first years as an engineering manager in 2022, I promoted a junior engineer to an intermediate position in about 1 year. Over my tenure at Affirm, I had seen the team grow from one to nine.",
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
    audioSrc: "/audio/pages/blog-building-teams-as-raising-funds.mp3",
    audioDurationSeconds: 54.05,
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
    audioSrc: "/audio/pages/blog-over-index-on-intuition.mp3",
    audioDurationSeconds: 48.67,
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
