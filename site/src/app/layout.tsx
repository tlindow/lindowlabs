import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/react";
import PersonJsonLd from "@/components/PersonJsonLd";
import FunnelCapture from "@/components/FunnelCapture";
import SiteChrome from "@/components/SiteChrome";
import { AnalyticsProvider } from "@/context/AnalyticsProvider";
import { SITE_SHARE_TITLE, SITE_SUPPORT } from "@/data/positioning";
import "./globals.css";

/** Site-wide mobile zoom lock: no pinch or double-tap zoom. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Self-hosted (src/app/fonts, OFL-1.1 via Fontsource) so builds never fetch
// Google Fonts. A network blip there used to fail build:static in CI.
const inter = localFont({
  variable: "--font-inter",
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  display: "swap",
});

const spaceMono = localFont({
  variable: "--font-space-mono",
  src: [
    { path: "./fonts/space-mono-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/space-mono-latin-700-normal.woff2", weight: "700" },
  ],
  display: "swap",
});

const silkscreen = localFont({
  variable: "--font-pixel",
  src: [
    { path: "./fonts/silkscreen-latin-400-normal.woff2", weight: "400" },
    { path: "./fonts/silkscreen-latin-700-normal.woff2", weight: "700" },
  ],
  display: "swap",
});

/** Fraunces with SOFT / opsz / WONK axes. */
const fraunces = localFont({
  variable: "--font-fraunces",
  src: "./fonts/fraunces-latin-full-normal.woff2",
  weight: "100 900",
  display: "swap",
});

/** Tinker login UI face (body / inputs on /learning gate). */
const instrumentSans = localFont({
  variable: "--font-instrument-sans",
  src: "./fonts/instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lindowlabs.dev"),
  title: SITE_SHARE_TITLE,
  description: SITE_SUPPORT,
  openGraph: {
    title: SITE_SHARE_TITLE,
    description: SITE_SUPPORT,
    url: "https://lindowlabs.dev",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_SHARE_TITLE,
    description: SITE_SUPPORT,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${spaceMono.variable} ${silkscreen.variable} ${fraunces.variable} ${instrumentSans.variable} font-mono antialiased bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark`}
      >
        <PersonJsonLd />
        <AnalyticsProvider>
          <FunnelCapture />
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
        </AnalyticsProvider>
      </body>
    </html>
  );
}
