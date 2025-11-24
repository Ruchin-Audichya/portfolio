"use client";

import { motion } from "framer-motion";
import { ScrollReveal } from "./ScrollReveal";

const milestones = [
    {
        year: "2025",
        title: "Cloud & AI Focus",
        description: "Deepening expertise in AWS, Agentic AI workflows, and building high-performance 3D web experiences. Seeking internships.",
        tech: ["AWS", "Gemini 3.0", "Next.js 14"]
    },
    {
        year: "2024",
        title: "Automation & Advanced Frontend",
        description: "Mastered n8n for personal automation and pushed frontend limits with GSAP, Framer Motion, and Tailwind.",
        tech: ["n8n", "GSAP", "Linux"]
    },
    {
        year: "2023",
        title: "University & Cloud Entry",
        description: "Joined JECRC University. Shifted focus from general web dev to Cloud Computing and scalable backend architectures.",
        tech: ["Cloud Computing", "React", "System Design"]
    },
    {
        year: "2020-2022",
        title: "The Builder Phase",
        description: "Learned the core web stack (HTML/CSS/JS) while building small projects and exploring the software landscape.",
        tech: ["HTML/CSS", "JavaScript", "Web Basics"]
    },
    {
        year: "2019",
        title: "Digital Entrepreneurship",
        description: "Started by buying/selling PC hardware and digital keys on Facebook groups. Built a reputation and learned market dynamics.",
        tech: ["Commerce", "Hardware", "Networking"]
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
