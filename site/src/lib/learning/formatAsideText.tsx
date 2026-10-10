import type { ReactNode } from "react";

/**
 * Render curriculum aside copy. Supports a single *italic* span per segment
 * (e.g. book titles in Considered instead notes). No other markdown.
 */
export function formatAsideText(text: string): ReactNode {
  const parts = text.split(/(\*[^*]+\*)/g);
  if (parts.length === 1) return text;
  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
