/** Page-level commentary clips under public/audio/pages/. */
export type PageAudioClip = {
  src: string;
  durationSeconds: number;
};

/**
 * Master switch for all PageAudioPlayer mounts (home, resume, blog, /time).
 * Professional voice-clone clips are live.
 */
export const PAGE_AUDIO_ENABLED = true;

/** Round seconds for the visible duration hint, e.g. "(59 sec)". */
export function pageAudioLabel(durationSeconds: number): string {
  return `Listen to Tyler walk through this page (${Math.round(durationSeconds)} sec)`;
}

export const pageAudio: Record<string, PageAudioClip> = {
  "/": {
    src: "/audio/pages/home.mp3",
    durationSeconds: 61.15,
  },
  "/resume": {
    src: "/audio/pages/resume.mp3",
    durationSeconds: 62.96,
  },
  "/blog": {
    src: "/audio/pages/blog.mp3",
    durationSeconds: 47.18,
  },
};
