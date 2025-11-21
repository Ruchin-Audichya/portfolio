"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { content } from "@/lib/content";

export default function Story() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="min-h-screen flex items-center justify-center py-24 px-6 relative">
            <div className="max-w-3xl mx-auto relative z-10">
                <motion.div style={{ opacity, y }} className="space-y-8">
                    <h2 className="text-sm font-mono text-accent uppercase tracking-widest mb-8">
                        {content.profile.bio_title}
                    </h2>

                    <div className="mb-12 relative w-32 h-32 md:w-48 md:h-48 overflow-hidden rounded-2xl border border-white/10">
                        <img
                            src={content.profile.avatar}
                            alt={content.profile.name}
                            className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                        />
                    </div>

                    {content.profile.bio.map((paragraph, index) => (
                        <p key={index} className="text-2xl md:text-4xl font-display leading-tight text-primary/90">
                            {paragraph}
                        </p>
                    ))}

                    <div className="pt-8 border-t border-white/10">
                        <p className="text-muted font-body italic">
                            &quot;{content.profile.mission}&quot;
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Background Decoration */}
            <div className="absolute right-0 top-1/3 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl -z-10" />
        </section>
    );
}
