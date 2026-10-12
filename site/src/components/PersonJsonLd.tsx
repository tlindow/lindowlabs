"use client";

import { SITE_TITLE } from "@/data/positioning";

/** Person schema for the unified single-audience site. */
export default function PersonJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://tlindow.github.io/#person",
        name: "Tyler Lindow",
        jobTitle: SITE_TITLE,
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
