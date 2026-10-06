/**
 * Hand-authored overlay for /learning: objectives, reflection prompts,
 * exercise links, and chapter titles the Notion page doesn't spell out.
 * No Tyler writing, no status. Joined by normalized course title / lesson key.
 */

import { fastifyPaymentsExercise } from "@/lib/learning/openInCursor";
import type { OverlayFile } from "@/lib/learning/types";

const fastify = fastifyPaymentsExercise();

export const learningOverlay: OverlayFile = {
  courses: [
    {
      key: "sre",
      matchTitles: ["Site Reliability Engineering"],
      lessons: [
        {
          key: "ch3",
          chapterNumber: 3,
          title: "Embracing Risk",
          objective:
            "Learn how SRE treats reliability as a target to manage against the cost of more reliability, using risk tolerance and error budgets instead of aiming for 100%.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch4",
          chapterNumber: 4,
          title: "Service Level Objectives",
          objective:
            "Learn how to choose and define service level indicators (SLIs), objectives (SLOs), and agreements (SLAs), and how they differ.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch6",
          chapterNumber: 6,
          title: "Monitoring Distributed Systems",
          objective:
            'Learn what to monitor and alert on in a distributed system, including the "four golden signals" and the difference between symptoms and causes.',
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch14",
          chapterNumber: 14,
          title: "Managing Incidents",
          objective:
            "Learn a structured way to run incident response, with clear roles, a single point of command, and ongoing communication.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch15",
          chapterNumber: 15,
          title: "Postmortem Culture: Learning from Failure",
          objective:
            "Learn how to write blameless postmortems that capture what happened and lead to follow-up fixes.",
          reflectionPrompt: null,
          exercises: [],
        },
      ],
    },
    {
      key: "ddd",
      matchTitles: ["Domain-Driven Design"],
      lessons: [
        {
          key: "ch1",
          chapterNumber: 1,
          title: "Crunching Knowledge",
          objective:
            "Learn how developers and domain experts work together, over and over, to boil a messy domain down into a useful model.",
          reflectionPrompt:
            "Pick one payments rule you work with, such as when a refund is allowed. Write it the way the code enforces it today, then list the questions you would ask a payments domain expert to find what's missing.",
          exercises: [],
        },
        {
          key: "ch2",
          chapterNumber: 2,
          title: "Communication and the Use of Language",
          objective:
            'Learn why the team should share one "ubiquitous language" that is used the same way in conversation, documents, diagrams, and code.',
          reflectionPrompt:
            "For one payments-team term (for example merchant, payment, or refund), write down where it shows up in conversation, in tickets, and in code, and whether it means the same thing in each place.",
          exercises: [fastify],
        },
        {
          key: "ch3",
          chapterNumber: 3,
          title: "Binding Model and Implementation",
          objective:
            "Learn why the code should directly reflect the domain model (model-driven design), so changing one means changing the other.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch4",
          chapterNumber: 4,
          title: "Isolating the Domain",
          objective:
            "Learn how a layered architecture keeps domain logic separate from UI, application, and infrastructure code.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch5",
          chapterNumber: 5,
          title: "A Model Expressed in Software",
          objective:
            "Learn the basic building blocks for expressing a model in code: entities, value objects, services, and modules.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch6",
          chapterNumber: 6,
          title: "The Life Cycle of a Domain Object",
          objective:
            "Learn how aggregates, factories, and repositories manage creating, storing, and changing domain objects while keeping their rules intact.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch7",
          chapterNumber: 7,
          title: "Using the Language: An Extended Example",
          objective:
            "Follow a worked cargo-shipping example that applies the earlier building blocks to one system end to end.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch8",
          chapterNumber: 8,
          title: "Breakthrough",
          objective:
            "Learn how steady refactoring can lead to a sudden, deeper model, shown through a lending (loan) project story.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch9",
          chapterNumber: 9,
          title: "Making Implicit Concepts Explicit",
          objective:
            "Learn to spot concepts hidden in the domain language or awkward code and make them explicit, including constraints, processes, and the Specification pattern.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch10",
          chapterNumber: 10,
          title: "Supple Design",
          objective:
            "Learn design techniques that make code easier to change and reason about, such as intention-revealing interfaces and side-effect-free functions.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch11",
          chapterNumber: 11,
          title: "Applying Analysis Patterns",
          objective:
            "Learn how to use published analysis patterns, including accounting-style ones, as a starting point for a domain model.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch12",
          chapterNumber: 12,
          title: "Relating Design Patterns to the Model",
          objective:
            "Learn how general design patterns such as Strategy and Composite can express domain concepts, not just technical structure.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch13",
          chapterNumber: 13,
          title: "Refactoring Toward Deeper Insight",
          objective:
            "Learn how to make refactoring for domain insight, not only code cleanliness, an ongoing habit.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch14",
          chapterNumber: 14,
          title: "Maintaining Model Integrity (bounded contexts)",
          objective:
            "Learn how bounded contexts and a context map keep separate models consistent inside their boundaries and explicit at the seams between teams and systems.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch15",
          chapterNumber: 15,
          title: "Distillation",
          objective:
            "Learn how to find and protect the core domain, and keep it separate from generic or supporting parts of the system.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch16",
          chapterNumber: 16,
          title: "Large-Scale Structure",
          objective:
            "Learn system-wide organizing ideas, such as responsibility layers, that help large systems stay understandable.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ch17",
          chapterNumber: 17,
          title: "Bringing the Strategy Together",
          objective:
            "Learn how bounded contexts, distillation, and large-scale structure combine into one strategic design approach.",
          reflectionPrompt: null,
          exercises: [],
        },
      ],
    },
    {
      key: "ttft",
      matchTitles: [
        "How can we develop transformative tools for thought?",
      ],
      lessons: [
        {
          key: "essay",
          chapterNumber: null,
          title: "How can we develop transformative tools for thought? (whole essay)",
          url: "https://numinous.productions/ttft/",
          objective:
            "Understand the essay's argument for tools that change how people think, including the 'mnemonic medium' that builds spaced-repetition review into reading.",
          reflectionPrompt: null,
          exercises: [],
        },
      ],
    },
    {
      key: "ts-react",
      matchTitles: ["TypeScript and React foundations"],
      lessons: [
        {
          key: "thinking-in-react",
          chapterNumber: null,
          title: "Thinking in React",
          url: "https://react.dev/learn/thinking-in-react",
          objective:
            "Learn to break a UI into a component hierarchy, build a static version, find the minimal state, decide where state lives, and pass changes back up.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "ts-for-js",
          chapterNumber: null,
          title: "TypeScript for JavaScript Programmers",
          url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html",
          objective:
            "Learn how TypeScript adds types to JavaScript, including type inference, interfaces, union types, generics, and structural typing.",
          reflectionPrompt: null,
          exercises: [],
        },
        {
          key: "using-typescript",
          chapterNumber: null,
          title: "Using TypeScript",
          url: "https://react.dev/learn/typescript",
          objective:
            "Learn how to type React component props, hooks, DOM events, and children.",
          reflectionPrompt: null,
          exercises: [],
        },
      ],
    },
  ],
};
