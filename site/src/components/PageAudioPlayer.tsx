"use client";

type PageAudioPlayerProps = {
  src: string;
  label: string;
  ariaLabel?: string;
  /** Outer section classes. Defaults match the /time player layout. */
  className?: string;
};

export default function PageAudioPlayer({
  src,
  label,
  ariaLabel = "Listen to Tyler walk through this page",
  className = "w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-2 sm:pb-4 scroll-mt-20",
}: PageAudioPlayerProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const resolvedSrc = src.startsWith("/")
    ? `${basePath}${src}`
    : `${basePath}/${src}`;

  return (
    <section id="listen" aria-label={ariaLabel} className={className}>
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-sand px-5 py-5 sm:px-6 sm:py-6 space-y-3">
          <p className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest">
            {label}
          </p>
          <audio
            controls
            preload="metadata"
            className="w-full h-10 accent-indigo-dark"
            src={resolvedSrc}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </section>
  );
}
