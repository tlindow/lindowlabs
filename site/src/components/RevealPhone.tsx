"use client";

import { Phone } from "lucide-react";
import { RESUME_PHONE, resumePhoneDigits } from "@/data/resumeData";

type RevealPhoneProps = {
  phone?: string;
  /** Extra classes for the outer wrapper (icon + number). */
  className?: string;
  iconClassName?: string;
  iconSize?: number;
};

/**
 * Plain selectable resume phone with a tel: link on the web (and in print/PDF).
 */
export default function RevealPhone({
  phone = RESUME_PHONE,
  className = "inline-flex items-center gap-1.5 text-foreground",
  iconClassName = "text-indigo-dark shrink-0",
  iconSize = 12,
}: RevealPhoneProps) {
  if (!phone) return null;

  return (
    <div className={className}>
      <Phone size={iconSize} className={iconClassName} />
      <a
        href={`tel:${resumePhoneDigits(phone)}`}
        className="text-foreground hover:text-indigo-dark transition-colors font-mono"
      >
        {phone}
      </a>
    </div>
  );
}
