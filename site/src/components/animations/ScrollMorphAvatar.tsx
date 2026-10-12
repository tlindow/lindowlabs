"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

function subscribePortalRoot() {
  return () => {};
}
function getPortalRoot(): HTMLElement | null {
  return typeof document !== "undefined" ? document.body : null;
}
function getPortalRootServer(): HTMLElement | null {
  return null;
}
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import * as THREE from "three";
import { getProfileDockOwner } from "@/lib/profileDock";

/** Above sticky nav (z-50) during hero→nav transition / dock; page shell stays z-0. */
const MORPH_OVER_NAV_Z = 60;

interface Coords {
  heroX: number;
  heroY: number;
  heroSize: number;
  navX: number;
  navY: number;
  navSize: number;
  contactX: number;
  contactAbsoluteY: number;
  contactSize: number;
}

interface ScrollMorphAvatarProps {
  onReady?: () => void;
  progress?: MotionValue<number>;
  contactProgress?: MotionValue<number>;
  directToHero?: MotionValue<number>;
  onReturnToHero?: () => void;
  /**
   * Keep the morph off the Let's talk slot (Footer owns a plain static photo).
   * Default true on every dock leaf; pass false only for experimental parking.
   */
  hideAtContact?: boolean;
}

/**
 * Creates a subtle milled coin edge normal texture.
 */
function createMilledRimTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, 512, 32);
    for (let x = 0; x < 512; x += 4) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, 0, 2, 32);
      ctx.fillStyle = "#404040";
      ctx.fillRect(x + 2, 0, 2, 32);
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.repeat.set(4, 1);
  return texture;
}

/**
 * Distance in pixels that the profile avatar morphs from its hero anchor position
 * to the docked top navbar slot.
 */
export const AVATAR_MORPH_SCROLL_DISTANCE = 240;
export const HERO_PIN_SCROLL_DISTANCE = AVATAR_MORPH_SCROLL_DISTANCE;

export default function ScrollMorphAvatar({
  onReady,
  progress: customProgress,
  contactProgress: customContactProgress,
  directToHero: customDirectToHero,
  onReturnToHero,
  hideAtContact = true,
}: ScrollMorphAvatarProps) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const coordsRef = useRef<Coords | null>(null);
  const hideAtContactRef = useRef(hideAtContact);
  const [isReady, setIsReady] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  /**
   * Homepage (hideAtContact): tear down the Three.js context once nav or
   * Let's talk owns the photo so #contact has zero live WebGL contexts.
   * Recreate only while the hero owns the morph.
   */
  const [allowWebgl, setAllowWebgl] = useState(true);
  // Plain React display (not a MotionValue): framer can skip applying
  // style.display from useTransform, which left a compositor sliver under nav.
  const [navDockHidden, setNavDockHidden] = useState(false);
  // Portal to document.body so morph stacks over sticky nav (z-50).
  const portalEl = useSyncExternalStore(
    subscribePortalRoot,
    getPortalRoot,
    getPortalRootServer
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const clickImpulseRef = useRef(0);
  const viewportHRef = useRef(
    typeof window !== "undefined" ? window.innerHeight : 800
  );
  const dockHiddenRafRef = useRef(0);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

  const setNavDockHiddenThrottled = (hidden: boolean) => {
    if (dockHiddenRafRef.current) cancelAnimationFrame(dockHiddenRafRef.current);
    dockHiddenRafRef.current = requestAnimationFrame(() => {
      dockHiddenRafRef.current = 0;
      setNavDockHidden((prev) => (prev === hidden ? prev : hidden));
    });
  };

  useEffect(() => {
    hideAtContactRef.current = hideAtContact;
  }, [hideAtContact]);

  // Fallback internal scroll progress if customProgress is not passed
  const { scrollY } = useScroll();
  const internalRawProgress = useTransform(scrollY, [0, HERO_PIN_SCROLL_DISTANCE], [0, 1], { clamp: true });
  const internalSpring = useSpring(internalRawProgress, { stiffness: 220, damping: 24, mass: 0.4 });
  const progress = customProgress || internalSpring;

  const fallbackContactProgress = useTransform(scrollY, () => 0);
  const effectiveContactProgress = customContactProgress || fallbackContactProgress;

  const fallbackDirectToHero = useTransform(scrollY, () => 0);
  const activeDirectToHero = customDirectToHero || fallbackDirectToHero;

  // 1. Measure coordinates across Hero Anchor, Navbar Target, and Contact Target
  useEffect(() => {
    let rafId: number;

    const measureCoords = () => {
      const heroEl = document.getElementById("hero-avatar-anchor");
      const navEl = document.getElementById("navbar-avatar-target");
      const contactEl = document.getElementById("contact-avatar-target");

      if (!heroEl || !navEl || !contactEl) {
        rafId = requestAnimationFrame(measureCoords);
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      const contactRect = contactEl.getBoundingClientRect();
      const currentScrollY = window.scrollY;

      // Reconstruct initial hero viewport Y (as if scrollY was 0)
      const initialHeroY = heroRect.top + currentScrollY;
      const initialHeroX = heroRect.left;

      // Absolute document Y position of contact target
      const contactAbsoluteY = contactRect.top + currentScrollY;

      const newCoords: Coords = {
        heroX: initialHeroX,
        heroY: initialHeroY,
        heroSize: heroRect.width,
        navX: navRect.left,
        navY: navRect.top,
        navSize: navRect.width,
        contactX: contactRect.left,
        contactAbsoluteY,
        contactSize: contactRect.width,
      };

      const prev = coordsRef.current;
      const unchanged =
        prev &&
        prev.heroX === newCoords.heroX &&
        prev.heroY === newCoords.heroY &&
        prev.heroSize === newCoords.heroSize &&
        prev.navX === newCoords.navX &&
        prev.navY === newCoords.navY &&
        prev.navSize === newCoords.navSize &&
        prev.contactX === newCoords.contactX &&
        prev.contactAbsoluteY === newCoords.contactAbsoluteY &&
        prev.contactSize === newCoords.contactSize;

      coordsRef.current = newCoords;
      if (!unchanged) {
        setCoords(newCoords);
      }
      setIsReady(true);

      // Initial dock sync (hard refresh mid-page / at Let's talk).
      if (hideAtContactRef.current) {
        const windowH = viewportHRef.current;
        const contactTarget = Math.max(
          newCoords.contactAbsoluteY - windowH * 0.5,
          0
        );
        const owner = getProfileDockOwner(
          currentScrollY,
          contactTarget,
          windowH
        );
        setAllowWebgl(owner === "hero");
        setNavDockHiddenThrottled(owner === "nav" || owner === "contact");
      }
    };

    // rAF-throttle ResizeObserver so body size chatter during scroll does not
    // force layout + React state on every frame of the nav ↔ contact handoff.
    let measureScheduled = false;
    const scheduleMeasure = () => {
      if (measureScheduled) return;
      measureScheduled = true;
      rafId = requestAnimationFrame(() => {
        measureScheduled = false;
        measureCoords();
      });
    };

    measureCoords();
    viewportHRef.current =
      typeof window !== "undefined" ? window.innerHeight : 800;

    const onResize = () => {
      viewportHRef.current = window.innerHeight;
      scheduleMeasure();
    };
    window.addEventListener("resize", onResize, { passive: true });
    // Observe only anchor nodes — not document.body (scroll/spacer thrash).
    const observer = new ResizeObserver(scheduleMeasure);
    const heroEl = document.getElementById("hero-avatar-anchor");
    const navEl = document.getElementById("navbar-avatar-target");
    const contactEl = document.getElementById("contact-avatar-target");
    if (heroEl) observer.observe(heroEl);
    if (navEl) observer.observe(navEl);
    if (contactEl) observer.observe(contactEl);

    return () => {
      cancelAnimationFrame(rafId);
      if (dockHiddenRafRef.current) {
        cancelAnimationFrame(dockHiddenRafRef.current);
        dockHiddenRafRef.current = 0;
      }
      window.removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [onReady]);


  // 2. Three.js WebGL Profile Coin Setup
  useEffect(() => {
    if (!isReady || !portalEl || !allowWebgl || !canvasContainerRef.current) {
      return;
    }
    const container = canvasContainerRef.current;

    const size = 384; // Crisp texture resolution

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(4, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight2.position.set(-4, -3, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.4, 10);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    // Materials & Textures
    const rimBump = createMilledRimTexture();

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5dfd5, // Elegant warm gold/sand coin edge
      metalness: 0.85,
      roughness: 0.3,
      bumpMap: rimBump,
      bumpScale: 0.04,
    });

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const frontCanvas = document.createElement("canvas");
    frontCanvas.width = 1024;
    frontCanvas.height = 1024;
    const frontTexture = new THREE.CanvasTexture(frontCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;
    frontTexture.anisotropy = maxAnisotropy;

    const backCanvas = document.createElement("canvas");
    backCanvas.width = 1024;
    backCanvas.height = 1024;
    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;
    backTexture.anisotropy = maxAnisotropy;

    const frontMaterial = new THREE.MeshStandardMaterial({
      map: frontTexture,
      metalness: 0.2,
      roughness: 0.35,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      map: backTexture,
      metalness: 0.2,
      roughness: 0.35,
    });

    // 3D Coin Cylinder Geometry
    const coinGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.22, 64);
    coinGeometry.rotateX(Math.PI / 2); // Orient front face towards camera

    const coinMesh = new THREE.Mesh(coinGeometry, [
      rimMaterial,
      frontMaterial,
      backMaterial,
    ]);
    scene.add(coinMesh);

    let lastScrollProgress = -1;
    let isDisposed = false;

    // Load Profile Image Texture
    const img = new Image();
    const handleImageLoad = () => {
      if (isDisposed) return;
      const sw = img.naturalWidth || img.width;
      const sh = img.naturalHeight || img.height;
      if (!sw || !sh) return;
      const cropSize = Math.min(sw, sh);
      const sx = (sw - cropSize) / 2;
      const sy = Math.max(0, Math.min(sh - cropSize, (sh - cropSize) * 0.2));

      // Draw Front Face (1024x1024 High-DPI Texture)
      const fCtx = frontCanvas.getContext("2d");
      if (fCtx) {
        fCtx.fillStyle = "#FFFDF7";
        fCtx.fillRect(0, 0, 1024, 1024);

        fCtx.save();
        fCtx.beginPath();
        fCtx.arc(512, 512, 504, 0, Math.PI * 2);
        fCtx.clip();

        // Rotate counterclockwise 90 degrees so image is upright on Three.js cap
        fCtx.translate(512, 512);
        fCtx.rotate(-Math.PI / 2);
        fCtx.drawImage(img, sx, sy, cropSize, cropSize, -512, -512, 1024, 1024);
        fCtx.restore();

        // Subtle minted inner coin ring
        fCtx.beginPath();
        fCtx.arc(512, 512, 500, 0, Math.PI * 2);
        fCtx.strokeStyle = "#E6E2D8";
        fCtx.lineWidth = 8;
        fCtx.stroke();

        frontTexture.needsUpdate = true;
      }

      // Draw Back Face: empty dotted-circle placeholder (not a second photo)
      const bCtx = backCanvas.getContext("2d");
      if (bCtx) {
        bCtx.clearRect(0, 0, 1024, 1024);
        bCtx.fillStyle = "#FFFDF7";
        bCtx.beginPath();
        bCtx.arc(512, 512, 504, 0, Math.PI * 2);
        bCtx.fill();

        // Dotted ring — same size as the front coin face, reserved empty slot
        bCtx.beginPath();
        bCtx.arc(512, 512, 460, 0, Math.PI * 2);
        bCtx.strokeStyle = "#B8B2A6";
        bCtx.lineWidth = 18;
        bCtx.setLineDash([28, 22]);
        bCtx.lineCap = "round";
        bCtx.stroke();
        bCtx.setLineDash([]);

        backTexture.needsUpdate = true;
      }

      // Render the first complete, textured frame immediately
      renderer.render(scene, camera);
      setWebglReady(true);
      if (onReady) {
        onReady();
      }

      lastScrollProgress = -1;
    };

    img.onload = handleImageLoad;
    img.src = `${basePath}/IMG_0548.jpeg`;
    if (img.complete && img.naturalWidth > 0) {
      handleImageLoad();
    }

    // Hero→nav: one full flip synced to the same progress as the play morph.
    // Nav→Let's talk flip only when the morph still parks at contact (retreat).
    let animationFrameId: number;
    let hoverSpin = 0;

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      const rawProgress = Math.min(Math.max(progress.get(), 0), 1);
      const rawContact = Math.min(Math.max(effectiveContactProgress.get(), 0), 1);
      const direct = activeDirectToHero.get();
      const isHovered = isHoveredRef.current;
      const hasClick = clickImpulseRef.current > 0.001;
      const staticContact = hideAtContactRef.current;

      const c = coordsRef.current;
      const currentScrollY = scrollY.get();
      const windowH = viewportHRef.current;
      const contactTargetY = c
        ? Math.max(c.contactAbsoluteY - windowH * 0.5, 0)
        : 0;

      const owner =
        direct > 0.5
          ? null
          : getProfileDockOwner(currentScrollY, contactTargetY, windowH);

      // Every frame: while nav owns the photo (or homepage Let's talk owns a
      // static img), take the morph out of the paint tree.
      const paintHidden =
        owner === "nav" ||
        (staticContact && owner === "contact") ||
        (staticContact && direct > 0.5 && currentScrollY > 40);
      if (paintHidden) {
        if (rootRef.current) rootRef.current.style.display = "none";
        renderer.domElement.style.visibility = "hidden";
        renderer.domElement.style.opacity = "0";
        renderer.domElement.style.display = "none";
        lastScrollProgress = -1;
        return;
      }

      if (rootRef.current) rootRef.current.style.display = "block";
      renderer.domElement.style.display = "block";
      renderer.domElement.style.visibility = "visible";
      renderer.domElement.style.opacity = "1";

      const metric =
        direct > 0.5
          ? currentScrollY
          : owner === "contact"
            ? rawContact
            : rawProgress;
      if (
        Math.abs(metric - lastScrollProgress) > 0.0001 ||
        isHovered ||
        hasClick ||
        hoverSpin > 0.001
      ) {
        lastScrollProgress = metric;

        if (isHovered) {
          hoverSpin += 0.032;
        } else if (hoverSpin > 0) {
          hoverSpin *= 0.92;
        }

        if (hasClick) {
          clickImpulseRef.current *= 0.92;
        }

        const hoverTilt = isHovered ? 0.15 : 0;

        if (
          !staticContact &&
          (owner === "contact" || (direct > 0.5 && rawContact > 0.001))
        ) {
          // Nav → Let's talk (and contact leg of click-to-hero): one full flip.
          const easedC = rawContact * rawContact * (3 - 2 * rawContact);
          coinMesh.rotation.y =
            easedC * Math.PI * 2 + hoverSpin + clickImpulseRef.current;
          coinMesh.rotation.x =
            Math.sin(easedC * Math.PI) * 0.28 + hoverTilt;
        } else {
          // Hero → nav: flip in sync with play's move/scale (same progress).
          const easedP1 = rawProgress * rawProgress * (3 - 2 * rawProgress);
          coinMesh.rotation.y =
            easedP1 * Math.PI * 2 + hoverSpin + clickImpulseRef.current;
          coinMesh.rotation.x =
            Math.sin(easedP1 * Math.PI) * 0.28 + hoverTilt;
        }

        renderer.render(scene, camera);
      }
    };

    renderLoop();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coinGeometry.dispose();
      rimMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      rimBump.dispose();
      // Drop the GL context (not only hide the canvas) so Let's talk has none.
      renderer.forceContextLoss();
      renderer.dispose();
      setWebglReady(false);
    };
  }, [
    isReady,
    portalEl,
    allowWebgl,
    basePath,
    onReady,
    progress,
    effectiveContactProgress,
    activeDirectToHero,
    scrollY,
  ]);

  // Pixel-round to cut subpixel jitter while pinned at Let's talk / nav.
  const px = (n: number) => Math.round(n);

  const morphPaintHiddenForOwner = (
    owner: ReturnType<typeof getProfileDockOwner>
  ) => owner === "nav" || (hideAtContactRef.current && owner === "contact");

  // 3. Motion Interpolation for position & scale.
  // Hero → nav morphs along a path (WebGL flip uses the same progress). When
  // hideAtContact is false, nav ↔ Let's talk snaps to the contact slot. When
  // true (homepage), the morph stays out of the paint tree at contact.
  const x = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 0;
      const p1 = values[0] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;
      const windowH = viewportHRef.current;
      const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 0);
      const staticContact = hideAtContactRef.current;

      // Click-to-hero: homepage skips the contact→hero flight; retreat keeps it.
      if (direct > 0.5) {
        if (staticContact || latestY <= 0) return px(c.heroX);
        const t = Math.min(Math.max(latestY / Math.max(contactTargetY, 1), 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return px(c.heroX + (c.contactX - c.heroX) * easedT);
      }

      if (latestY <= 0) return px(c.heroX);

      const owner = getProfileDockOwner(latestY, contactTargetY, windowH);
      if (owner === "contact" && !staticContact) return px(c.contactX);
      // Park exactly on the nav slot while docked (spring p1 can lag and leave
      // an oversized box hanging below the sticky bar).
      if (owner === "nav" || owner === "contact") return px(c.navX);

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      return px(c.heroX + (c.navX - c.heroX) * easedP1);
    }
  );

  const y = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 0;
      const p1 = values[0] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;
      const windowH = viewportHRef.current;
      const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 0);
      const contactViewportY = c.contactAbsoluteY - latestY;

      const staticContact = hideAtContactRef.current;
      if (direct > 0.5) {
        if (staticContact || latestY <= 0) return px(c.heroY - latestY);
        const t = Math.min(Math.max(latestY / Math.max(contactTargetY, 1), 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return px(c.heroY + (contactViewportY - c.heroY) * easedT);
      }

      if (latestY <= 0) return px(c.heroY - latestY);

      const owner = getProfileDockOwner(latestY, contactTargetY, windowH);
      if (owner === "contact" && !staticContact) return px(contactViewportY);
      if (owner === "nav" || owner === "contact") return px(c.navY);

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      return px(c.heroY + (c.navY - c.heroY) * easedP1);
    }
  );

  const size = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 96;
      const p1 = values[0] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;
      const windowH = viewportHRef.current;
      const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 0);

      const staticContact = hideAtContactRef.current;
      if (direct > 0.5) {
        if (staticContact || latestY <= 0) return px(c.heroSize);
        const t = Math.min(Math.max(latestY / Math.max(contactTargetY, 1), 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return px(c.heroSize + (c.contactSize - c.heroSize) * easedT);
      }

      if (latestY <= 0) return px(c.heroSize);

      const owner = getProfileDockOwner(latestY, contactTargetY, windowH);
      if (owner === "contact" && !staticContact) return px(c.contactSize);
      if (owner === "nav" || owner === "contact") return px(c.navSize);

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      return px(c.heroSize + (c.navSize - c.heroSize) * easedP1);
    }
  );

  // In-nav photo owns the docked slot. Homepage Let's talk owns a static img.
  // Visibility/opacity alone still left a WebGL/compositor sliver under the
  // sticky bar — use display:none while those owners are active.
  const phaseOpacity = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const p1 = values[0] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;
      const staticContact = hideAtContactRef.current;
      if (direct > 0.5) {
        // Homepage: no contact→hero flight; reappear only near the top.
        if (staticContact) return latestY <= 40 ? 1 : 0;
        return 1;
      }

      const c = coordsRef.current;
      const windowH = viewportHRef.current;
      const contactTarget =
        c != null ? Math.max(c.contactAbsoluteY - windowH * 0.5, 0) : 0;
      const owner = getProfileDockOwner(latestY, contactTarget, windowH);

      if (morphPaintHiddenForOwner(owner)) return 0;
      if (owner === "contact") return 1;

      // Hero: fade out over the last stretch of hero → nav morph.
      const safeP1 = p1 < 0.005 ? 0 : Math.min(Math.max(p1, 0), 1);
      if (safeP1 >= 0.75) {
        return Math.max(0, 1 - (safeP1 - 0.75) / 0.25);
      }
      return 1;
    }
  );

  const phaseVisibility = useTransform(
    [activeDirectToHero, scrollY],
    (values: number[]) => {
      const direct = values[0] ?? 0;
      const latestY = values[1] ?? 0;
      const staticContact = hideAtContactRef.current;
      if (direct > 0.5) {
        if (staticContact && latestY > 40) return "hidden";
        return "visible";
      }
      const c = coordsRef.current;
      const windowH = viewportHRef.current;
      const contactTarget =
        c != null ? Math.max(c.contactAbsoluteY - windowH * 0.5, 0) : 0;
      const owner = getProfileDockOwner(latestY, contactTarget, windowH);
      return morphPaintHiddenForOwner(owner) ? "hidden" : "visible";
    }
  );

  const syncDockPaint = (latestY: number, direct: number) => {
    const staticContact = hideAtContactRef.current;
    if (direct > 0.5) {
      const nearHero = latestY <= 40;
      setNavDockHiddenThrottled(staticContact ? !nearHero : false);
      if (staticContact) setAllowWebgl(nearHero);
      return;
    }
    const c = coordsRef.current;
    const windowH = viewportHRef.current;
    const contactTarget =
      c != null ? Math.max(c.contactAbsoluteY - windowH * 0.5, 0) : 0;
    const owner = getProfileDockOwner(latestY, contactTarget, windowH);
    setNavDockHiddenThrottled(morphPaintHiddenForOwner(owner));
    // Homepage: only keep a GL context while the hero owns the morph.
    if (staticContact) setAllowWebgl(owner === "hero");
  };

  // Keep React display + WebGL mount in sync with scroll owner.
  useMotionValueEvent(scrollY, "change", (latestY) => {
    syncDockPaint(latestY, activeDirectToHero.get());
  });
  useMotionValueEvent(activeDirectToHero, "change", (direct) => {
    syncDockPaint(scrollY.get(), direct);
  });

  // Drop-shadow only on hero (filter thrash jitters Let's talk while scrolling).
  const phaseFilter = useTransform(
    [phaseOpacity, activeDirectToHero, scrollY],
    (values: number[]) => {
      const op = values[0] ?? 0;
      const direct = values[1] ?? 0;
      const latestY = values[2] ?? 0;
      if (op <= 0.05) return "none";
      if (direct > 0.5) return "none";
      const c = coordsRef.current;
      const windowH = viewportHRef.current;
      const contactTarget =
        c != null ? Math.max(c.contactAbsoluteY - windowH * 0.5, 0) : 0;
      const owner = getProfileDockOwner(latestY, contactTarget, windowH);
      if (owner === "contact") return "none";
      return "drop-shadow(0 4px 6px rgb(0 0 0 / 0.15))";
    }
  );

  const phasePointerEvents = useTransform(phaseOpacity, (op) =>
    op > 0.05 ? "auto" : "none"
  );

  if (!isReady || !coords || !portalEl) {
    return null;
  }

  return createPortal(
    <motion.div
      ref={rootRef}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        // GPU path: translate instead of left/top layout writes every scroll frame.
        x,
        y,
        width: size,
        height: size,
        // Over sticky nav during transition + dock approach (nav img takes over
        // when owner===nav and this node is display:none).
        zIndex: MORPH_OVER_NAV_Z,
        opacity: webglReady ? phaseOpacity : 0,
        visibility: phaseVisibility,
        display: navDockHidden ? "none" : "block",
        filter: phaseFilter,
        pointerEvents: phasePointerEvents,
        overflow: "hidden",
        willChange: "transform",
      }}
      className="group cursor-pointer focus:outline-none select-none"
      data-profile-photo="morph"
      onMouseEnter={() => {
        if (!webglReady || phaseOpacity.get() < 0.05) return;
        if (phaseVisibility.get() === "hidden") return;
        if (navDockHidden) return;
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onClick={(e) => {
        if (!webglReady || phaseOpacity.get() < 0.05) return;
        if (phaseVisibility.get() === "hidden") return;
        if (navDockHidden) return;
        e.preventDefault();
        clickImpulseRef.current = Math.PI * 2;
        if (onReturnToHero) {
          onReturnToHero();
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      title="Tyler Lindow - Back to top"
      aria-label="Tyler Lindow profile coin - Back to top"
    >
      <div
        ref={canvasContainerRef}
        className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      />
    </motion.div>,
    portalEl
  );
}
