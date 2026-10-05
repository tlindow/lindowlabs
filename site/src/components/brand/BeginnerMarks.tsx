import type { SVGProps } from "react";

export function BeginnerSeedMark({
  className = "w-6 h-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      aria-label="beginner seed mark"
      role="img"
      className={className}
      {...props}
    >
      <circle cx="90" cy="90" r="90" fill="#2d5a3d" />
      <path
        d="M68 38 L68 138"
        stroke="#f5f3ef"
        strokeWidth="10.5"
        strokeLinecap="round"
      />
      <path
        d="M68 82 C68 68, 82 58, 100 58 C122 58, 132 72, 132 90 C132 108, 122 122, 100 122 C82 122, 68 112, 68 98Z"
        stroke="#f5f3ef"
        strokeWidth="10.5"
        fill="none"
        strokeLinejoin="round"
      />
      <path
        d="M68 56 C66 44, 78 34, 92 38 C88 44, 74 50, 68 56Z"
        fill="#7bc47a"
      />
      <path
        d="M68 48 C67 42, 60 38, 54 40 C56 44, 64 47, 68 48Z"
        fill="#5aad58"
        opacity="0.7"
      />
    </svg>
  );
}

export function TinkerGlobeMark({
  className = "w-6 h-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label="tinker rainbow web mark"
      className={className}
      {...props}
    >
      <rect width="200" height="200" rx="44" fill="#F5F3EF" />
      <circle
        cx="100"
        cy="100"
        r="76"
        fill="none"
        stroke="#C8B6E2"
        strokeWidth="9"
      />
      <line
        x1="24.06"
        y1="62.00"
        x2="175.94"
        y2="62.00"
        stroke="#F9A8D4"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="24.00"
        y1="100.00"
        x2="176.00"
        y2="100.00"
        stroke="#FDBA74"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <line
        x1="24.06"
        y1="138.00"
        x2="175.94"
        y2="138.00"
        stroke="#FDE68A"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="52"
        ry="76"
        fill="none"
        stroke="#7BC47A"
        strokeWidth="9"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="26"
        ry="76"
        fill="none"
        stroke="#7DD3FC"
        strokeWidth="9"
      />
      <line
        x1="100"
        y1="24"
        x2="100"
        y2="176"
        stroke="#6EE7B7"
        strokeWidth="9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HapiCupMark({
  className = "w-6 h-6",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="hāpi mark"
      className={className}
      {...props}
    >
      <rect width="64" height="64" rx="16" fill="#2d5a3d" />
      <path
        d="M20 22 H44 V38 C44 44.6274 38.6274 50 32 50 C25.3726 50 20 44.6274 20 38 V22 Z"
        stroke="#F5F3EF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 14 C26 18 24 19 24 22"
        stroke="#7BC47A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M32 12 C32 16 30 18 30 22"
        stroke="#FDE68A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M38 14 C38 18 36 19 36 22"
        stroke="#FDBA74"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
