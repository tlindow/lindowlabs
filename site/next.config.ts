import type { NextConfig } from "next";

// Root domain mapping for https://tlindow.github.io/
const basePath = process.env.BASE_PATH || "";

// Static HTML export for GitHub Pages + local HTML checks only.
// Vercel (and default `next build`) stays SSR so Auth.js can protect /learning.
const useStaticExport = process.env.STATIC_EXPORT === "1";

/** Retired contact leaf → Calendly connect (query string preserved by Next). */
const CALENDLY_CONNECT = "https://calendly.com/tylerlindow/connect";

const nextConfig: NextConfig = {
  output: useStaticExport ? "export" : undefined,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: false,
  reactStrictMode: true,
  // Static export ignores redirects; write-redirects.mjs emits HTML for Pages.
  // Legacy homepage aliases hop straight to / (no chain through each other).
  // Retired /schedule-time (+ /time alias) hop straight to Calendly.
  async redirects() {
    if (useStaticExport) return [];
    return [
      {
        source: "/engineering-leaders",
        destination: "/",
        permanent: true,
      },
      {
        source: "/engineering-leaders/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/get-your-time-back",
        destination: "/",
        permanent: true,
      },
      {
        source: "/get-your-time-back/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/schedule-time",
        destination: CALENDLY_CONNECT,
        permanent: true,
      },
      {
        source: "/schedule-time/",
        destination: CALENDLY_CONNECT,
        permanent: true,
      },
      {
        source: "/schedule-time/:path*",
        destination: CALENDLY_CONNECT,
        permanent: true,
      },
      {
        source: "/time",
        destination: CALENDLY_CONNECT,
        permanent: true,
      },
      {
        source: "/time/",
        destination: CALENDLY_CONNECT,
        permanent: true,
      },
      {
        source: "/time/:path*",
        destination: CALENDLY_CONNECT,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
