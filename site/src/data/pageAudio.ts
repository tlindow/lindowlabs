/** Page-level commentary clips under public/audio/pages/. */
export type PageAudioClip = {
  src: string;
  durationSeconds: number;
};

export const pageAudio: Record<string, PageAudioClip> = {
  "/": {
    src: "/audio/pages/home.mp3",
    durationSeconds: 58.78,
  },
  "/modules": {
    src: "/audio/pages/modules.mp3",
    durationSeconds: 43.23,
  },
  "/resume": {
    src: "/audio/pages/resume.mp3",
    durationSeconds: 61.02,
  },
  "/blog": {
    src: "/audio/pages/blog.mp3",
    durationSeconds: 42.95,
  },
  "/brand": {
    src: "/audio/pages/brand.mp3",
    durationSeconds: 48.61,
  },
};
