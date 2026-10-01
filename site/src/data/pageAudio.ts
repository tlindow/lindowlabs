/** Page-level commentary clips under public/audio/pages/. */
export type PageAudioClip = {
  src: string;
  durationSeconds: number;
};

/**
 * Master switch for all PageAudioPlayer mounts (home, resume, blog, /time).
 * Off until professional voice-clone clips are ready — flip to `true` to re-enable.
 */
export const PAGE_AUDIO_ENABLED = false;

/** Round seconds for the visible duration hint, e.g. "(59 sec)". */
export function pageAudioLabel(durationSeconds: number): string {
  return `Listen to Tyler walk through this page (${Math.round(durationSeconds)} sec)`;
}

export const pageAudio: Record<string, PageAudioClip> = {
  "/": {
    src: "/audio/pages/home.mp3",
    durationSeconds: 58.78,
  },
  "/resume": {
    src: "/audio/pages/resume.mp3",
    durationSeconds: 61.02,
  },
  "/blog": {
    src: "/audio/pages/blog.mp3",
    durationSeconds: 42.95,
  },
};
