"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RetroClockFoldoverProps {
  fromText?: string;
  toText?: string;
  flipDelay?: number;
  className?: string;
}

/**
 * Individual retro clock foldover word without black background.
 * Letters fold over in 3D with authentic mechanical split-flap physics.
 */
function FoldoverWord({
  word,
  index,
  isGrayed,
}: {
  word: string;
  index: number;
  isGrayed?: boolean;
}) {
  return (
    <span className="relative inline-block mx-[0.14em] select-none perspective-[1000px]">
      <motion.span
        key={word}
        initial={{
          rotateX: isGrayed ? 0 : -90,
          opacity: isGrayed ? 1 : 0,
          y: isGrayed ? 0 : -12,
        }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        exit={{ rotateX: 90, opacity: 0, y: 12 }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 14,
          mass: 0.8,
          delay: isGrayed ? 0 : index * 0.09,
        }}
        style={{
          transformOrigin: "50% 50%",
          transformStyle: "preserve-3d",
          display: "inline-block",
        }}
        className={`transition-colors duration-500 ${
          isGrayed
            ? "font-pixel text-muted/50 font-bold tracking-tight"
            : "font-mono text-foreground font-black tracking-tighter"
        }`}
      >
        {word}
      </motion.span>
    </span>
  );
}

/**
 * RetroClockFoldover Header Component
 * Starts as grayed-out "Software Engineering Manager" and flips ONCE
 * to the Formation headline via 3D mechanical foldover physics.
 */
export default function RetroClockFoldover({
  fromText = "Software Engineering Manager",
  toText = "Engineering Manager - Fintech Platform & 0→1",
  flipDelay = 1200,
  className = "",
}: RetroClockFoldoverProps) {
  const [hasFlipped, setHasFlipped] = useState(false);

  useEffect(() => {
    // Single foldover trigger: flips once and stays on destination title
    const timer = setTimeout(() => {
      setHasFlipped(true);
    }, flipDelay);

    return () => clearTimeout(timer);
  }, [flipDelay]);

  const currentTitle = hasFlipped ? toText : fromText;
  const words = currentTitle.split(" ");

  return (
    <h1
      className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.95] [text-wrap:balance] mx-auto text-center ${className}`}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={hasFlipped ? "flipped" : "initial"}
          className="inline-flex flex-wrap items-center justify-center"
          initial={{ opacity: 0.95 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {words.map((word, i) => (
            <FoldoverWord
              key={`${currentTitle}-${word}-${i}`}
              word={word}
              index={i}
              isGrayed={!hasFlipped}
            />
          ))}
        </motion.span>
      </AnimatePresence>
    </h1>
  );
}
