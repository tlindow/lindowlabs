"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { Pause, Play } from "lucide-react";
import { pageAudioToggleLabel } from "@/data/pageAudio";
import { usePageAudio } from "@/context/PageAudioProvider";
import { getProfileDockOwner } from "@/lib/profileDock";
import {
  AVATAR_MORPH_SCROLL_DISTANCE,
  HERO_PIN_SCROLL_DISTANCE,
} from "@/components/animations/ScrollMorphAvatar";

/** Match profile morph: above sticky nav (z-50) during hero→nav. */
const MORPH_OVER_NAV_Z = 60;

const HERO_PLAY_RING = {
  size: 52,
  radius: 23,
  stroke: 2.75,
} as const;

function subscribePortalRoot() {
  return () => {};
}
function getPortalRoot(): HTMLElement | null {
  return typeof document !== "undefined" ? document.body : null;
}
function getPortalRootServer(): HTMLElement | null {
  return null;
}

function playProgressFraction(currentTime: number, duration: number): number {
  if (!(duration > 0) || !Number.isFinite(currentTime)) return 0;
  return Math.min(1, Math.max(0, currentTime / duration));
}

interface PlayCoords {
  heroX: number;
  heroY: number;
  heroSize: number;
  navX: number;
  navY: number;
  navSize: number;
}

interface ScrollMorphPlayButtonProps {
  progress?: MotionValue<number>;
  directToHero?: MotionValue<number>;
}

/**
 * Hero play control that move/scales into the centered nav play slot over the
 * sticky bar (no flip; profile coin flips on the same progress). Unmounts when
 * nav owns the dock so only nav-play remains.
 */
export default function ScrollMorphPlayButton({
  progress: customProgress,
  directToHero: customDirectToHero,
}: ScrollMorphPlayButtonProps) {
  const { hasClip, clip, isPlaying, currentTime, duration, toggle } =
    usePageAudio();

  const [coords, setCoords] = useState<PlayCoords | null>(null);
  const coordsRef = useRef<PlayCoords | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [dockedAway, setDockedAway] = useState(false);
  const portalEl = useSyncExternalStore(
    subscribePortalRoot,
    getPortalRoot,
    getPortalRootServer
  );

  const { scrollY } = useScroll();
  const internalRawProgress = useTransform(
    scrollY,
    [0, HERO_PIN_SCROLL_DISTANCE],
    [0, 1],
    { clamp: true }
  );
  const internalSpring = useSpring(internalRawProgress, {
    stiffness: 220,
    damping: 24,
    mass: 0.4,
  });
  const progress = customProgress || internalSpring;
  const fallbackDirectToHero = useTransform(scrollY, () => 0);
  const activeDirectToHero = customDirectToHero || fallbackDirectToHero;

  useEffect(() => {
    let rafId = 0;
    let measureScheduled = false;

    const measureCoords = () => {
      const heroEl = document.getElementById("hero-play-anchor");
      const navEl = document.getElementById("navbar-play-target");
      if (!heroEl || !navEl) {
        rafId = requestAnimationFrame(measureCoords);
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      const currentScrollY = window.scrollY;

      const newCoords: PlayCoords = {
        heroX: heroRect.left,
        heroY: heroRect.top + currentScrollY,
        heroSize: heroRect.width,
        navX: navRect.left,
        navY: navRect.top,
        navSize: navRect.width,
      };

      const prev = coordsRef.current;
      const unchanged =
        prev &&
        prev.heroX === newCoords.heroX &&
        prev.heroY === newCoords.heroY &&
        prev.heroSize === newCoords.heroSize &&
        prev.navX === newCoords.navX &&
        prev.navY === newCoords.navY &&
        prev.navSize === newCoords.navSize;

      coordsRef.current = newCoords;
      if (!unchanged) setCoords(newCoords);
      setIsReady(true);
    };

    const scheduleMeasure = () => {
      if (measureScheduled) return;
      measureScheduled = true;
      rafId = requestAnimationFrame(() => {
        measureScheduled = false;
        measureCoords();
      });
    };

    measureCoords();
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(document.body);
    const heroEl = document.getElementById("hero-play-anchor");
    const navEl = document.getElementById("navbar-play-target");
    if (heroEl) observer.observe(heroEl);
    if (navEl) observer.observe(navEl);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleMeasure);
      observer.disconnect();
    };
  }, []);

  // contactTarget 0: play only cares hero vs docked-away (nav/contact).
  const syncDockedAway = (latestY: number, direct: number) => {
    if (direct > 0.5) {
      setDockedAway(latestY > AVATAR_MORPH_SCROLL_DISTANCE);
      return;
    }
    const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
    const owner = getProfileDockOwner(latestY, 0, windowH);
    setDockedAway(owner !== "hero");
  };

  useMotionValueEvent(scrollY, "change", (latestY) => {
    syncDockedAway(latestY, activeDirectToHero.get());
  });
  useMotionValueEvent(activeDirectToHero, "change", (direct) => {
    syncDockedAway(scrollY.get(), direct);
  });

  const x = useTransform(
    [progress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 0;
      const p1 = values[0] ?? 0;
      const direct = values[1] ?? 0;
      const latestY = values[2] ?? 0;
      if (direct > 0.5) {
        if (latestY <= 0) return c.heroX;
        const t = Math.min(
          Math.max(latestY / AVATAR_MORPH_SCROLL_DISTANCE, 0),
          1
        );
        const eased = t * t * (3 - 2 * t);
        return c.heroX + (c.navX - c.heroX) * eased;
      }
      if (latestY <= 0) return c.heroX;
      const owner = getProfileDockOwner(latestY, 0, 800);
      if (owner !== "hero") return c.navX;
      const safeP1 = Math.min(Math.max(p1, 0), 1);
      const eased = safeP1 * safeP1 * (3 - 2 * safeP1);
      return c.heroX + (c.navX - c.heroX) * eased;
    }
  );

  const y = useTransform(
    [progress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 0;
      const p1 = values[0] ?? 0;
      const direct = values[1] ?? 0;
      const latestY = values[2] ?? 0;
      if (direct > 0.5) {
        if (latestY <= 0) return c.heroY - latestY;
        const t = Math.min(
          Math.max(latestY / AVATAR_MORPH_SCROLL_DISTANCE, 0),
          1
        );
        const eased = t * t * (3 - 2 * t);
        return c.heroY + (c.navY - c.heroY) * eased;
      }
      if (latestY <= 0) return c.heroY - latestY;
      const owner = getProfileDockOwner(latestY, 0, 800);
      if (owner !== "hero") return c.navY;
      const safeP1 = Math.min(Math.max(p1, 0), 1);
      const eased = safeP1 * safeP1 * (3 - 2 * safeP1);
      return c.heroY + (c.navY - c.heroY) * eased;
    }
  );

  const size = useTransform(
    [progress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 48;
      const p1 = values[0] ?? 0;
      const direct = values[1] ?? 0;
      const latestY = values[2] ?? 0;
      if (direct > 0.5) {
        if (latestY <= 0) return c.heroSize;
        const t = Math.min(
          Math.max(latestY / AVATAR_MORPH_SCROLL_DISTANCE, 0),
          1
        );
        const eased = t * t * (3 - 2 * t);
        return c.heroSize + (c.navSize - c.heroSize) * eased;
      }
      if (latestY <= 0) return c.heroSize;
      const owner = getProfileDockOwner(latestY, 0, 800);
      if (owner !== "hero") return c.navSize;
      const safeP1 = Math.min(Math.max(p1, 0), 1);
      const eased = safeP1 * safeP1 * (3 - 2 * safeP1);
      return c.heroSize + (c.navSize - c.heroSize) * eased;
    }
  );

  const phaseOpacity = useTransform(
    [progress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const p1 = values[0] ?? 0;
      const direct = values[1] ?? 0;
      const latestY = values[2] ?? 0;
      if (direct > 0.5) {
        return latestY <= AVATAR_MORPH_SCROLL_DISTANCE ? 1 : 0;
      }
      const owner = getProfileDockOwner(latestY, 0, 800);
      if (owner !== "hero") return 0;
      const safeP1 = p1 < 0.005 ? 0 : Math.min(Math.max(p1, 0), 1);
      if (safeP1 >= 0.75) {
        return Math.max(0, 1 - (safeP1 - 0.75) / 0.25);
      }
      return 1;
    }
  );

  const phasePointerEvents = useTransform(phaseOpacity, (op) =>
    op > 0.05 ? "auto" : "none"
  );

  if (!hasClip || !isReady || !coords || !portalEl || dockedAway) {
    return null;
  }

  const safeDuration = duration > 0 ? duration : 0;
  const ringProgress = playProgressFraction(currentTime, safeDuration);
  const showProgressRing = isPlaying || currentTime > 0.05;
  const circumference = 2 * Math.PI * HERO_PLAY_RING.radius;
  const dashOffset = circumference * (1 - ringProgress);

  return createPortal(
    <motion.div
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: size,
        height: size,
        zIndex: MORPH_OVER_NAV_Z,
        opacity: phaseOpacity,
        pointerEvents: phasePointerEvents,
      }}
      className="flex items-center justify-center"
      data-page-audio="morph-play"
    >
      <div className="relative inline-flex h-full w-full items-center justify-center">
        <svg
          className={`pointer-events-none absolute inset-0 h-full w-full -rotate-90 ${
            showProgressRing ? "opacity-100" : "opacity-0"
          }`}
          viewBox={`0 0 ${HERO_PLAY_RING.size} ${HERO_PLAY_RING.size}`}
          aria-hidden="true"
          data-page-audio="hero-progress-ring"
        >
          <circle
            cx={HERO_PLAY_RING.size / 2}
            cy={HERO_PLAY_RING.size / 2}
            r={HERO_PLAY_RING.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={HERO_PLAY_RING.stroke}
            className="text-border"
          />
          <circle
            cx={HERO_PLAY_RING.size / 2}
            cy={HERO_PLAY_RING.size / 2}
            r={HERO_PLAY_RING.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={HERO_PLAY_RING.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="text-indigo-dark transition-[stroke-dashoffset] duration-100 ease-linear"
          />
        </svg>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggle();
          }}
          aria-label={pageAudioToggleLabel(clip, isPlaying)}
          data-page-audio="hero-play"
          className="relative z-[1] inline-flex h-[83%] w-[83%] max-h-11 max-w-11 items-center justify-center rounded-full border border-border bg-sand/80 text-indigo-dark shadow-2xs transition-colors hover:bg-sand hover:border-indigo-dark/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-dark/40"
        >
          {isPlaying ? (
            <Pause size={16} className="shrink-0 fill-current" aria-hidden="true" />
          ) : (
            <Play
              size={16}
              className="shrink-0 fill-current ml-0.5"
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </motion.div>,
    portalEl
  );
}
