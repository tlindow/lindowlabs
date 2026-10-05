"use client";

import type { CSSProperties } from "react";
import { BEGINNER_URL } from "@/data/urls";

/** Outbound product links for Tinker mentions go to Beginner (not tinker.beginner.work). */
export const TINKER_URL = BEGINNER_URL;
export { BEGINNER_URL };
export const TINKER_MARK_SRC = "/tinker-mark.svg";

type TinkerMarkProps = {
  className?: string;
  size?: number;
  alt?: string;
};

/** Official Tinker globe mark from github.com/beginner-work/tinker (copied into /public). */
export function TinkerMark({
  className = "h-5 w-5",
  size,
  alt = "Tinker",
}: TinkerMarkProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const style: CSSProperties | undefined = size
    ? { width: size, height: size }
    : undefined;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${basePath}${TINKER_MARK_SRC}`}
      alt={alt}
      width={size ?? 20}
      height={size ?? 20}
      style={style}
      className={`inline-block shrink-0 object-contain ${className}`}
      loading="eager"
      decoding="async"
    />
  );
}

type TinkerNameProps = {
  className?: string;
  markClassName?: string;
  markSize?: number;
  /** When set, wrap as a link (defaults to Beginner site). Pass false for plain text. */
  href?: string | false;
  title?: string;
};

/** Inline Tinker wordmark: official mark + "Tinker" label. */
export function TinkerName({
  className = "",
  markClassName = "h-[1.1em] w-[1.1em]",
  markSize,
  href = BEGINNER_URL,
  title = "Tinker",
}: TinkerNameProps) {
  const content = (
    <span
      className={`inline-flex items-center gap-1.5 align-baseline font-mono font-bold tracking-tight ${className}`}
    >
      <TinkerMark
        className={markClassName}
        size={markSize}
        alt=""
      />
      <span>Tinker</span>
    </span>
  );

  if (!href) return content;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
      className="inline-flex items-center hover:opacity-90 transition-opacity"
    >
      {content}
    </a>
  );
}
