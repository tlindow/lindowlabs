"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { pageAudio, type PageAudioClip } from "@/data/pageAudio";
import { useProfileAnchors } from "@/hooks/useProfileAnchors";

/** Matches AVATAR_MORPH_SCROLL_DISTANCE in ScrollMorphAvatar (hero coin -> nav). */
const DOCK_SCROLL_PX = 240;

/** Dev-only preview query: `?pageAudioPreview=1` (clip file must not be committed). */
export const PAGE_AUDIO_PREVIEW_QUERY = "pageAudioPreview";
export const PAGE_AUDIO_PREVIEW_SRC = "/audio/pages/_dev-preview.mp3";

type PageAudioContextValue = {
  /** True when this pathname has a clip (or a valid dev preview). */
  hasClip: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /**
   * Past the homepage hero morph threshold (other routes: always true).
   * Layout: nav slot enters the document flow once past hero.
   */
  isPastHero: boolean;
  /**
   * Nav profile photo (+ full scrubber) may show only when no profile-photo
   * anchor is in view. False at hero and at Let's talk.
   */
  showNavPhoto: boolean;
  /** Hero profile-photo anchor intersects the tuned viewport. */
  heroAnchorVisible: boolean;
  /** Let's talk / contact profile-photo anchor intersects. */
  contactAnchorVisible: boolean;
  /**
   * @deprecated Prefer showNavPhoto. True when the nav owns the visible photo
   * and (when a clip exists) the full docked player.
   */
  isDocked: boolean;
  toggle: () => void;
  seek: (time: number) => void;
  play: () => void;
  pause: () => void;
};

const PageAudioContext = createContext<PageAudioContextValue>({
  hasClip: false,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  isPastHero: true,
  showNavPhoto: true,
  heroAnchorVisible: false,
  contactAnchorVisible: false,
  isDocked: true,
  toggle: () => {},
  seek: () => {},
  play: () => {},
  pause: () => {},
});

function withBasePath(src: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!src.startsWith("/")) return `${base}/${src}`;
  return `${base}${src}`;
}

function readDevPreviewActive(): boolean {
  if (process.env.NODE_ENV !== "development") return false;
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get(PAGE_AUDIO_PREVIEW_QUERY) === "1";
}

function subscribeDevPreview(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onChange = () => onStoreChange();
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function useDevPreviewActive(): boolean {
  return useSyncExternalStore(subscribeDevPreview, readDevPreviewActive, () => false);
}

function resolveClip(
  pathname: string,
  previewActive: boolean
): PageAudioClip | null {
  const mapped = pageAudio[pathname];
  if (mapped?.src) return mapped;

  // Dev-only: local preview clip for screenshots; never ship voice via this path.
  if (previewActive && pathname === "/") {
    return { src: PAGE_AUDIO_PREVIEW_SRC };
  }
  return null;
}

function usePastHero(pathname: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};
      const onScroll = () => onStoreChange();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    },
    []
  );

  const getSnapshot = useCallback(() => {
    if (pathname !== "/") return true;
    if (typeof window === "undefined") return false;
    return window.scrollY >= DOCK_SCROLL_PX * 0.85;
  }, [pathname]);

  return useSyncExternalStore(subscribe, getSnapshot, () => pathname !== "/");
}

export function PageAudioProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const previewActive = useDevPreviewActive();
  const clip = useMemo(
    () => resolveClip(pathname, previewActive),
    [pathname, previewActive]
  );
  const clipSrc = clip?.src ?? null;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isPastHero = usePastHero(pathname);
  const { anyAnchorVisible, heroVisible, contactVisible } = useProfileAnchors();

  // Gate on isPastHero so the homepage top never flashes a nav photo before
  // IntersectionObserver registers the hero anchor.
  const showNavPhoto = isPastHero && !anyAnchorVisible;

  // Reset playback UI when the clip identity changes (render-time adjust).
  const [prevClipSrc, setPrevClipSrc] = useState(clipSrc);
  if (clipSrc !== prevClipSrc) {
    setPrevClipSrc(clipSrc);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(
      typeof clip?.durationSeconds === "number" && clip.durationSeconds > 0
        ? clip.durationSeconds
        : 0
    );
  }

  // Keep the single <audio> element in sync with the active clip.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!clipSrc) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    const resolved = withBasePath(clipSrc);
    if (audio.getAttribute("src") !== resolved) {
      audio.src = resolved;
      audio.load();
    }
  }, [clipSrc]);

  // Bind media events once.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime || 0);
    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("durationchange", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("durationchange", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio?.src) return;
    void audio.play().catch(() => {
      /* autoplay / gesture errors are silent */
    });
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio?.src) return;
    if (audio.paused) {
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(time)) return;
    const next = Math.max(0, Math.min(time, audio.duration || time));
    audio.currentTime = next;
    setCurrentTime(next);
  }, []);

  const value = useMemo<PageAudioContextValue>(
    () => ({
      hasClip: Boolean(clipSrc),
      isPlaying,
      currentTime,
      duration,
      isPastHero,
      showNavPhoto,
      heroAnchorVisible: heroVisible,
      contactAnchorVisible: contactVisible,
      isDocked: showNavPhoto,
      toggle,
      seek,
      play,
      pause,
    }),
    [
      clipSrc,
      isPlaying,
      currentTime,
      duration,
      isPastHero,
      showNavPhoto,
      heroVisible,
      contactVisible,
      toggle,
      seek,
      play,
      pause,
    ]
  );

  return (
    <PageAudioContext.Provider value={value}>
      {/* Single shared element so hero / nav / contact never restart playback. */}
      <audio ref={audioRef} preload="metadata" className="hidden" aria-hidden="true" />
      {children}
    </PageAudioContext.Provider>
  );
}

export function usePageAudio() {
  return useContext(PageAudioContext);
}
