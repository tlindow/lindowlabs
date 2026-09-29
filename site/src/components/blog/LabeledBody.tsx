import type { ReactNode } from "react";
import type { LabeledParagraph } from "@/lib/frontMatter.mjs";

type LabeledBodyProps = {
  paragraphs: LabeledParagraph[];
};

/** Match curly or straight double quotes; render them purple like the pre-label layout. */
const QUOTE_RE = /[“"]([^”"]+)[”"]/g;

function renderWithPurpleQuotes(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  QUOTE_RE.lastIndex = 0;
  while ((match = QUOTE_RE.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={key++} className="text-indigo-dark font-medium italic">
        “{match[1]}”
      </span>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

export default function LabeledBody({ paragraphs }: LabeledBodyProps) {
  return (
    <article className="space-y-6 font-mono text-sm leading-relaxed text-foreground/90 sm:text-base xl:-ml-[10.5rem] xl:w-[calc(100%+10.5rem)]">
      {paragraphs.map((paragraph, index) => {
        const showLabel =
          Boolean(paragraph.label) &&
          (index === 0 || paragraphs[index - 1].label !== paragraph.label);
        return (
          <div
            key={`${paragraph.line}-${index}`}
            className="xl:grid xl:grid-cols-[9rem_minmax(0,1fr)] xl:items-start xl:gap-x-6"
          >
            {showLabel ? (
              <p className="mb-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-foreground xl:mb-0 xl:pt-1.5 xl:text-right">
                {paragraph.label}
              </p>
            ) : (
              <span className="hidden xl:block" aria-hidden="true" />
            )}
            <p className="min-w-0 leading-relaxed">
              {renderWithPurpleQuotes(paragraph.text)}
            </p>
          </div>
        );
      })}
    </article>
  );
}
