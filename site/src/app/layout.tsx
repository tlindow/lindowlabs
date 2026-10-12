import type { Metadata, Viewport } from "next";
import {
  Inter,
  Space_Mono,
  Silkscreen,
  Fraunces,
  Instrument_Sans,
} from "next/font/google";
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

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const silkscreen = Silkscreen({
  variable: "--font-pixel",
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "opsz", "WONK"],
  display: "swap",
});

/** Tinker login UI face (body / inputs on /learning gate). */
const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
