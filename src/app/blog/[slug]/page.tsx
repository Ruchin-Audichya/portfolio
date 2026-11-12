import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug, type Post } from "@/lib/mdx";
import { SITE_URL, articleSchema, breadcrumbSchema, jsonLd } from "@/lib/seo";

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

const load = (slug: string): Post | null => {
  try {
    return getPostBySlug(slug);
  } catch {
    return null;
  }
};

export function generateMetadata({ params }: Props): Metadata {
  const post = load(params.slug);
  if (!post) return { title: "Note not found" };
  return {
    title: post.meta.title,
    description: post.meta.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.meta.title, description: post.meta.description, publishedTime: post.meta.date },
  };
}

export default function BlogPost({ params }: Props) {
  const post = load(params.slug);
  if (!post) notFound();

  const date = new Date(post.meta.date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <article className="shell pb-20 pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <script {...jsonLd(articleSchema({ ...post.meta, slug: post.slug }))} />
      <script
        {...jsonLd(
          breadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Notes", url: `${SITE_URL}/blog` },
            { name: post.meta.title, url: `${SITE_URL}/blog/${post.slug}` },
          ]),
        )}
      />

      <div className="mx-auto max-w-3xl">
        <nav aria-label="Breadcrumb" className="fade-up label flex items-center gap-2">
          <Link href="/blog" className="link-quiet">
            Notes
          </Link>
          <span aria-hidden="true">/</span>
          <time dateTime={post.meta.date}>{date}</time>
        </nav>

        <header className="mt-8 border-b border-line-strong pb-10">
          <h1 className="fade-up display text-[clamp(2.25rem,5.5vw,4rem)] !leading-[1.04]" style={{ ["--d" as string]: "80ms" }}>
            {post.meta.title}
          </h1>
          <p className="fade-up mt-6 text-lg leading-relaxed text-ink2" style={{ ["--d" as string]: "200ms" }}>
            {post.meta.description}
          </p>
          <p className="fade-up mt-6 font-mono text-xs text-ink3" style={{ ["--d" as string]: "280ms" }}>
            {post.meta.tags.join(" · ")}
          </p>
        </header>

        <div className="prose-notes fade-up mt-10" style={{ ["--d" as string]: "360ms" }}>
          <MDXRemote source={post.content} />
        </div>
      </div>
    </article>
  );
}
