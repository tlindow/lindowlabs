"use client";

import { useSyncExternalStore } from "react";
import { Mail } from "lucide-react";
import { RESUME_EMAIL_PARTS } from "@/data/resumeData";

/** Similar length to the personal resume address; used in static HTML. */
const EMAIL_PLACEHOLDER = "xxxxxxxxxxxxxxxxxxxxxx";

function subscribe() {
  return () => {};
}

function getClientEmail() {
  return RESUME_EMAIL_PARTS.join("");
}

function getServerEmail() {
  return EMAIL_PLACEHOLDER;
}

/**
 * Renders the resume personal email blurred, assembled only on the client
 * so static HTML never contains the address.
 */
export default function BlurredResumeEmail() {
  const label = useSyncExternalStore(subscribe, getClientEmail, getServerEmail);

  return (
    <span className="inline-flex items-center gap-1.5 text-foreground">
      <span className="sr-only">Email hidden; use the Book 30 minutes button</span>
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-1.5 select-none pointer-events-none"
        style={{ filter: "blur(5px)" }}
      >
        <Mail size={12} className="text-indigo-dark shrink-0" />
        {label}
      </span>
    </span>
  );
}
