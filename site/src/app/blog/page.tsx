import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { getBlogIndexPosts, getPostHref } from "@/data/blogPosts";

export const metadata: Metadata = {
  title: "Blog: Tyler Lindow",
  description:
    "Writing from an engineering manager for developer experience on product as system architecture.",
  openGraph: {
    title: "Blog: Tyler Lindow",
    description:
      "Writing from an engineering manager for developer experience on product as system architecture.",
    url: "https://tlindow.github.io/blog",
    siteName: "Tyler Lindow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog: Tyler Lindow",
    description:
      "Writing from an engineering manager for developer experience on product as system architecture.",
  },
};

export default function BlogIndexPage() {
  const posts = getBlogIndexPosts();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-indigo-light selection:text-indigo-dark font-mono flex flex-col justify-between">
      <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-20 sm:pb-32 flex-1">
        {/* Minimalist Header */}
        <header className="mb-16 space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-foreground font-mono">
            Blog
          </h1>
          <p className="text-sm sm:text-base text-muted font-mono max-w-xl leading-relaxed">
            Building Product as System Architecture.
          </p>
        </header>

        {/* Post List */}
        <div className="space-y-16">
          {posts.map((post) => {
            const href = getPostHref(post);
            return (
            <article key={post.id} className="space-y-2 group">
              {/* Pre-title */}
              <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-widest text-indigo-dark block">
                {post.pretitle || "My work product"}
              </span>

              {/* Title: Clean typography */}
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono leading-snug">
                <Link
                  href={href}
                  className="hover:text-indigo-dark transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt / Content Subtext */}
              <p className="text-sm sm:text-base text-muted font-mono leading-relaxed pt-1">
                {post.subtitle || post.summary}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted font-mono pt-1">
                <span className="text-foreground font-medium">{post.date}</span>
                <span>·</span>
                <span>By {post.author.name}</span>
              </div>

              {/* Linkout */}
              <div className="pt-2">
                <Link
                  href={href}
                  className="inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-alt text-foreground border border-border px-5 py-2.5 text-xs sm:text-sm font-mono font-bold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title={`Read ${post.title}`}
                >
                  <FileText size={15} className="shrink-0 text-foreground" />
                  <span>Read blog post</span>
                </Link>
              </div>
            </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}
