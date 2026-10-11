"use client";

import { usePathname } from "next/navigation";
import { SITE_TITLE } from "@/data/positioning";

/** Person schema; retreat leaf avoids "engineering manager" in jobTitle. */
export default function PersonJsonLd() {
  const pathname = usePathname() || "/";
  const jobTitle =
    pathname === "/get-your-time-back"
      ? "Engineering Leader, Developer Experience"
      : SITE_TITLE;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://tlindow.github.io/#person",
        name: "Tyler Lindow",
        jobTitle,
        email: "tyler@lindowlabs.dev",
        address: {
          "@type": "PostalAddress",
          addressLocality: "San Diego",
          addressRegion: "CA",
          postalCode: "92102",
          addressCountry: "US",
        },
        url: "https://tlindow.github.io",
        sameAs: [
          "https://www.linkedin.com/in/tlindow",
          "https://github.com/tlindow",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
