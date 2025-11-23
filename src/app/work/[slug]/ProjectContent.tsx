"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/lib/content";

gsap.registerPlugin(ScrollTrigger);

export default function ProjectContent({ params }: { params: { slug: string } }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const heroImageRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Find project data
    const project = content.projects.find(p => p.slug === params.slug);

    useEffect(() => {
        if (!project) return;

        const ctx = gsap.context(() => {
            // Parallax Hero Image
            gsap.to(heroImageRef.current, {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            });

            // Fade in Content
            gsap.from(contentRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                },
            });
        }, containerRef);

        return () => ctx.revert();
    }, [project]);

    if (!project) {
        return notFound();
    }

    return (
        <main ref={containerRef} className="min-h-screen bg-background text-primary">
            {/* Project Hero */}
            <section className="relative h-[80vh] overflow-hidden">
                <div ref={heroImageRef} className="absolute inset-0 bg-gray-800 bg-cover bg-center" style={{ backgroundImage: `url(${project.image})` }} />
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute bottom-0 left-0 p-12 md:p-24">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-accent font-mono uppercase tracking-widest">{project.category}</span>
                        <span className="text-muted font-mono">/ {project.year}</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-display font-bold uppercase max-w-4xl leading-none">{project.title}</h1>
                </div>
            </section>

            {/* Content */}
            <section ref={contentRef} className="max-w-5xl mx-auto py-24 px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="md:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map(t => (
                                    <span key={t} className="px-3 py-1 border border-white/10 rounded-full text-sm text-muted">{t}</span>
                                ))}
                            </div>
                        </div>
                        <Link href="/#work" className="inline-block text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors">
                            &larr; Back to Works
                        </Link>
                    </div>

                    <div className="md:col-span-2">
                        <h3 className="text-sm font-mono text-accent uppercase tracking-widest mb-4">Overview</h3>
                        <p className="text-xl md:text-2xl leading-relaxed mb-8 font-display">
                            {project.description}
                        </p>
                        <p className="text-muted leading-relaxed">
                            (Detailed case study content would go here. This is a placeholder for the full narrative of the {project.title} project, explaining the challenge, solution, and outcome in depth.)
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
