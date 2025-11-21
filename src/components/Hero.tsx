"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { content } from "@/lib/content";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const orbRef = useRef<HTMLDivElement>(null);
    const textLeftRef = useRef<HTMLHeadingElement>(null);
    const textRightRef = useRef<HTMLHeadingElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.to(lineRef.current, { height: "100%", duration: 1, ease: "power3.inOut" })
                .to(orbRef.current, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" })
                .from(textLeftRef.current, { x: -50, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
                .from(textRightRef.current, { x: 50, opacity: 0, duration: 0.8, ease: "power3.out" }, "<")
                .from(sublineRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />

            {/* The Streak */}
            <div ref={lineRef} className="absolute top-0 bottom-0 w-[1px] bg-accent/30 h-0" />

            {/* The Orb */}
            <div ref={orbRef} className="absolute w-64 h-64 rounded-full border border-accent/20 bg-accent/5 blur-3xl opacity-0 scale-0" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center z-20">
                <div className="flex flex-col md:flex-row items-baseline gap-2 md:gap-4 overflow-hidden">
                    <h1 ref={textLeftRef} className="text-6xl md:text-8xl font-display font-bold tracking-tighter">
                        {content.profile.name.split(" ")[0].toUpperCase()}
                    </h1>
                    <h1 ref={textRightRef} className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                        {content.profile.name.split(" ")[1].toUpperCase()}
                    </h1>
                </div>
                <p ref={sublineRef} className="mt-6 text-lg md:text-xl font-body text-muted tracking-wide uppercase">
                    {content.profile.headline}
                </p>

                <div className="mt-12 opacity-0 animate-fade-in-up" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
                    <a
                        href={content.profile.resume}
                        download
                        className="px-8 py-4 border border-white/20 rounded-full text-sm font-mono uppercase tracking-widest hover:bg-white/5 hover:border-accent hover:text-accent transition-all duration-300"
                    >
                        Download Resume
                    </a>
                </div>
            </div>
        </section>
    );
}
