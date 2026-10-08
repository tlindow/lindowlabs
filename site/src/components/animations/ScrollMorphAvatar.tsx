"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import * as THREE from "three";
import { getProfileDockOwner } from "@/lib/profileDock";

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
}: ScrollMorphAvatarProps) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const coordsRef = useRef<Coords | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const clickImpulseRef = useRef(0);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

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

    window.addEventListener("resize", scheduleMeasure, { passive: true });
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(document.body);
    const navEl = document.getElementById("navbar-avatar-target");
    const contactEl = document.getElementById("contact-avatar-target");
    if (navEl) observer.observe(navEl);
    if (contactEl) observer.observe(contactEl);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", scheduleMeasure);
      observer.disconnect();
    };
  }, [onReady]);


  // 2. Three.js WebGL Profile Coin Setup
  useEffect(() => {
    if (!isReady || !canvasContainerRef.current) return;
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

    // Animation Loop: Coin rotates during hero->nav (Phase 1) and nav->contact (Phase 2), or on hover/click
    let animationFrameId: number;
    let hoverSpin = 0;

    const renderLoop = () => {
      animationFrameId = requestAnimationFrame(renderLoop);

      // Phase 1: progress from 0 (hero anchor) to 1 (navbar)
      const rawProgress = Math.min(Math.max(progress.get(), 0), 1);
      // Phase 2: progress from 0 (navbar) to 1 (contact slot)
      const rawContact = Math.min(Math.max(effectiveContactProgress.get(), 0), 1);
      const direct = activeDirectToHero.get();
      const isHovered = isHoveredRef.current;
      const hasClick = clickImpulseRef.current > 0.001;

      const c = coordsRef.current;
      const currentScrollY = scrollY.get();
      const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
      const contactTargetY = c ? Math.max(c.contactAbsoluteY - windowH * 0.5, 1) : 1000;
      const quickT = Math.min(Math.max(currentScrollY / contactTargetY, 0), 1);

      const metric = direct > 0.5 ? quickT : (rawProgress + rawContact);
      if (
        Math.abs(metric - lastScrollProgress) > 0.0001 ||
        isHovered ||
        hasClick ||
        hoverSpin > 0.001
      ) {
        lastScrollProgress = metric;

        // Hover spin accumulation
        if (isHovered) {
          hoverSpin += 0.032;
        } else if (hoverSpin > 0) {
          hoverSpin *= 0.92;
        }

        if (hasClick) {
          clickImpulseRef.current *= 0.92;
        }

        if (direct > 0.5) {
          // Direct rotation and tilt as coin travels straight to top center hero
          const easedT = quickT * quickT * (3 - 2 * quickT);
          coinMesh.rotation.y = (1 + easedT) * Math.PI * 2 + hoverSpin + clickImpulseRef.current;
          const transitTilt = Math.sin(easedT * Math.PI) * 0.28;
          const hoverTilt = isHovered ? 0.15 : 0;
          coinMesh.rotation.x = transitTilt + hoverTilt;
        } else {
          // Smooth Hermite smoothstep easing for graceful departure and soft docking
          const easedP1 = rawProgress * rawProgress * (3 - 2 * rawProgress);
          const easedP2 = rawContact * rawContact * (3 - 2 * rawContact);

          // Full 360-degree rotation during Phase 1 (0 -> 2*PI)
          // Another full 360-degree rotation during Phase 2 (2*PI -> 4*PI)
          coinMesh.rotation.y = (easedP1 + easedP2) * Math.PI * 2 + hoverSpin + clickImpulseRef.current;

          // Subtle 3D tilt exposing the metallic milled edge during transit
          const transitTilt = (Math.sin(easedP1 * Math.PI) * (1 - rawContact) + Math.sin(easedP2 * Math.PI)) * 0.28;
          const hoverTilt = isHovered ? 0.15 : 0;
          coinMesh.rotation.x = transitTilt + hoverTilt;
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
      renderer.dispose();
    };
  }, [isReady, basePath, onReady, progress, effectiveContactProgress, activeDirectToHero, scrollY]);

  // 3. Motion Interpolation for position & scale.
  // Hero → nav still morphs along a path. Nav ↔ Let's talk is an in-place
  // crossfade only: when contact owns the photo the coin snaps to the contact
  // slot (never lerps across body text — that was the flying-coin catch).
  const x = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 0;
      const p1 = values[0] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;
      const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
      const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 0);

      // Click-to-hero only: intentional long flight.
      if (direct > 0.5) {
        if (latestY <= 0) return c.heroX;
        const t = Math.min(Math.max(latestY / Math.max(contactTargetY, 1), 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return c.heroX + (c.contactX - c.heroX) * easedT;
      }

      if (latestY <= 0) return c.heroX;

      const owner = getProfileDockOwner(latestY, contactTargetY, windowH);
      // Snap to Let's talk — no mid-page flight.
      if (owner === "contact") return c.contactX;

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      return c.heroX + (c.navX - c.heroX) * easedP1;
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
      const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
      const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 0);
      const contactViewportY = c.contactAbsoluteY - latestY;

      if (direct > 0.5) {
        if (latestY <= 0) return c.heroY - latestY;
        const t = Math.min(Math.max(latestY / Math.max(contactTargetY, 1), 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return c.heroY + (contactViewportY - c.heroY) * easedT;
      }

      if (latestY <= 0) return c.heroY - latestY;

      const owner = getProfileDockOwner(latestY, contactTargetY, windowH);
      if (owner === "contact") return contactViewportY;

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      return c.heroY + (c.navY - c.heroY) * easedP1;
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
      const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
      const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 0);

      if (direct > 0.5) {
        if (latestY <= 0) return c.heroSize;
        const t = Math.min(Math.max(latestY / Math.max(contactTargetY, 1), 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return c.heroSize + (c.contactSize - c.heroSize) * easedT;
      }

      if (latestY <= 0) return c.heroSize;

      const owner = getProfileDockOwner(latestY, contactTargetY, windowH);
      if (owner === "contact") return c.contactSize;

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      return c.heroSize + (c.navSize - c.heroSize) * easedP1;
    }
  );

  // In-nav photo (NavPageAudioPlayer) owns the docked slot. Opacity follows
  // scroll-derived dock ownership (not spring progress alone) so spring lag on
  // scroll-up cannot leave the coin visible beside the nav img.
  // Stay at z-40 under the sticky Navbar (z-50) so contact/hero never cover it.
  const phaseOpacity = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const p1 = values[0] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;
      if (direct > 0.5) return 1;

      const c = coordsRef.current;
      const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
      const contactTarget =
        c != null ? Math.max(c.contactAbsoluteY - windowH * 0.5, 0) : 0;
      const owner = getProfileDockOwner(latestY, contactTarget, windowH);

      // Exclusive with the nav img while scroll says the morph is docked there.
      if (owner === "nav") return 0;
      if (owner === "contact") return 1;

      // Hero: fade out over the last stretch of hero → nav morph.
      const safeP1 = p1 < 0.005 ? 0 : Math.min(Math.max(p1, 0), 1);
      if (safeP1 >= 0.75) {
        return Math.max(0, 1 - (safeP1 - 0.75) / 0.25);
      }
      return 1;
    }
  );

  // Above sticky Navbar (z-50) while contact owns the photo so the coin is
  // not trapped under the bar after the nav img hides. Otherwise stay at 40.
  const phaseZIndex = useTransform(
    [activeDirectToHero, scrollY],
    (values: number[]) => {
      const direct = values[0] ?? 0;
      const latestY = values[1] ?? 0;
      if (direct > 0.5) return 40;
      const c = coordsRef.current;
      const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
      const contactTarget =
        c != null ? Math.max(c.contactAbsoluteY - windowH * 0.5, 0) : 0;
      const owner = getProfileDockOwner(latestY, contactTarget, windowH);
      return owner === "contact" ? 60 : 40;
    }
  );

  if (!isReady || !coords) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: size,
        height: size,
        zIndex: phaseZIndex,
        opacity: webglReady ? phaseOpacity : 0,
      }}
      className="group cursor-pointer focus:outline-none select-none drop-shadow-md hover:drop-shadow-xl transition-[filter] duration-200"
      data-profile-photo="morph"
      onMouseEnter={() => {
        if (!webglReady || phaseOpacity.get() < 0.05) return;
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onClick={(e) => {
        if (!webglReady || phaseOpacity.get() < 0.05) return;
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
      {/* 3D WebGL Coin Canvas Container */}
      <div
        ref={canvasContainerRef}
        className="w-full h-full flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
      />
    </motion.div>
  );
}
