import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Silkscreen, Fraunces } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { AnalyticsProvider } from "@/context/AnalyticsProvider";
import { SITE_SHARE_TITLE, SITE_SUPPORT, SITE_TITLE } from "@/data/positioning";
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://tlindow.github.io/#person",
      "name": "Tyler Lindow",
      "jobTitle": SITE_TITLE,
      "email": "tyler@lindowlabs.dev",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "San Diego",
        "addressRegion": "CA",
        "postalCode": "92102",
        "addressCountry": "US"
      },
      "url": "https://tlindow.github.io",
      "sameAs": [
        "https://www.linkedin.com/in/tlindow",
        "https://github.com/tlindow"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceMono.variable} ${silkscreen.variable} ${fraunces.variable} font-mono antialiased bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark`}
      >
        <AnalyticsProvider>
          <SiteChrome>{children}</SiteChrome>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
