"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import {
  RESUME_PHONE_OBSCURED,
  assembleResumePhone,
  assembleResumePhoneDigits,
} from "@/data/resumeData";

type RevealPhoneProps = {
  obscured?: string;
  /** Extra classes for the outer wrapper (icon + number). */
  className?: string;
  iconClassName?: string;
  iconSize?: number;
};

/**
 * Masked phone in static HTML. On click, assembles the number from encoded
 * char-code parts so plain digits never ship in HTML, JSON-LD, or props.
 */
export default function RevealPhone({
  obscured = RESUME_PHONE_OBSCURED,
  className = "inline-flex items-center gap-1.5 text-foreground",
  iconClassName = "text-indigo-dark shrink-0",
  iconSize = 12,
}: RevealPhoneProps) {
  const [revealed, setRevealed] = useState(false);
  const phone = revealed ? assembleResumePhone() : null;

  return (
    <div className={className}>
      <Phone size={iconSize} className={iconClassName} />
      <span className="print:hidden">
        {phone ? (
          <a
            href={`tel:${assembleResumePhoneDigits()}`}
            className="text-foreground hover:text-indigo-dark transition-colors"
          >
            {phone}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="text-foreground hover:text-indigo-dark transition-colors cursor-pointer text-left font-mono"
            title="Click to reveal phone number"
          >
            {obscured}
          </button>
        )}
      </span>
      <span className="hidden print:inline text-foreground font-mono">
        {phone ?? obscured}
      </span>
    </div>
  );
}
