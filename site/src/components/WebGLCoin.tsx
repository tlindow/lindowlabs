"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";

export type WebGLCoinType = "tinker" | "github" | "beginner" | "affirm";

interface WebGLCoinProps {
  type: WebGLCoinType;
  href: string;
  title: string;
  className?: string;
}

const TINKER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="15 15 170 170" width="512" height="512">
  <circle cx="100" cy="100" r="85" fill="#FFFDF7"/>
  <circle cx="100" cy="100" r="76" fill="none" stroke="#C8B6E2" stroke-width="10"/>
  <line x1="24.06" y1="62" x2="175.94" y2="62" stroke="#F9A8D4" stroke-width="10" stroke-linecap="round"/>
  <line x1="24" y1="100" x2="176" y2="100" stroke="#FDBA74" stroke-width="10" stroke-linecap="round"/>
  <line x1="24.06" y1="138" x2="175.94" y2="138" stroke="#FDE68A" stroke-width="10" stroke-linecap="round"/>
  <ellipse cx="100" cy="100" rx="52" ry="76" fill="none" stroke="#7BC47A" stroke-width="10"/>
  <ellipse cx="100" cy="100" rx="26" ry="76" fill="none" stroke="#7DD3FC" stroke-width="10"/>
  <line x1="100" y1="24" x2="100" y2="176" stroke="#6EE7B7" stroke-width="10" stroke-linecap="round"/>
  <circle cx="100" cy="100" r="83" fill="none" stroke="#E6E2D8" stroke-width="2.5"/>
</svg>
`;

const GITHUB_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="-6 -6 110 108" width="512" height="512">
  <circle cx="49" cy="48" r="54" fill="#FFFFFF"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.36 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="#24292F"/>
  <circle cx="49" cy="48" r="53" fill="none" stroke="#D0D7DE" stroke-width="2.5"/>
</svg>
`;

/** Green circular Beginner disc with white seed glyph (fills the coin face). */
const BEGINNER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="512" height="512">
  <circle cx="90" cy="90" r="90" fill="#2d5a3d"/>
  <path d="M68 38 L68 138" stroke="#f5f3ef" stroke-width="10.5" stroke-linecap="round"/>
  <path d="M68 82 C68 68, 82 58, 100 58 C122 58, 132 72, 132 90 C132 108, 122 122, 100 122 C82 122, 68 112, 68 98Z" stroke="#f5f3ef" stroke-width="10.5" fill="none" stroke-linejoin="round"/>
  <path d="M68 56 C66 44, 78 34, 92 38 C88 44, 74 50, 68 56Z" fill="#7bc47a"/>
  <path d="M68 48 C67 42, 60 38, 54 40 C56 44, 64 47, 68 48Z" fill="#5aad58" opacity="0.7"/>
</svg>
`;

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

function faceSvgForType(type: WebGLCoinType): string | null {
  if (type === "tinker") return TINKER_SVG;
  if (type === "github") return GITHUB_SVG;
  if (type === "beginner") return BEGINNER_SVG;
  return null;
}

function rimColorForType(type: WebGLCoinType): number {
  if (type === "tinker") return 0xe6dfd5;
  if (type === "beginner") return 0xd4e0d4;
  if (type === "affirm") return 0xd8dde3;
  return 0xd8dde3;
}

export default function WebGLCoin({
  type,
  href,
  title,
  className = "w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48",
}: WebGLCoinProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isHoveredRef = useRef(false);
  const clickImpulseRef = useRef(0);
  const isInMiddleRef = useRef(false);
  const isMobileRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 180;
    const height = container.clientHeight || 180;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

    const checkIsMobile = () => {
      if (typeof window === "undefined") return false;
      return (
        window.innerWidth < 768 ||
        window.matchMedia("(hover: none), (pointer: coarse)").matches
      );
    };

    const checkViewportPosition = () => {
      if (!containerRef.current) return;
      const isMobile = checkIsMobile();
      isMobileRef.current = isMobile;

      if (!isMobile) {
        isInMiddleRef.current = false;
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const coinCenterY = rect.top + rect.height / 2;

      isInMiddleRef.current = coinCenterY >= vh * 0.35 && coinCenterY <= vh * 0.65;
    };

    checkViewportPosition();
    window.addEventListener("scroll", checkViewportPosition, { passive: true });
    window.addEventListener("resize", checkViewportPosition, { passive: true });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(4, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight2.position.set(-4, -3, -4);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    pointLight.position.set(0, 2, 4);
    scene.add(pointLight);

    const img = new Image();
    img.crossOrigin = "anonymous";
    let objectUrl: string | null = null;

    const coinCanvas = document.createElement("canvas");
    coinCanvas.width = 512;
    coinCanvas.height = 512;
    const coinCtx = coinCanvas.getContext("2d");

    const frontTexture = new THREE.CanvasTexture(coinCanvas);
    frontTexture.colorSpace = THREE.SRGBColorSpace;

    const backCanvas = document.createElement("canvas");
    backCanvas.width = 512;
    backCanvas.height = 512;
    const backTexture = new THREE.CanvasTexture(backCanvas);
    backTexture.colorSpace = THREE.SRGBColorSpace;

    let needsInitialRender = true;

    const paintFace = (source: CanvasImageSource, padded = false) => {
      const drawOnto = (ctx: CanvasRenderingContext2D) => {
        ctx.clearRect(0, 0, 512, 512);
        ctx.fillStyle = "#FFFDF7";
        ctx.beginPath();
        ctx.arc(256, 256, 250, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.translate(256, 256);
        ctx.rotate(-Math.PI / 2);
        if (padded) {
          ctx.drawImage(source, -200, -80, 400, 160);
        } else {
          ctx.drawImage(source, -256, -256, 512, 512);
        }
        ctx.restore();
        ctx.strokeStyle = "#E6E2D8";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(256, 256, 248, 0, Math.PI * 2);
        ctx.stroke();
      };

      if (coinCtx) {
        drawOnto(coinCtx);
        frontTexture.needsUpdate = true;
      }
      const bCtx = backCanvas.getContext("2d");
      if (bCtx) {
        drawOnto(bCtx);
        backTexture.needsUpdate = true;
      }
      needsInitialRender = true;
    };

    img.onload = () => {
      paintFace(img, type === "affirm");
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    };

    const svgFace = faceSvgForType(type);
    if (svgFace) {
      const svgBlob = new Blob([svgFace], { type: "image/svg+xml;charset=utf-8" });
      objectUrl = URL.createObjectURL(svgBlob);
      img.src = objectUrl;
    } else if (type === "affirm") {
      img.src = `${basePath}/affirm-logo.png`;
    }

    const coinGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.22, 64);
    coinGeometry.rotateX(Math.PI / 2);

    const rimBump = createMilledRimTexture();
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: rimColorForType(type),
      metalness: 0.85,
      roughness: 0.3,
      bumpMap: rimBump,
      bumpScale: 0.04,
    });

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

    const coinMesh = new THREE.Mesh(coinGeometry, [
      rimMaterial,
      frontMaterial,
      backMaterial,
    ]);

    coinMesh.rotation.set(0, 0, 0);
    scene.add(coinMesh);

    let animationFrameId: number;
    let currentSpeed = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const isMobile = isMobileRef.current;
      const isActive = isMobile ? isInMiddleRef.current : isHoveredRef.current;
      const hasClickImpulse = clickImpulseRef.current > 0.001;

      if (isActive || hasClickImpulse || Math.abs(currentSpeed) > 0.0005) {
        const targetSpeed = isActive ? 0.036 : 0;
        currentSpeed += (targetSpeed - currentSpeed) * 0.08;

        if (hasClickImpulse) {
          coinMesh.rotation.y += clickImpulseRef.current;
          clickImpulseRef.current *= 0.93;
        }

        coinMesh.rotation.y += currentSpeed;

        const targetTilt = isActive ? 0.16 : 0;
        coinMesh.rotation.x += (targetTilt - coinMesh.rotation.x) * 0.08;

        renderer.render(scene, camera);
      } else {
        const tiltDiff = 0 - coinMesh.rotation.x;

        if (Math.abs(tiltDiff) > 0.001 || needsInitialRender) {
          coinMesh.rotation.x += tiltDiff * 0.12;
          renderer.render(scene, camera);
          needsInitialRender = false;
        }
      }
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.render(scene, camera);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", checkViewportPosition);
      window.removeEventListener("resize", checkViewportPosition);
      resizeObserver.disconnect();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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
  }, [type]);

  const isExternal = href.startsWith("http");

  return (
    <Link
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      title={title}
      aria-label={title}
      onMouseEnter={() => {
        if (!isMobileRef.current) {
          isHoveredRef.current = true;
        }
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      onClick={() => {
        if (!isMobileRef.current || isInMiddleRef.current) {
          clickImpulseRef.current = 0.18;
        }
      }}
      className="group relative inline-flex items-center justify-center cursor-pointer select-none focus:outline-none transition-transform duration-300 hover:scale-105"
    >
      <div
        ref={containerRef}
        className={`${className} relative flex items-center justify-center drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300`}
      />
    </Link>
  );
}
