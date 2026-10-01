import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import PageAudioPlayer, { pageAudioLabel } from "@/components/PageAudioPlayer";
import LabeledBody from "@/components/blog/LabeledBody";
import { blogPosts, getAdjacentPosts, getBlogPostBySlug } from "@/data/blogPosts";
import { findRedirectTarget, loadRenderedParagraphs } from "@/lib/frontMatter.mjs";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
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
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const redirectTarget = findRedirectTarget(slug);
  if (redirectTarget) {
    redirect(`/blog/${redirectTarget}`);
  }

  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = loadRenderedParagraphs(slug);
  const { previous, next } = getAdjacentPosts(slug);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between">
      <Navbar />

      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-20 sm:pb-32 flex-1">
        {/* Back Navigation */}
        <div className="mb-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted hover:text-indigo-dark transition-colors py-1"
          >
            <ArrowLeft size={14} />
            <span>All posts</span>
          </Link>
        </div>

        {post.audioSrc ? (
          <div className="mb-10">
            <PageAudioPlayer
              src={post.audioSrc}
              label={pageAudioLabel(post.audioDurationSeconds ?? 0)}
              className="w-full px-0 pt-0 pb-0"
            />
          </div>
        ) : null}

        {/* Article Header (Purple pre-title, Title, Content format) */}
        <header className="mb-12 space-y-2">
          <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
            {post.pretitle || "My work product"}
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

        <div className="mt-16 pt-8 border-t border-border flex flex-col gap-6 text-xs font-mono">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {previous ? (
              <Link
                href={`/blog/${previous.slug}`}
                className="inline-flex items-start gap-1.5 font-bold text-foreground hover:text-indigo-dark transition-colors group sm:max-w-[46%]"
              >
                <ArrowLeft size={14} className="mt-0.5 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:hidden">
                    Previous
                  </span>
                  <span>{previous.title}</span>
                </span>
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="inline-flex items-start gap-1.5 font-bold text-foreground hover:text-indigo-dark transition-colors group sm:max-w-[46%] sm:ml-auto sm:text-right"
                title={`Read next: ${next.title}`}
              >
                <span className="flex flex-col gap-0.5 sm:items-end">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted sm:hidden">
                    Next
                  </span>
                  <span>{next.title}</span>
                </span>
                <ArrowRight size={14} className="mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : null}
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-bold text-indigo-dark hover:text-indigo-dark/80 transition-colors w-fit"
          >
            <ArrowLeft size={14} />
            <span>Back to home</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
