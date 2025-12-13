"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import { PerformanceMonitor, Preload } from "@react-three/drei";
import { RuchinWorld } from "./RuchinWorld";
import { LoadingProgress } from "@/components/ui/LoadingProgress";

interface SceneProps {
    onNodeClick?: (id: any) => void;
    scrollProgress?: number;
}

/**
 * Quality tiers for adaptive rendering:
 * - high: Full visual fidelity, all effects enabled
 * - medium: Subtle reductions (fewer lights, lower shadow resolution)
 * - low: Maximum performance (no shadows, minimal lights, reduced particles)
 */
export type WorldQuality = "high" | "medium" | "low";

export default function Scene({ onNodeClick, scrollProgress = 0 }: SceneProps) {
    // Start low to reduce load jank; PerformanceMonitor can raise DPR if stable.
    const [dpr, setDpr] = useState(0.8);
    const [quality, setQuality] = useState<WorldQuality>("low");
    const [webglSupported, setWebglSupported] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [preloadAll, setPreloadAll] = useState(false);
    const [userWantsPreload, setUserWantsPreload] = useState(false);
    const [renderEnabled, setRenderEnabled] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    
    // Track FPS for adaptive quality - allows stepping through medium tier
    const declineCountRef = useRef(0);
    
    useEffect(() => {
        const mobile = window.innerWidth < 768 || 
            /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        setIsMobile(mobile);
        // Higher initial DPR for better resolution - PerformanceMonitor will adjust if needed
        const isLowEndDevice = navigator.hardwareConcurrency <= 4;
        const devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        // Start higher: mobile 0.85-1.0, desktop 1.0-1.2
        const deviceRatio = mobile 
            ? (isLowEndDevice ? 0.75 : Math.min(0.9, devicePixelRatio * 0.7))
            : Math.min(1.1, devicePixelRatio * 0.85);
        setDpr(deviceRatio);

        // Always start at low quality to prevent jank, PerformanceMonitor will upgrade if stable.
        setQuality("low");

        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            setWebglSupported(!!gl);
        } catch {
            setWebglSupported(false);
        }
    }, []);

    // Pause rendering when the hero is offscreen to avoid background load.
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                setRenderEnabled(entry.isIntersecting);
            },
            { root: null, threshold: 0, rootMargin: "0px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Preload heavy assets only after clear intent (click/touch) and when quality is high and not mobile.
    useEffect(() => {
        if (preloadAll) return;
        if (!renderEnabled) return;
        if (isMobile) return;
        if (quality !== "high") return;
        if (!userWantsPreload) return;
        setPreloadAll(true);
    }, [isMobile, quality, preloadAll, userWantsPreload, renderEnabled]);

    return (
        <div
            className="h-screen w-full absolute inset-0 z-0 select-none"
            id="hero-canvas"
            style={{ touchAction: isMobile ? "pan-y pinch-zoom" : "none", userSelect: "none" }}
            onPointerDown={() => setUserWantsPreload(true)}
            onTouchStart={() => setUserWantsPreload(true)}
            ref={containerRef}
        >
            {!webglSupported && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white p-6 gap-4">
                    <div className="text-lg font-semibold">WebGL unavailable</div>
                    <div className="text-sm text-white/80 text-center max-w-md">
                        Your device or browser disabled 3D. Use the quick links below to explore the portfolio.
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {["#about", "#skills", "#projects", "#contact"].map((href) => (
                            <a key={href} href={href} className="px-4 py-2 rounded-full bg-white text-black text-sm font-semibold hover:bg-white/90">
                                {href.replace("#", "").toUpperCase()}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Cinematic framing (vignette + top/bottom gradient); does not block 3D interactions */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
            <div className="pointer-events-none absolute inset-0 z-10 bg-radial-gradient from-transparent to-black/45" />

            <div className="absolute inset-0 z-0">
                <Canvas
                    shadows={!isMobile && quality === "high"}
                    dpr={dpr}
                    // Render-on-demand to avoid pegging CPU/GPU; the world invalidates at a target FPS.
                    frameloop="demand"
                    // Bring camera closer for a stronger first impression.
                    camera={{ position: [0, 10.2, 34.0], fov: 43 }}
                    style={{ touchAction: isMobile ? "pan-y pinch-zoom" : "none" }}
                    gl={{
                        antialias: !isMobile,
                        powerPreference: "high-performance",
                        alpha: false,
                        stencil: false,
                        depth: true,
                        failIfMajorPerformanceCaveat: false
                    }}
                >
                    <PerformanceMonitor
                        ms={500}
                        iterations={3}
                        threshold={0.8}
                        onIncline={() => {
                            // Step up quality tier: low → medium → high
                            setQuality((q) => {
                                if (isMobile && q === "medium") return q; // Mobile caps at medium
                                if (q === "low") return "medium";
                                return "high";
                            });
                            // Higher DPR caps: mobile up to 1.2, desktop up to 1.5
                            setDpr((v) => Math.min(v + 0.08, isMobile ? 1.2 : 1.5));
                            declineCountRef.current = Math.max(0, declineCountRef.current - 1);
                        }}
                        onDecline={() => {
                            // Step down quality tier: high → medium → low
                            declineCountRef.current++;
                            setQuality((q) => {
                                if (q === "high") return "medium";
                                if (q === "medium" || declineCountRef.current >= 2) return "low";
                                return q;
                            });
                            // Don't drop DPR too aggressively
                            setDpr((v) => Math.max(0.7, v - 0.1));
                        }}
                    />
                    <Suspense fallback={<LoadingProgress />}>
                        <RuchinWorld onNodeClick={onNodeClick} scrollProgress={scrollProgress} quality={quality} renderEnabled={renderEnabled} />
                        {preloadAll && <Preload all />}
                    </Suspense>
                </Canvas>
            </div>
        </div>
    );
}
