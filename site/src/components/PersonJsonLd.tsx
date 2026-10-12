"use client";

import { usePathname } from "next/navigation";
import { ENGINEERING_LEADERS_PATH } from "@/data/engineeringLeadersPage";
import { SITE_TITLE } from "@/data/positioning";

/** Person schema; leaders leaf avoids "engineering manager" in jobTitle. */
export default function PersonJsonLd() {
  const pathname = usePathname() || "/";
  const jobTitle =
    pathname === ENGINEERING_LEADERS_PATH ||
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
