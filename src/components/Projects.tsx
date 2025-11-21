"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { content } from "@/lib/content";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const cards = gsap.utils.toArray(".project-card");

            gsap.to(cards, {
                xPercent: -100 * (cards.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: triggerRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (cards.length - 1),
                    end: () => "+=" + (triggerRef.current?.offsetWidth || 0),
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="overflow-hidden bg-background">
            <div ref={triggerRef} className="h-screen flex items-center px-12 md:px-24 overflow-hidden">
                <div className="flex gap-12 md:gap-24">
                    {/* Intro Card */}
                    <div className="project-card min-w-[80vw] md:min-w-[40vw] flex flex-col justify-center">
                        <h2 className="text-6xl md:text-8xl font-display font-bold mb-8">
                            Selected<br />Works
                        </h2>
                        <p className="text-xl text-muted max-w-md">
                            A collection of digital artifacts, systems, and experiments.
                        </p>
                        <div className="mt-12 flex items-center gap-4">
                            <span className="text-sm font-mono text-accent uppercase tracking-widest">Scroll to Explore</span>
                            <div className="w-12 h-[1px] bg-accent" />
                        </div>
                    </div>

                    {/* Project Cards */}
                    {content.projects.map((project, index) => (
                        <div
                            key={project.slug}
                            className="project-card min-w-[85vw] md:min-w-[60vw] h-[70vh] relative group bg-surface border border-white/5 hover:border-accent/50 transition-colors duration-500 flex flex-col"
                        >
                            {/* Image Placeholder area */}
                            <div className="flex-1 bg-gradient-to-br from-white/5 to-transparent relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-9xl font-display font-bold text-white/5 group-hover:text-white/10 transition-colors duration-500 select-none">
                                    0{index + 1}
                                </div>
                                <div className="absolute top-6 right-6 p-2 bg-background/50 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ArrowUpRight className="w-6 h-6 text-accent" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8 md:p-12 border-t border-white/5 bg-background/80 backdrop-blur-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className="text-xs font-mono text-accent uppercase tracking-widest mb-2 block">
                                            {project.category}
                                        </span>
                                        <h3 className="text-3xl md:text-4xl font-display font-bold group-hover:text-accent transition-colors">
                                            {project.title}
                                        </h3>
                                    </div>
                                    <span className="text-sm font-mono text-muted">{project.year}</span>
                                </div>

                                <p className="text-muted mb-8 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {project.tech.map((t) => (
                                        <span key={t} className="px-3 py-1 text-xs font-mono border border-white/10 rounded-full text-muted">
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <Link
                                    href={`/work/${project.slug}`}
                                    className="inline-flex items-center text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors"
                                >
                                    View Case Study
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
