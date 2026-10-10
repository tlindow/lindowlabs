import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import LabeledBody from "@/components/blog/LabeledBody";
import { getBlogPostBySlug } from "@/data/blogPosts";
import { loadRenderedParagraphs } from "@/lib/frontMatter.mjs";

const SLUG = "building-teams-as-raising-funds";

export async function generateMetadata(): Promise<Metadata> {
  const post = getBlogPostBySlug(SLUG);
  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `${post.title} | Tyler Lindow`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      url: `https://lindowlabs.dev/how-i-lead-teams/${SLUG}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
    },
  };
}

export default function HowILeadTeamsPostPage() {
  const post = getBlogPostBySlug(SLUG);

  if (!post) {
    notFound();
  }

  const paragraphs = loadRenderedParagraphs(SLUG);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between">
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 sm:pb-32 flex-1">
        <div className="mb-10">
          <Link
            href="/#what-you-get"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-indigo-dark transition-colors py-1"
          >
            <ArrowLeft size={14} />
            <span>How I lead teams</span>
          </Link>
        </div>

        <header className="mb-12 space-y-2">
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
            {post.pretitle || "How I lead teams"}
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground font-mono leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted font-mono pt-2">
            <span className="text-foreground font-medium">{post.date}</span>
            <span>·</span>
            <span>By {post.author.name}</span>
          </div>
        </header>

        {paragraphs.length > 0 ? (
          <LabeledBody paragraphs={paragraphs} />
        ) : (
          <article className="prose prose-neutral max-w-none font-mono space-y-6 text-foreground/90 leading-relaxed text-sm sm:text-base">
            {post.content.map((paragraph, index) => {
              const isBlockquote = paragraph.startsWith("> ");

              const formattedText = paragraph
                .replace(/^>\s+/, "")
                .replace(
                  /"([^"]+)"/g,
                  '<span class="text-indigo-dark font-medium italic">“$1”</span>'
                )
                .replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="font-bold text-foreground">$1</strong>'
                )
                .replace(
                  /\*(.*?)\*/g,
                  '<em class="italic text-foreground/80">$1</em>'
                )
                .replace(
                  /\[([^\]]+)\]\(([^)]+)\)/g,
                  '<a href="$2" target="_blank" rel="noopener noreferrer" class="underline text-indigo-dark hover:text-foreground transition-colors">$1</a>'
                );

              if (isBlockquote) {
                return (
                  <p
                    key={index}
                    className="text-indigo-dark font-medium italic leading-relaxed my-4 text-sm sm:text-base"
                    dangerouslySetInnerHTML={{ __html: formattedText }}
                  />
                );
              }

              return (
                <p
                  key={index}
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formattedText }}
                />
              );
            })}
          </article>
        )}
      </main>
    </div>
  );
}
