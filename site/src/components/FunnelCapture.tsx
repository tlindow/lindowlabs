"use client";

import { useEffect } from "react";
import { captureLandingUtms } from "@/lib/funnel";

/** Persist landing utm_* into sessionStorage on first client paint. */
export default function FunnelCapture() {
  useEffect(() => {
    captureLandingUtms();
  }, []);
  return null;
}
