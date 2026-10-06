import type { NextConfig } from "next";

// Root domain mapping for https://tlindow.github.io/
const basePath = process.env.BASE_PATH || "";

// Static HTML export for GitHub Pages + local HTML checks only.
// Vercel (and default `next build`) stays SSR so Auth.js can protect /learning.
const useStaticExport = process.env.STATIC_EXPORT === "1";

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
};

export default nextConfig;
