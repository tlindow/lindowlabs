"use client";

export default function LeadersAudio() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  return (
    <section
      id="listen"
      aria-label="Listen to Tyler read this note"
      className="w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-2 sm:pb-4 scroll-mt-20"
    >
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-sand px-5 py-5 sm:px-6 sm:py-6 space-y-3">
          <p className="text-xs sm:text-sm font-mono font-bold text-indigo-dark uppercase tracking-widest">
            Listen to Tyler read this (50 sec)
          </p>
          <audio
            controls
            preload="metadata"
            className="w-full h-10 accent-indigo-dark"
            src={`${basePath}/audio/time-note.mp3`}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </section>
  );
}
