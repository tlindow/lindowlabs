import { BeginnerSeedMark } from "./BeginnerMarks";

export function LinkedInIcon({ className = "w-4 h-4", size = 16 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      aria-label="LinkedIn"
      role="img"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function AffirmLogo({ className = "h-5 sm:h-6 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/affirm-logo.png`}
      alt="Affirm"
      width={100}
      height={40}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function BeginnerLogo({ className = "h-6 sm:h-7" }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-2 text-base sm:text-lg tracking-tight text-foreground ${className}`}
      style={{
        fontFamily: '"Fraunces", var(--font-fraunces), "Plus Jakarta Sans", Georgia, "Times New Roman", serif',
        fontVariationSettings: '"SOFT" 100, "WONK" 0, "opsz" 144',
        fontWeight: 600,
      }}
    >
      <BeginnerSeedMark className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg shrink-0 shadow-xs" />
      <span className="leading-none lowercase tracking-tight">beginner</span>
    </div>
  );
}

export function GalvanizeLogo({ className = "h-4 sm:h-5 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/galvanize-logo.svg`}
      alt="Galvanize"
      width={130}
      height={30}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function TheTechLogo({ className = "h-5 sm:h-6 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/the-tech-interactive-logo.png`}
      alt="The Tech Interactive"
      width={120}
      height={40}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function CHMLogo({ className = "h-5 sm:h-6 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/chm-logo.svg`}
      alt="Computer History Museum"
      width={120}
      height={40}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function UCSDLogo({ className = "h-4 sm:h-5 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/ucsd-logo.svg`}
      alt="UC San Diego"
      width={120}
      height={30}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function NorthwesternLogo({ className = "h-5 sm:h-6 md:h-7 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/northwestern-formal-wordmark.png`}
      alt="Northwestern University"
      width={160}
      height={39}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function HackReactorLogo({ className = "h-4 sm:h-5 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/hack-reactor-logo.svg`}
      alt="Hack Reactor"
      width={130}
      height={28}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function DeepAtlasLogo({ className = "h-3.5 sm:h-4.5 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/deep-atlas-logo.svg`}
      alt="Deep Atlas"
      width={120}
      height={26}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function OlinCollegeLogo({ className = "h-4 sm:h-5 w-auto" }: { className?: string }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}/olin-college-logo.svg`}
      alt="Olin College of Engineering"
      width={130}
      height={26}
      className={`object-contain ${className}`}
      loading="eager"
    />
  );
}

export function TrustedPartnersBar() {
  return (
    <div className="pt-5 sm:pt-6 pb-1 flex flex-col items-center gap-3.5 text-center">
      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-muted font-bold">
        Previous Employers
      </span>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-7 text-foreground/80 hover:text-foreground transition-colors">
        {/* Beginner Partner Badge */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <BeginnerLogo />
        </div>

        {/* Affirm Partner Badge */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <AffirmLogo className="h-5 sm:h-6 w-auto" />
        </div>

        {/* Galvanize Badge */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <GalvanizeLogo className="h-4 sm:h-5 w-auto" />
        </div>

        {/* The Tech Interactive Badge */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <TheTechLogo className="h-5 sm:h-6 w-auto" />
        </div>

        {/* Computer History Museum Badge */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <CHMLogo className="h-5 sm:h-6 w-auto" />
        </div>

        {/* UC San Diego Badge */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <UCSDLogo className="h-4 sm:h-5 w-auto" />
        </div>
      </div>
    </div>
  );
}

export function EducationInstitutionsBar() {
  return (
    <div className="pt-5 sm:pt-6 pb-5 sm:pb-6 flex flex-col items-center gap-3.5 text-center">
      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-muted font-bold">
        Devs &amp; educational institutions
      </span>
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-9 text-foreground/80 hover:text-foreground transition-colors">
        {/* UC San Diego Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <UCSDLogo className="h-4 sm:h-5 w-auto" />
        </div>

        {/* Northwestern University Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <NorthwesternLogo className="h-5 sm:h-6 md:h-7 w-auto" />
        </div>

        {/* Olin College of Engineering Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <OlinCollegeLogo className="h-4 sm:h-5 w-auto" />
        </div>

        {/* Hack Reactor Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <HackReactorLogo className="h-4 sm:h-5 w-auto" />
        </div>

        {/* Deep Atlas Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl hover:bg-surface-alt transition-colors">
          <DeepAtlasLogo className="h-3.5 sm:h-4.5 w-auto" />
        </div>
      </div>
    </div>
  );
}

