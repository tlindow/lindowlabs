import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Em dashes in shipped copy fail the built-HTML scan (check:em-dashes) after a
// full build. Catch them at lint time instead, in every source file (shared
// components included), not just the files reachable from an app route.
const EM_DASH = "/\\u2014|&mdash;|&#8212;|&#x2014;/";
const EM_DASH_MESSAGE =
  "No em dash (U+2014) in copy. Use a comma, colon, period, or en dash. See docs/loop-log.md (check:em-dashes).";

const emDashSelectors = [
  { selector: `Literal[value=${EM_DASH}]`, message: EM_DASH_MESSAGE },
  { selector: `TemplateElement[value.raw=${EM_DASH}]`, message: EM_DASH_MESSAGE },
  { selector: `JSXText[value=${EM_DASH}]`, message: EM_DASH_MESSAGE },
];

// Grandfathered files that already hold em dashes: unused components/data,
// plus blogPosts.ts (over-index-on-intuition is excluded from the em dash
// checks on purpose). Warn here; check:em-dashes still guards rendered HTML.
// Shrink this list only; never add to it.
const EM_DASH_BASELINE = [
  "src/components/AILauncherModal.tsx",
  "src/components/CareerNarrative.tsx",
  "src/components/CheckoutDrawer.tsx",
  "src/components/Content.tsx",
  "src/components/Mentoring.tsx",
  "src/components/Speaking.tsx",
  "src/components/Timeline.tsx",
  "src/components/WhereHaveIBeen.tsx",
  "src/data/aiKnowledge.ts",
  "src/data/blogPosts.ts",
  "src/data/timelineData.ts",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx,js,jsx,mjs}"],
    rules: {
      "no-restricted-syntax": ["error", ...emDashSelectors],
    },
  },
  {
    files: EM_DASH_BASELINE,
    rules: {
      "no-restricted-syntax": ["warn", ...emDashSelectors],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
