import type { SVGProps } from "react";

export type MarkProps = SVGProps<SVGSVGElement> & {
  /** When true, render in a single ink color using currentColor */
  mono?: boolean;
};

export type BrandMark = {
  id: string;
  name: string;
  tagline: string;
  rationale: string;
  Component: (props: MarkProps) => React.ReactElement;
};

/* ------------------------------------------------------------------ */
/* Shared palette ids — one gradient set, referenced from every mark   */
/* ------------------------------------------------------------------ */

function Defs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={`${id}-cool`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="50%" stopColor="#A5B4FC" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
      <linearGradient id={`${id}-warm`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="100%" stopColor="#F9A8D4" />
      </linearGradient>
      <linearGradient id={`${id}-mint`} x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#6EE7B7" />
        <stop offset="100%" stopColor="#7DD3FC" />
      </linearGradient>
    </defs>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Monogram L — solid, geometric, bold                              */
/* ------------------------------------------------------------------ */

function MonogramL({ mono, ...props }: MarkProps) {
  const fill = mono ? "currentColor" : "url(#m1-cool)";
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m1" />
      <rect x="4" y="4" width="56" height="56" rx="14" fill={fill} />
      <path
        d="M22 16 H28 V42 H46 V48 H22 Z"
        fill="#FFFDF7"
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Window Pane — plays on "Lin-dow" (window)                        */
/* ------------------------------------------------------------------ */

function WindowPane({ mono, ...props }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m2" />
      <rect
        x="8"
        y="8"
        width="48"
        height="48"
        rx="10"
        fill="none"
        stroke={mono ? "currentColor" : "#2D2A26"}
        strokeWidth="3"
      />
      <rect
        x="12"
        y="12"
        width="18"
        height="18"
        rx="3"
        fill={mono ? "currentColor" : "url(#m2-cool)"}
      />
      <rect
        x="34"
        y="12"
        width="18"
        height="18"
        rx="3"
        fill="none"
        stroke={mono ? "currentColor" : "#2D2A26"}
        strokeWidth="2.5"
      />
      <rect
        x="12"
        y="34"
        width="18"
        height="18"
        rx="3"
        fill="none"
        stroke={mono ? "currentColor" : "#2D2A26"}
        strokeWidth="2.5"
      />
      <rect
        x="34"
        y="34"
        width="18"
        height="18"
        rx="3"
        fill={mono ? "currentColor" : "url(#m2-warm)"}
        opacity={mono ? 0.35 : 1}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Stacked L — two L shapes nested (iteration / labs)               */
/* ------------------------------------------------------------------ */

export function StackedL({ mono, ...props }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m3" />
      <path
        d="M14 10 H22 V38 H44 V46 H14 Z"
        fill={mono ? "currentColor" : "url(#m3-cool)"}
        opacity={mono ? 0.35 : 0.55}
      />
      <path
        d="M22 18 H30 V46 H52 V54 H22 Z"
        fill={mono ? "currentColor" : "#2D2A26"}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Flask L — laboratory flask whose neck forms an L                 */
/* ------------------------------------------------------------------ */

function FlaskL({ mono, ...props }: MarkProps) {
  const ink = mono ? "currentColor" : "#2D2A26";
  const liquid = mono ? "currentColor" : "url(#m4-mint)";
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m4" />
      {/* neck */}
      <path
        d="M26 10 H34 V28 L48 50 A6 6 0 0 1 43 56 H21 A6 6 0 0 1 16 50 L30 28 V14"
        fill="none"
        stroke={ink}
        strokeWidth="3.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* liquid */}
      <path
        d="M22 42 L42 42 L47.5 50 A4 4 0 0 1 43.5 54 H20.5 A4 4 0 0 1 16.5 50 Z"
        fill={liquid}
        opacity={mono ? 0.4 : 1}
      />
      {/* bubble */}
      <circle cx="36" cy="48" r="1.8" fill="#FFFDF7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Prism — triangle splitting a line into the pastel spectrum       */
/* ------------------------------------------------------------------ */

function Prism({ mono, ...props }: MarkProps) {
  const ink = mono ? "currentColor" : "#2D2A26";
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m5" />
      {/* incoming ray */}
      <line
        x1="4"
        y1="32"
        x2="22"
        y2="32"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* triangle */}
      <path
        d="M22 14 L46 32 L22 50 Z"
        fill="none"
        stroke={ink}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* dispersed spectrum */}
      {mono ? (
        <>
          <line x1="46" y1="32" x2="60" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="46" y1="32" x2="60" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          <line x1="46" y1="32" x2="60" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
          <line x1="46" y1="32" x2="60" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <line x1="46" y1="32" x2="60" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
        </>
      ) : (
        <>
          <line x1="46" y1="32" x2="60" y2="22" stroke="#F9A8D4" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="32" x2="60" y2="28" stroke="#FDBA74" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="32" x2="60" y2="32" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="32" x2="60" y2="36" stroke="#7DD3FC" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="46" y1="32" x2="60" y2="42" stroke="#C4B5FD" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Node L — connected dots forming an L (systems / networks)        */
/* ------------------------------------------------------------------ */

function NodeL({ mono, ...props }: MarkProps) {
  const line = mono ? "currentColor" : "#A5B4FC";
  const node = mono ? "currentColor" : "url(#m6-cool)";
  const accent = mono ? "currentColor" : "#FDBA74";
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m6" />
      <g stroke={line} strokeWidth="2.5" strokeLinecap="round">
        <line x1="20" y1="14" x2="20" y2="32" />
        <line x1="20" y1="32" x2="20" y2="50" />
        <line x1="20" y1="50" x2="38" y2="50" />
        <line x1="38" y1="50" x2="50" y2="50" />
      </g>
      <g fill={node}>
        <circle cx="20" cy="14" r="4.5" />
        <circle cx="20" cy="32" r="4.5" />
        <circle cx="20" cy="50" r="4.5" />
        <circle cx="38" cy="50" r="4.5" />
      </g>
      <circle cx="50" cy="50" r="5" fill={accent} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Aperture — rotating blades (precision / craft / lens)            */
/* ------------------------------------------------------------------ */

function Aperture({ mono, ...props }: MarkProps) {
  const stroke = mono ? "currentColor" : "#2D2A26";
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m7" />
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke={stroke}
        strokeWidth="3"
      />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const fills = ["#C4B5FD", "#A5B4FC", "#7DD3FC", "#6EE7B7", "#FDE68A", "#F9A8D4"];
        return (
          <path
            key={angle}
            d="M32 32 L32 12 A20 20 0 0 1 49.3 22 Z"
            fill={mono ? "currentColor" : fills[i]}
            opacity={mono ? 0.15 + i * 0.1 : 0.9}
            transform={`rotate(${angle} 32 32)`}
          />
        );
      })}
      <circle cx="32" cy="32" r="5" fill="#FFFDF7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Orbit L — L anchor with a satellite (experiments / iteration)    */
/* ------------------------------------------------------------------ */

function OrbitL({ mono, ...props }: MarkProps) {
  const ink = mono ? "currentColor" : "#2D2A26";
  const orbit = mono ? "currentColor" : "#A5B4FC";
  const dot = mono ? "currentColor" : "url(#m8-warm)";
  return (
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" {...props}>
      <Defs id="m8" />
      <ellipse
        cx="32"
        cy="32"
        rx="26"
        ry="14"
        fill="none"
        stroke={orbit}
        strokeWidth="2"
        strokeDasharray="3 4"
        transform="rotate(-25 32 32)"
        opacity="0.7"
      />
      <path
        d="M22 14 H30 V44 H50 V52 H22 Z"
        fill={ink}
      />
      <circle cx="52" cy="20" r="5" fill={dot} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const brandMarks: BrandMark[] = [
  {
    id: "monogram-l",
    name: "Monogram",
    tagline: "Solid geometric L in a rounded square",
    rationale:
      "Reads instantly at 24px. Rounded-square silhouette mirrors modern app icons and crops cleanly inside the LinkedIn avatar circle.",
    Component: MonogramL,
  },
  {
    id: "window-pane",
    name: "Window Pane",
    tagline: "Four panes; one lit",
    rationale:
      "A literal nod to 'Lin-dow.' One pane glows: the experiment that's working. Works in mono as a pure grid.",
    Component: WindowPane,
  },
  {
    id: "stacked-l",
    name: "Stacked L",
    tagline: "Two Ls offset: iteration",
    rationale:
      "Two Ls in conversation. Suggests versioning, labs cycles, before/after. Subtle enough not to scream 'logo.'",
    Component: StackedL,
  },
  {
    id: "flask-l",
    name: "Flask",
    tagline: "Erlenmeyer whose neck is an L",
    rationale:
      "The most literal 'labs' read. Distinctive silhouette at small sizes. Risk: leans pharma/chem if that's not the vibe.",
    Component: FlaskL,
  },
  {
    id: "prism",
    name: "Prism",
    tagline: "One input, spectrum out",
    rationale:
      "Captures 'take an idea, split it into products.' Pairs naturally with the site's existing pastel rainbow palette.",
    Component: Prism,
  },
  {
    id: "node-l",
    name: "Node L",
    tagline: "Connected dots trace an L",
    rationale:
      "Network/systems feel. The orange terminal node reads as 'ship point.' Strong at 96px+, softer at 24px.",
    Component: NodeL,
  },
  {
    id: "aperture",
    name: "Aperture",
    tagline: "Six-blade lens in the full palette",
    rationale:
      "Most 'designed' of the set. No L reference: leans on shape recognition. Great if the brand expands beyond one person.",
    Component: Aperture,
  },
  {
    id: "orbit-l",
    name: "Orbit",
    tagline: "L anchor, satellite experiment",
    rationale:
      "The L is the core; the dot is whatever's in orbit this quarter. Implies ongoing experimentation without being busy.",
    Component: OrbitL,
  },
];
