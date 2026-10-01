"use client";

import React from "react";

/**
 * 1. AbstractOrbitalMesh
 * Abstract geometry for product leadership.
 * Concentric orbital ellipses, intersecting arc rings, and radiant forest-gold backlight.
 */
export function AbstractOrbitalMesh() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0c1912] flex items-center justify-center">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,175,80,0.22),transparent_70%)]" />
      <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle,rgba(232,179,57,0.18),transparent_65%)]" />

      <svg
        viewBox="0 0 400 250"
        className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="orb-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2D5A3D" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#E8B339" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="orb-grad-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#81C784" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2D5A3D" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#81C784" stopOpacity="1" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid pattern overlay */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
          <line x1="0" y1="50" x2="400" y2="50" />
          <line x1="0" y1="100" x2="400" y2="100" />
          <line x1="0" y1="150" x2="400" y2="150" />
          <line x1="0" y1="200" x2="400" y2="200" />
          <line x1="80" y1="0" x2="80" y2="250" />
          <line x1="160" y1="0" x2="160" y2="250" />
          <line x1="240" y1="0" x2="240" y2="250" />
          <line x1="320" y1="0" x2="320" y2="250" />
        </g>

        {/* Concentric orbital rings */}
        <ellipse cx="200" cy="125" rx="140" ry="60" stroke="url(#orb-grad-1)" strokeWidth="1.5" strokeDasharray="6 4" />
        <ellipse cx="200" cy="125" rx="110" ry="45" stroke="url(#orb-grad-2)" strokeWidth="1.75" />
        <ellipse cx="200" cy="125" rx="75" ry="30" stroke="#4CAF50" strokeWidth="1.25" strokeOpacity="0.6" />
        
        {/* Intersecting vertical ring */}
        <ellipse cx="200" cy="125" rx="45" ry="110" stroke="url(#orb-grad-1)" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="4 4" />

        {/* Diagonal tangent vector */}
        <line x1="60" y1="190" x2="340" y2="60" stroke="url(#orb-grad-2)" strokeWidth="1.5" strokeOpacity="0.7" />

        {/* Node points */}
        <circle cx="200" cy="125" r="5" fill="#E8B339" />
        <circle cx="200" cy="125" r="14" fill="url(#node-glow)" />
        
        <circle cx="130" cy="95" r="3.5" fill="#81C784" />
        <circle cx="270" cy="155" r="3.5" fill="#4CAF50" />
        <circle cx="310" cy="75" r="4" fill="#E8B339" />
        <circle cx="90" cy="175" r="3" fill="#81C784" />
      </svg>
    </div>
  );
}

/**
 * 2. AbstractTelemetryPulse
 * Abstract telemetry waveforms, matrix frequency spikes & SLA grid.
 */
export function AbstractTelemetryPulse() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0a1510] flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(39,201,63,0.18),transparent_65%)]" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-[radial-gradient(circle,rgba(0,112,243,0.14),transparent_70%)]" />

      <svg
        viewBox="0 0 400 250"
        className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2D5A3D" stopOpacity="0.2" />
            <stop offset="35%" stopColor="#4CAF50" stopOpacity="0.8" />
            <stop offset="55%" stopColor="#81C784" stopOpacity="1" />
            <stop offset="75%" stopColor="#0070F3" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2D5A3D" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="wave-area" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4CAF50" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#4CAF50" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sla-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFBD2E" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#FFBD2E" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#FF5F56" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Matrix grid dots */}
        <g fill="rgba(255,255,255,0.08)">
          {Array.from({ length: 9 }).map((_, r) =>
            Array.from({ length: 13 }).map((_, c) => (
              <circle key={`${r}-${c}`} cx={30 + c * 28} cy={25 + r * 25} r="1" />
            ))
          )}
        </g>

        {/* SLA Threshold Target Line */}
        <line x1="20" y1="70" x2="380" y2="70" stroke="url(#sla-line)" strokeWidth="1" strokeDasharray="4 4" />
        <text x="320" y="64" fill="#FFBD2E" fontSize="9" fontFamily="monospace" opacity="0.8">
          SLA target
        </text>

        {/* Filled Wave Area */}
        <path
          d="M 20 180 Q 80 170 120 150 T 200 120 T 250 80 T 290 130 T 380 160 L 380 230 L 20 230 Z"
          fill="url(#wave-area)"
        />

        {/* Primary Telemetry Sine Wave */}
        <path
          d="M 20 180 Q 80 170 120 150 T 200 120 T 250 80 T 290 130 T 380 160"
          stroke="url(#wave-grad-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Secondary Phase Wave */}
        <path
          d="M 20 140 Q 90 160 140 130 T 210 160 T 270 110 T 330 140 T 380 120"
          stroke="rgba(129,199,132,0.4)"
          strokeWidth="1.2"
          strokeDasharray="5 3"
        />

        {/* Telemetry Peak Callout */}
        <circle cx="250" cy="80" r="4" fill="#81C784" />
        <circle cx="250" cy="80" r="10" stroke="#81C784" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="250" y1="80" x2="250" y2="210" stroke="rgba(129,199,132,0.25)" strokeWidth="1" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}

/**
 * 3. AbstractPavedPaths
 * Abstract isometric developer highways, branching nodes & SDK conduits.
 */
export function AbstractPavedPaths() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0d1b16] flex items-center justify-center">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(76,175,80,0.2),transparent_65%)]" />
      <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle,rgba(121,40,202,0.15),transparent_70%)]" />

      <svg
        viewBox="0 0 400 250"
        className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="paved-grad-1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2D5A3D" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#4CAF50" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#81C784" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFBD2E" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="branch-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#81C784" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0070F3" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Isometric base grid lines */}
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
          <line x1="50" y1="220" x2="350" y2="70" />
          <line x1="20" y1="180" x2="320" y2="30" />
          <line x1="80" y1="250" x2="380" y2="100" />
          
          <line x1="80" y1="40" x2="350" y2="220" />
          <line x1="50" y1="80" x2="320" y2="250" />
          <line x1="120" y1="20" x2="380" y2="180" />
        </g>

        {/* Main Paved Highway Path */}
        <path
          d="M 40 210 L 160 150 L 220 160 L 320 80 L 370 70"
          stroke="url(#paved-grad-1)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Branching Developer Paths */}
        <path
          d="M 160 150 L 160 90 L 260 40"
          stroke="url(#branch-grad)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="4 3"
        />

        <path
          d="M 220 160 L 290 200 L 360 170"
          stroke="rgba(76,175,80,0.6)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Circuit Interconnect Nodes */}
        <circle cx="160" cy="150" r="5" fill="#81C784" />
        <circle cx="160" cy="150" r="10" stroke="#81C784" strokeWidth="1" strokeOpacity="0.4" />

        <circle cx="220" cy="160" r="4.5" fill="#FFBD2E" />
        <circle cx="320" cy="80" r="5.5" fill="#81C784" />
        <circle cx="320" cy="80" r="12" stroke="#81C784" strokeWidth="1" strokeOpacity="0.4" />

        <circle cx="260" cy="40" r="3.5" fill="#0070F3" />
        <circle cx="360" cy="170" r="3.5" fill="#4CAF50" />
      </svg>
    </div>
  );
}

/**
 * 4. AbstractChromaticVortex
 * Abstract logarithmic spiral, tinker-rainbow chromatic spectrum & moat engine.
 */
export function AbstractChromaticVortex() {
  return (
    <div className="w-full h-full relative overflow-hidden bg-[#10141a] flex items-center justify-center">
      {/* Multi-spectral ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(121,40,202,0.18),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-36 h-36 bg-[radial-gradient(circle,rgba(255,95,86,0.15),transparent_65%)]" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[radial-gradient(circle,rgba(39,201,63,0.15),transparent_65%)]" />

      <svg
        viewBox="0 0 400 250"
        className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="spectrum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF5F56" />
            <stop offset="25%" stopColor="#FFBD2E" />
            <stop offset="50%" stopColor="#27C93F" />
            <stop offset="75%" stopColor="#0070F3" />
            <stop offset="100%" stopColor="#7928CA" />
          </linearGradient>
          <linearGradient id="spiral-fade" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2D5A3D" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#81C784" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFBD2E" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Radiating background ray lines */}
        <g stroke="rgba(255,255,255,0.04)" strokeWidth="1">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x2 = 200 + Math.cos(angle) * 190;
            const y2 = 125 + Math.sin(angle) * 190;
            return <line key={i} x1="200" y1="125" x2={x2} y2={y2} />;
          })}
        </g>

        {/* Chromatic Spiral / Vortex Curves */}
        <path
          d="M 200 125 Q 220 90 260 90 T 320 140 T 260 210 T 130 180 T 110 90 T 200 30 T 340 80"
          stroke="url(#spectrum-grad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.85"
        />

        <path
          d="M 200 125 Q 180 150 140 140 T 100 90 T 160 40 T 280 60 T 310 170"
          stroke="url(#spiral-fade)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          opacity="0.75"
        />

        {/* Outer Radiant Rings */}
        <circle cx="200" cy="125" r="95" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="8 6" />
        <circle cx="200" cy="125" r="60" stroke="rgba(129,199,132,0.3)" strokeWidth="1.2" />
        <circle cx="200" cy="125" r="30" stroke="rgba(255,189,46,0.5)" strokeWidth="1.5" />

        {/* Center Singular Core */}
        <circle cx="200" cy="125" r="6" fill="url(#spectrum-grad)" />
        <circle cx="200" cy="125" r="14" stroke="#81C784" strokeWidth="1" strokeOpacity="0.4" />
      </svg>
    </div>
  );
}
