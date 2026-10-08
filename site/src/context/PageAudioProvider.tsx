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
import {
  getDirectToHeroActive,
  getProfileDockOwner,
  measureContactTargetScrollY,
  NAV_DOCK_SCROLL_PX,
  subscribeDirectToHeroActive,
  type ProfileDockOwner,
} from "@/lib/profileDock";

/** Dev-only preview query: `?pageAudioPreview=1` (clip file must not be committed). */
export const PAGE_AUDIO_PREVIEW_QUERY = "pageAudioPreview";
export const PAGE_AUDIO_PREVIEW_SRC = "/audio/pages/_dev-preview.mp3";

type PageAudioContextValue = {
  /** True when this pathname has a clip (or a valid dev preview). */
  hasClip: boolean;
  /** Active clip metadata (src, optional transcript / duration hint). */
  clip: PageAudioClip | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  /**
   * Past the homepage hero morph threshold (other routes: always true).
   * Layout: nav slot enters the document flow once past hero.
   */
  isPastHero: boolean;
  /**
   * Nav profile photo (+ full scrubber) only while the morph is docked at nav.
   * False at hero and at Let's talk — never during mid-flight.
   */
  showNavPhoto: boolean;
  /** Scroll-derived owner of the visible profile photo. */
  dockOwner: ProfileDockOwner;
  /** Hero owns the photo (morph at hero). */
  heroAnchorVisible: boolean;
  /** Let's talk owns the photo (morph at contact). */
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
  clip: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  isPastHero: true,
  showNavPhoto: true,
  dockOwner: "nav",
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

type DockSnapshot = {
  owner: ProfileDockOwner;
  isPastHero: boolean;
  /** False while click-to-hero flies past the nav dock zone. */
  showNavPhoto: boolean;
};

/** Module cache for contact mid-viewport scrollY (refresh on resize only). */
let contactTargetScrollY = 0;

function refreshContactTarget() {
  if (typeof window === "undefined") return;
  contactTargetScrollY = measureContactTargetScrollY();
}

function readDockSnapshot(pathname: string): DockSnapshot {
  if (typeof window === "undefined") {
    return { owner: "nav", isPastHero: true, showNavPhoto: true };
  }
  if (pathname !== "/") {
    return { owner: "nav", isPastHero: true, showNavPhoto: true };
  }
  const scrollY = window.scrollY;
  const owner = getProfileDockOwner(
    scrollY,
    contactTargetScrollY,
    window.innerHeight
  );
  // Layout reserve once past the hero morph; stays true through Let's talk.
  const isPastHero = scrollY >= NAV_DOCK_SCROLL_PX * 0.85;
  // Nav photo only while scroll-docked at nav — never mid-morph, never during
  // click-to-hero (which skips the nav dock visually).
  const showNavPhoto = owner === "nav" && !getDirectToHeroActive();
  return { owner, isPastHero, showNavPhoto };
}

function dockSnapshotsEqual(a: DockSnapshot, b: DockSnapshot): boolean {
  return (
    a.owner === b.owner &&
    a.isPastHero === b.isPastHero &&
    a.showNavPhoto === b.showNavPhoto
  );
}

function useProfileDock(pathname: string): DockSnapshot {
  const cachedRef = useRef<DockSnapshot>(
    pathname === "/"
      ? { owner: "hero", isPastHero: false, showNavPhoto: false }
      : { owner: "nav", isPastHero: true, showNavPhoto: true }
  );

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (typeof window === "undefined") return () => {};

      refreshContactTarget();
      cachedRef.current = readDockSnapshot(pathname);

      const onScroll = () => {
        const next = readDockSnapshot(pathname);
        if (!dockSnapshotsEqual(next, cachedRef.current)) {
          cachedRef.current = next;
          onStoreChange();
        }
      };

      const onLayout = () => {
        refreshContactTarget();
        const next = readDockSnapshot(pathname);
        cachedRef.current = next;
        onStoreChange();
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onLayout, { passive: true });
      const unsubDirect = subscribeDirectToHeroActive(onScroll);
      const contactEl = document.getElementById("contact-avatar-target");
      const ro = new ResizeObserver(onLayout);
      if (contactEl) ro.observe(contactEl);
      ro.observe(document.body);

      // Notify after first measure so SSR hero default can update.
      queueMicrotask(onStoreChange);

      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onLayout);
        unsubDirect();
        ro.disconnect();
      };
    },
    [pathname]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return cachedRef.current;
    const next = readDockSnapshot(pathname);
    // useSyncExternalStore compares with Object.is — return the cached
    // reference when values are unchanged or React loops forever (#185).
    if (dockSnapshotsEqual(next, cachedRef.current)) {
      return cachedRef.current;
    }
    cachedRef.current = next;
    return cachedRef.current;
  }, [pathname]);

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () =>
      pathname === "/"
        ? { owner: "hero" as const, isPastHero: false, showNavPhoto: false }
        : { owner: "nav" as const, isPastHero: true, showNavPhoto: true }
  );
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
  const dock = useProfileDock(pathname);

  const showNavPhoto = dock.showNavPhoto;
  const heroAnchorVisible = dock.owner === "hero";
  const contactAnchorVisible = dock.owner === "contact";
  const isPastHero = dock.isPastHero;

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
      clip,
      isPlaying,
      currentTime,
      duration,
      isPastHero,
      showNavPhoto,
      dockOwner: dock.owner,
      heroAnchorVisible,
      contactAnchorVisible,
      isDocked: showNavPhoto,
      toggle,
      seek,
      play,
      pause,
    }),
    [
      clipSrc,
      clip,
      isPlaying,
      currentTime,
      duration,
      isPastHero,
      showNavPhoto,
      dock.owner,
      heroAnchorVisible,
      contactAnchorVisible,
      toggle,
      seek,
      play,
      pause,
    ]
  );

  const transcript = clip?.transcript?.trim() || "";
  const audioTitle = clip?.title?.trim() || "page audio";

  return (
    <PageAudioContext.Provider value={value}>
      {/* Single shared element so hero / nav / contact never restart playback. */}
      <audio
        ref={audioRef}
        preload="metadata"
        className="hidden"
        aria-hidden="true"
        title={clipSrc ? audioTitle : undefined}
      />
      {transcript ? (
        <div className="sr-only" data-page-audio="transcript">
          <h2>Transcript: {audioTitle}</h2>
          <p>{transcript}</p>
        </div>
      ) : null}
      {children}
    </PageAudioContext.Provider>
  );
}

export function usePageAudio() {
  return useContext(PageAudioContext);
}
