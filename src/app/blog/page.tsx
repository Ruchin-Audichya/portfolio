import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@/components/site/Icons";
import { getAllPosts } from "@/lib/mdx";

export const metadata: Metadata = {
  title: "Notes",
  description: "Write-ups by Ruchin Audichya on the things he builds and how they work.",
  alternates: { canonical: "/blog" },
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <section className="shell min-h-[70vh] pb-20 pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <p className="fade-up label">Notes</p>
      <h1 className="display mt-5 text-[clamp(3rem,8vw,6rem)]">
        <span className="rise">
          <span>Write-ups</span>
        </span>
      </h1>
      <p className="fade-up mt-5 max-w-xl text-lg leading-relaxed text-ink2" style={{ ["--d" as string]: "300ms" }}>
        How the things I build work under the hood, including the versions I have since replaced.
      </p>

      <ul className="mt-14 border-t border-line-strong">
        {posts.map((post) => (
          <li key={post.slug} data-reveal>
            <Link
              href={`/blog/${post.slug}`}
              className="group grid gap-x-12 gap-y-2 border-b border-line py-8 transition-[padding] duration-300 ease-out hover:pl-2 lg:grid-cols-12"
            >
              <time dateTime={post.meta.date} className="label pt-2 lg:col-span-3">
                {formatDate(post.meta.date)}
              </time>
              <span className="lg:col-span-8">
                <span className="block font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-tight transition-colors group-hover:text-accent">
                  {post.meta.title}
                </span>
                <span className="mt-3 block max-w-2xl text-[0.9375rem] leading-relaxed text-ink2">{post.meta.description}</span>
              </span>
              <span className="hidden items-start justify-end pt-2 lg:col-span-1 lg:flex">
                <ArrowRight className="transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
