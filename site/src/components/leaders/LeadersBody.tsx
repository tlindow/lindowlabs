"use client";

import About from "@/components/About";
import WhatYouGet from "@/components/WhatYouGet";
import {
  ENGINEERING_LEADERS_ABOUT_BODY,
  ENGINEERING_LEADERS_MUSEUM_BODY,
} from "@/data/engineeringLeadersPage";

/**
 * Below-hero sections for /engineering-leaders: About (no job-search line) +
 * museum paragraph in the same section, then shared WhatYouGet pillars.
 */
export default function LeadersBody() {
  return (
    <>
      <About
        body={ENGINEERING_LEADERS_ABOUT_BODY}
        afterBody={ENGINEERING_LEADERS_MUSEUM_BODY}
      />
      <WhatYouGet />
    </>
  );
}
