/**
 * Page-level voice clips under public/audio/pages/.
 *
 * Visibility is data-driven: a page shows the player only when `pageAudio`
 * has an entry for that pathname. There is no master enable flag.
 *
 * Homepage drop-in (one step):
 *   1. Add `"/": { src: "/audio/pages/home.mp3", ... }` to `pageAudio` below.
 *   2. Place the file at `site/public/audio/pages/home.mp3`.
 * Duration is read from audio metadata; `durationSeconds` is an optional hint.
 */
export type PageAudioClip = {
  src: string;
  /** Optional hint; live duration comes from the audio element metadata. */
  durationSeconds?: number;
  /**
   * Verbatim transcript for the clip (accessibility / captions source).
   * Spell proper names as written (e.g. "Lindow"), not as they sound.
   */
  transcript?: string;
  /** Short title for aria labels (e.g. "homepage intro"). */
  title?: string;
};

/** Final homepage intro script (Tyler approved Oct 8, 2026). Spells "Lindow". */
export const HOME_PAGE_AUDIO_TRANSCRIPT = [
  "Hi, I'm Tyler Lindow. Ex-Affirm, ex-founder. I'm an engineering manager, and developer experience is my niche.",
  "",
  "Affirm is where I used to work. I led merchant and partner integrations. We cut outage detection for higher-transaction merchants from about an hour to under five minutes. I also led a domain architecture review that reshaped the merchant org.",
  "",
  "Then I was founder and CEO of Beginner Work, from March to July of 2026. I self-funded it and built Tinker, an IDE for founders who want to get more technical. It shipped to twenty-eight early users after talking to eighty-seven founders and five investors. I made the tough call to wind it down after my go-to-market approach wasn't compounding, and so now the tool is open-source. You should try it out!",
  "",
  "How I lead teams? I am and always will be someone who prioritizes inspiring engineers. I want teams working as close to the metal as possible. Here are two posts on how I build systems and teams.",
  "",
  "If that's what your team needs, let's talk. I'm open to engineering manager and senior engineering manager roles in developer platforms and partner integrations.",
  "",
  "Last, it starts with home. Home is my foundation and excellence follows self-respect.",
].join("\n");

/**
 * Pathname -> clip.
 * Example: `"/": { src: "/audio/pages/home.mp3" }`
 */
export const pageAudio: Record<string, PageAudioClip> = {
  "/": {
    src: "/audio/pages/home.mp3",
    // ~77.8s recording (v108); metadata still wins once loaded.
    durationSeconds: 78,
    title: "homepage intro",
    transcript: HOME_PAGE_AUDIO_TRANSCRIPT,
  },
};

/** Format seconds as m:ss for the docked scrubber. */
export function formatPageAudioTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Aria label for play/pause controls. */
export function pageAudioToggleLabel(
  clip: PageAudioClip | null | undefined,
  isPlaying: boolean
): string {
  const title = clip?.title?.trim() || "page audio";
  return isPlaying ? `Pause ${title}` : `Play ${title}`;
}
