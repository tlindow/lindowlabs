/**
 * Page-level voice clips under public/audio/pages/.
 *
 * Visibility is data-driven: a page shows the player only when `pageAudio`
 * has an entry for that pathname. There is no master enable flag.
 *
 * Homepage drop-in (one step):
 *   1. Add `"/": { src: "/audio/pages/home-v3.mp3", ... }` to `pageAudio` below.
 *   2. Place the file at `site/public/audio/pages/home-v3.mp3`.
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

/** Homepage intro script (v3, ~64s). Spells "Lindow". */
export const HOME_PAGE_AUDIO_TRANSCRIPT =
  "Hi, I'm Tyler Lindow. Ex-Affirm, ex-founder. I'm an engineering manager, and developer experience is my niche. At Affirm, I led merchant and partner integrations. We cut outage detection for higher-transaction merchants from about an hour to under five minutes. I also led a domain architecture review that reshaped the merchant org. Then I was founder and CEO of Beginner Work, from March to July of 2026. I self-funded it and built Tinker, an IDE for founders who want to get more technical. It shipped to twenty-eight early users after talking to eighty-seven founders and five investors. I made the tough call to wind it down after my go-to-market approach wasn't compounding, and so now the tool is open-source. How I lead teams? I am and always will be someone who prioritizes inspiring engineers. I want teams working as close to the metal as possible. If that's what your team needs, let's talk. I'm open to engineering manager and senior engineering manager roles in developer platforms and partner integrations.";

/**
 * Pathname -> clip.
 * Example: `"/": { src: "/audio/pages/home-v3.mp3" }`
 */
/** Retreat intro on /engineering-leaders (Tyler, ~36s). Spells "Lindow". */
export const RETREAT_PAGE_AUDIO_TRANSCRIPT =
  "Hey, I'm Tyler Lindow. This is thirty minutes for engineering leaders. A short retreat. Bring one thing that's been eating your team's time. A partner integration that keeps slipping, an on-call rotation that wears people down, a reliability gap nobody owns. We slow down, look at it together, and you leave with one next step you can act on this week. I led merchant engineering teams at Affirm, and the way I lead comes down to this: every engineer has genius in them. My job is clearing the path so it shows up in production. If that sounds like the half hour you need, let's find a time.";

const RETREAT_PAGE_AUDIO_CLIP: PageAudioClip = {
  src: "/audio/pages/retreat-v5.mp3",
  // ~36.4s recording; metadata still wins once loaded.
  durationSeconds: 36,
  title: "retreat intro",
  transcript: RETREAT_PAGE_AUDIO_TRANSCRIPT,
};

export const pageAudio: Record<string, PageAudioClip> = {
  "/": {
    src: "/audio/pages/home-v3.mp3",
    // ~63.7s recording (v3); metadata still wins once loaded.
    durationSeconds: 64,
    title: "homepage intro",
    transcript: HOME_PAGE_AUDIO_TRANSCRIPT,
  },
  "/engineering-leaders": RETREAT_PAGE_AUDIO_CLIP,
  // Legacy path kept until redirect-only; dock/audio resolve if ever hit.
  "/get-your-time-back": RETREAT_PAGE_AUDIO_CLIP,
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
