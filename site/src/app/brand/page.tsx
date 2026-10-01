import type { Metadata } from "next";
import Link from "next/link";
import { brandMarks, type BrandMark } from "@/components/brand/marks";
import MarkDownload from "@/components/brand/MarkDownload";

export const metadata: Metadata = {
  title: "Brand Marks: Lindow Labs",
  description:
    "A working gallery of brand mark concepts for Lindow Labs, shown at the sizes they'll actually be used.",
};

const previewSizes = [160, 96, 48, 24];

function SizeRow({ mark }: { mark: BrandMark }) {
  const { Component } = mark;
  return (
    <div className="flex items-end gap-6 flex-wrap">
      {previewSizes.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Component width={size} height={size} />
          <span className="text-[11px] font-medium text-muted tabular-nums">
            {size}px
          </span>
        </div>
      ))}
    </div>
  );
}

function AvatarPreview({ mark }: { mark: BrandMark }) {
  const { Component } = mark;
  return (
    <div className="flex items-center gap-4">
      {/* LinkedIn-style circular crop, light background */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-1 ring-border bg-surface flex items-center justify-center">
          <Component width={72} height={72} />
        </div>
        <span className="text-[11px] text-muted">Avatar</span>
      </div>
      {/* Dark background */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-1 ring-border bg-[#1A1815] flex items-center justify-center text-background">
          <Component width={72} height={72} mono />
        </div>
        <span className="text-[11px] text-muted">Mono · dark</span>
      </div>
      {/* Mono on light */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-1 ring-border bg-surface flex items-center justify-center text-foreground">
          <Component width={72} height={72} mono />
        </div>
        <span className="text-[11px] text-muted">Mono · light</span>
      </div>
    </div>
  );
}

function MarkCard({ mark, index }: { mark: BrandMark; index: number }) {
  return (
    <article
      id={mark.id}
      className="scroll-mt-24 rounded-2xl border border-border bg-surface overflow-hidden"
    >
      <header className="px-6 sm:px-8 py-5 border-b border-border flex items-center gap-3 flex-wrap">
        <span className="text-xs font-semibold tracking-widest uppercase text-muted tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground">
          {mark.name}
        </h2>
        <span className="text-sm text-muted">· {mark.tagline}</span>
        <div className="ml-auto">
          <MarkDownload markId={mark.id} />
        </div>
      </header>

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-0 md:divide-x divide-border">
        <div className="px-6 sm:px-8 py-8 space-y-8">
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-4">
              Sizes
            </p>
            <SizeRow mark={mark} />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-4">
              In context
            </p>
            <AvatarPreview mark={mark} />
          </div>
        </div>
        <div className="px-6 sm:px-8 py-8 bg-surface-alt/40">
          <p className="text-[11px] font-semibold tracking-widest uppercase text-muted mb-3">
            Rationale
          </p>
          <p className="text-sm leading-relaxed text-foreground/80">
            {mark.rationale}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function BrandPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
        <header className="mb-12 sm:mb-16">
          <Link
            href="/"
            className="text-xs font-medium tracking-widest uppercase text-muted hover:text-foreground transition-colors"
          >
            ← Lindow Labs
          </Link>
          <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
            Brand Marks
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
            Eight concepts for a Lindow Labs mark, each sized the way LinkedIn
            will actually crop it. Review, pick one (or tell me what to push
            harder on), and we&rsquo;ll refine the winner into a full identity.
          </p>

          <nav className="mt-8 flex flex-wrap gap-2">
            {brandMarks.map((m, i) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="text-xs font-medium px-3 py-1.5 rounded-full border border-border bg-surface hover:border-violet/40 hover:text-violet transition-colors"
              >
                {String(i + 1).padStart(2, "0")} · {m.name}
              </a>
            ))}
          </nav>
        </header>

        <div className="space-y-6">
          {brandMarks.map((mark, i) => (
            <MarkCard key={mark.id} mark={mark} index={i} />
          ))}
        </div>

        <footer className="mt-16 pt-8 border-t border-border">
          <p className="text-sm text-muted">
            Prefer one? Reply with the number and whether you want it pushed
            more geometric, softer, or stripped to pure type.
          </p>
        </footer>
      </div>
    </main>
  );
}
