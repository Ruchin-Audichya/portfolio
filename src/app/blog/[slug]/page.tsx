import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ScrollReveal } from "@/components/ScrollReveal";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    try {
        const post = getPostBySlug(params.slug);
        return {
            title: `${post.meta.title} | Ruchin Audichya`,
            description: post.meta.description,
        };
    } catch (e) {
        return {
            title: "Blog Post Not Found",
        };
    }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
    let post;
    try {
        post = getPostBySlug(params.slug);
    } catch (e) {
        notFound();
    }

    return (
        <article className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto">
            <ScrollReveal width="100%">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-muted-foreground hover:text-accent mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Log
                </Link>

                <header className="mb-12">
                    <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-widest text-accent-teal mb-4">
                        <time dateTime={post.meta.date}>{post.meta.date}</time>
                        <span>•</span>
                        <div className="flex gap-2">
                            {post.meta.tags.map(tag => (
                                <span key={tag}>#{tag}</span>
                            ))}
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">
                        {post.meta.title}
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        {post.meta.description}
                    </p>
                </header>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl">
                    <MDXRemote source={post.content} />
                </div>
            </ScrollReveal>
        </article>
    );
}
