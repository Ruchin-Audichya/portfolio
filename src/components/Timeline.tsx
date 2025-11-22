"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

const milestones = [
    {
        year: "2025",
        title: "SOTA Portfolio",
        description: "Launched a high-performance, 3D interactive portfolio using Next.js 14 and React Three Fiber.",
        tech: ["Next.js", "R3F", "AI"]
    },
    {
        year: "2024",
        title: "Cloud & Automation",
        description: "Deep dive into AWS infrastructure and n8n automation workflows. Built scalable systems for personal productivity.",
        tech: ["AWS", "n8n", "Linux"]
    },
    {
        year: "2023",
        title: "Frontend Mastery",
        description: "Focused on advanced React patterns, animation libraries (GSAP, Framer Motion), and modern CSS architecture.",
        tech: ["React", "GSAP", "Tailwind"]
    },
    {
        year: "2022",
        title: "The Beginning",
        description: "Started the journey into software engineering. Built foundational projects and learned the core web stack.",
        tech: ["HTML/CSS", "JS", "Git"]
    }
];

export function Timeline() {
    return (
        <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
            {milestones.map((item, index) => (
                <ScrollReveal key={index} width="100%">
                    <div className="relative pl-8 md:pl-12">
                        {/* Dot */}
                        <span className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-background" />

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                            <span className="text-accent font-mono font-bold text-lg">{item.year}</span>
                            <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
                        </div>

                        <p className="text-muted-foreground mb-4 max-w-xl">
                            {item.description}
                        </p>

                        <div className="flex gap-2">
                            {item.tech.map(t => (
                                <span key={t} className="text-xs font-mono uppercase tracking-widest text-accent-teal/80 bg-accent-teal/10 px-2 py-1 rounded">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            ))}
        </div>
    );
}
