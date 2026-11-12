import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
import { getAllPosts } from "@/lib/mdx";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/blog", priority: 0.6, changeFrequency: "monthly" },
    ...projects.map((p, i) => ({
      path: `/projects/${p.slug}`,
      priority: i < 3 ? 0.9 : 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...getAllPosts().map((post) => ({
      path: `/blog/${post.slug}`,
      priority: 0.5,
      changeFrequency: "monthly" as const,
    })),
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
