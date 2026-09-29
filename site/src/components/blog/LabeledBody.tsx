import type { LabeledParagraph } from "@/lib/frontMatter.mjs";

type LabeledBodyProps = {
  paragraphs: LabeledParagraph[];
};

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
              <p className="mb-1.5 font-mono text-xs leading-snug tracking-[0.14em] text-indigo-dark [font-variant-caps:all-small-caps] xl:mb-0 xl:pt-1.5 xl:text-right">
                {paragraph.label}
              </p>
            ) : (
              <span className="hidden xl:block" aria-hidden="true" />
            )}
            <p className="min-w-0 leading-relaxed">{paragraph.text}</p>
          </div>
        );
      })}
    </article>
  );
}
