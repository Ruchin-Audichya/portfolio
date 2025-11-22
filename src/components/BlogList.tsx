"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Post } from "@/lib/mdx";

export function BlogList({ posts }: { posts: Post[] }) {
    return (
        <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post, index) => (
                <motion.article
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors hover:border-accent/50 hover:bg-white/10"
                >
                    <div>
                        <div className="mb-4 flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-accent-teal">
                            <time dateTime={post.meta.date}>{post.meta.date}</time>
                            <span>•</span>
                            <div className="flex gap-2">
                                {post.meta.tags.map(tag => (
                                    <span key={tag}>#{tag}</span>
                                ))}
                            </div>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                            <Link href={`/blog/${post.slug}`}>
                                <span className="absolute inset-0" />
                                {post.meta.title}
                            </Link>
                        </h3>
                        <p className="text-muted-foreground line-clamp-3">
                            {post.meta.description}
                        </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent group-hover:translate-x-2 transition-transform">
                        Read Article <ArrowRight className="w-4 h-4" />
                    </div>
                </motion.article>
            ))}
        </div>
    );
}
