"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import * as THREE from "three";

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

      coordsRef.current = newCoords;
      setCoords(newCoords);
      setIsReady(true);
    };

    measureCoords();

    window.addEventListener("resize", measureCoords);
    const observer = new ResizeObserver(() => {
      measureCoords();
    });
    observer.observe(document.body);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measureCoords);
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

  // 3. Motion Interpolation for multi-phase position & scale (Hermite smoothstep)
  const x = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 0;
      const p1 = values[0] ?? 0;
      const p2 = values[1] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;

      // When direct-to-hero is active (any scroll up after reaching contact section):
      if (direct > 0.5) {
        if (latestY <= 0) return c.heroX;
        const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
        const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 1);
        const t = Math.min(Math.max(latestY / contactTargetY, 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return c.heroX + (c.contactX - c.heroX) * easedT;
      }

      if (latestY <= 0) return c.heroX;

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const clampedP2 = Math.min(Math.max(p2, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const safeP2 = clampedP2 < 0.005 ? 0 : clampedP2;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      const easedP2 = safeP2 * safeP2 * (3 - 2 * safeP2);

      if (safeP2 > 0) {
        return c.navX + (c.contactX - c.navX) * easedP2;
      } else {
        return c.heroX + (c.navX - c.heroX) * easedP1;
      }
    }
  );

  const y = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 0;
      const p1 = values[0] ?? 0;
      const p2 = values[1] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;

      // When direct-to-hero is active:
      if (direct > 0.5) {
        if (latestY <= 0) return c.heroY - latestY;
        const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
        const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 1);
        const t = Math.min(Math.max(latestY / contactTargetY, 0), 1);
        const easedT = t * t * (3 - 2 * t);
        const contactViewportY = c.contactAbsoluteY - latestY;
        return c.heroY + (contactViewportY - c.heroY) * easedT;
      }

      if (latestY <= 0) return c.heroY - latestY;

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const clampedP2 = Math.min(Math.max(p2, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const safeP2 = clampedP2 < 0.005 ? 0 : clampedP2;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      const easedP2 = safeP2 * safeP2 * (3 - 2 * safeP2);

      if (safeP2 > 0) {
        // While docked or docking in the contact section, match target's viewport position (contactAbsoluteY - scrollY)
        const contactViewportY = c.contactAbsoluteY - latestY;
        return c.navY + (contactViewportY - c.navY) * easedP2;
      } else {
        return c.heroY + (c.navY - c.heroY) * easedP1;
      }
    }
  );

  const size = useTransform(
    [progress, effectiveContactProgress, activeDirectToHero, scrollY],
    (values: number[]) => {
      const c = coordsRef.current;
      if (!c) return 96;
      const p1 = values[0] ?? 0;
      const p2 = values[1] ?? 0;
      const direct = values[2] ?? 0;
      const latestY = values[3] ?? 0;

      // When direct-to-hero is active:
      if (direct > 0.5) {
        if (latestY <= 0) return c.heroSize;
        const windowH = typeof window !== "undefined" ? window.innerHeight : 800;
        const contactTargetY = Math.max(c.contactAbsoluteY - windowH * 0.5, 1);
        const t = Math.min(Math.max(latestY / contactTargetY, 0), 1);
        const easedT = t * t * (3 - 2 * t);
        return c.heroSize + (c.contactSize - c.heroSize) * easedT;
      }

      if (latestY <= 0) return c.heroSize;

      const clampedP1 = Math.min(Math.max(p1, 0), 1);
      const clampedP2 = Math.min(Math.max(p2, 0), 1);
      const safeP1 = clampedP1 < 0.005 ? 0 : clampedP1;
      const safeP2 = clampedP2 < 0.005 ? 0 : clampedP2;
      const easedP1 = safeP1 * safeP1 * (3 - 2 * safeP1);
      const easedP2 = safeP2 * safeP2 * (3 - 2 * safeP2);

      if (safeP2 > 0) {
        return c.navSize + (c.contactSize - c.navSize) * easedP2;
      } else {
        return c.heroSize + (c.navSize - c.heroSize) * easedP1;
      }
    }
  );

  if (!isReady || !coords) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: webglReady ? 1 : 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      style={{
        position: "fixed",
        left: x,
        top: y,
        width: size,
        height: size,
        zIndex: 60,
        pointerEvents: webglReady ? "auto" : "none",
      }}
      className="group cursor-pointer focus:outline-none select-none drop-shadow-md hover:drop-shadow-xl transition-[filter] duration-200"
      onMouseEnter={() => {
        if (!webglReady) return;
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onClick={(e) => {
        if (!webglReady) return;
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
