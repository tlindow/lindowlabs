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
  /** Hero play button vs docked nav player (homepage morph threshold). */
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

function useDocked(pathname: string): boolean {
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
  const isDocked = useDocked(pathname);

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
      isDocked,
      toggle,
      seek,
      play,
      pause,
    }),
    [clipSrc, isPlaying, currentTime, duration, isDocked, toggle, seek, play, pause]
  );

  return (
    <PageAudioContext.Provider value={value}>
      {/* Single shared element so hero <-> nav never restarts playback. */}
      <audio ref={audioRef} preload="metadata" className="hidden" aria-hidden="true" />
      {children}
    </PageAudioContext.Provider>
  );
}

export function usePageAudio() {
  return useContext(PageAudioContext);
}
