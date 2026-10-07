/**
 * Page-level voice clips under public/audio/pages/.
 *
 * Visibility is data-driven: a page shows the player only when `pageAudio`
 * has an entry for that pathname. There is no master enable flag.
 *
 * Homepage drop-in (one step):
 *   1. Add `"/": { src: "/audio/pages/home.mp3" }` to `pageAudio` below.
 *   2. Place the file at `site/public/audio/pages/home.mp3`.
 * Duration is read from audio metadata; `durationSeconds` is optional.
 */
export type PageAudioClip = {
  src: string;
  /** Optional hint; live duration comes from the audio element metadata. */
  durationSeconds?: number;
};

/**
 * Pathname -> clip. Empty until new recordings land.
 * Example: `"/": { src: "/audio/pages/home.mp3" }`
 */
export const pageAudio: Record<string, PageAudioClip> = {};

/** Format seconds as m:ss for the docked scrubber. */
export function formatPageAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
