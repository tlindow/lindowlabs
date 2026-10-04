import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blogPosts";
import { LEADERS_CANONICAL_URL } from "@/data/leadersPage";

export const dynamic = "force-static";

const SITE = "https://lindowlabs.dev";

/** Public indexable routes. Contact aliases /time and /get-your-time-back are omitted. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: LEADERS_CANONICAL_URL, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/resume`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/visitors`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE}/learning`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/brand`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE}/modules`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
    lastModified: post.date ? new Date(post.date) : undefined,
  }));

  return [...staticRoutes, ...blogRoutes];
}
