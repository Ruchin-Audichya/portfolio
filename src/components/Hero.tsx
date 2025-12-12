"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { content } from "@/lib/content";
import Magnetic from "./Magnetic";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const textLeftRef = useRef<HTMLHeadingElement>(null);
    const textRightRef = useRef<HTMLHeadingElement>(null);
    const sublineRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.to(lineRef.current, { height: "100%", duration: 1, ease: "power3.inOut" })
                .from(textLeftRef.current, { x: -50, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
                .from(textRightRef.current, { x: 50, opacity: 0, duration: 0.8, ease: "power3.out" }, "<")
                .from(sublineRef.current, { y: 20, opacity: 0, duration: 0.6 }, "-=0.4");
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black" id="hero">
            {/* 3D Background Layer */}
            <div className="absolute inset-0 z-0">
                <Scene />
            </div>

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
            <div className="absolute inset-0 z-10 bg-radial-gradient from-transparent to-black/40 pointer-events-none" />

            {/* The Streak */}
            <div ref={lineRef} className="absolute top-0 bottom-0 w-[1px] bg-accent/30 h-0 z-10 pointer-events-none" />

            {/* Content Layer */}
            <div className="relative z-20 flex flex-col items-center text-center pointer-events-none">
                <div className="flex flex-col md:flex-row items-baseline gap-2 md:gap-4 overflow-hidden">
                    <h1 ref={textLeftRef} className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-white drop-shadow-2xl">
                        {content.profile.name.split(" ")[0].toUpperCase()}
                    </h1>
                    <h1 ref={textRightRef} className="text-6xl md:text-8xl font-display font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 drop-shadow-2xl">
                        {content.profile.name.split(" ")[1].toUpperCase()}
                    </h1>
                </div>
                <p ref={sublineRef} className="mt-6 text-lg md:text-xl font-body text-white/90 tracking-wide uppercase drop-shadow-lg font-medium">
                    {content.profile.headline}
                </p>

                <div className="mt-12 opacity-0 animate-fade-in-up pointer-events-auto" style={{ animationDelay: "1s", animationFillMode: "forwards" }}>
                    <Magnetic>
                        <a
                            href={content.profile.resume}
                            download
                            className="px-8 py-4 border border-white/30 rounded-full text-sm font-mono uppercase tracking-widest bg-black/20 backdrop-blur-md hover:bg-white/10 hover:border-accent hover:text-accent transition-all duration-300 inline-block shadow-lg"
                        >
                            Download Resume
                        </a>
                    </Magnetic>
                </div>
            </div>
        </section>
    );
}
