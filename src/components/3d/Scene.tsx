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
    
    // Detect Android specifically for extra optimizations
    const [isAndroid, setIsAndroid] = useState(false);
    
    useEffect(() => {
        const ua = navigator.userAgent;
        const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(ua);
        const android = /Android/i.test(ua);
        setIsMobile(mobile);
        setIsAndroid(android);
        
        // Android phones need lower DPR for smooth 60fps
        const isLowEndDevice = navigator.hardwareConcurrency <= 4;
        const cores = navigator.hardwareConcurrency || 4;
        
        // Aggressive mobile optimization: prioritize FPS over resolution
        let deviceRatio: number;
        if (android) {
            // Android: start very low, let PerformanceMonitor increase if stable
            deviceRatio = isLowEndDevice ? 0.5 : (cores >= 8 ? 0.65 : 0.55);
        } else if (mobile) {
            // iOS: slightly higher as Metal is more efficient
            deviceRatio = isLowEndDevice ? 0.6 : 0.75;
        } else {
            // Desktop
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            deviceRatio = Math.min(1.1, pixelRatio * 0.8);
        }
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
                    frameloop="demand"
                    camera={{ position: [0, isMobile ? 12 : 10.2, isMobile ? 38 : 34], fov: isMobile ? 48 : 43 }}
                    style={{ touchAction: isMobile ? "pan-y pinch-zoom" : "none" }}
                    gl={{
                        // Disable antialiasing on ALL mobile for major FPS boost
                        antialias: !isMobile,
                        // Android: prefer default to let driver decide; Desktop: high-performance
                        powerPreference: isAndroid ? "default" : "high-performance",
                        alpha: false,
                        stencil: false,
                        depth: true,
                        // Crucial: don't fail on mobile GPUs
                        failIfMajorPerformanceCaveat: false,
                        // Reduce precision on mobile for faster shaders
                        precision: isMobile ? "mediump" : "highp",
                        // Preserve buffer for screenshots but disable on mobile
                        preserveDrawingBuffer: false,
                    }}
                    // Flat mode disables tone mapping on mobile for simpler shaders
                    flat={isMobile}
                >
                    <PerformanceMonitor
                        ms={300}
                        iterations={2}
                        threshold={isMobile ? 0.65 : 0.8}
                        onIncline={() => {
                            // Mobile: NEVER increase quality, only DPR slightly
                            if (isMobile) {
                                setDpr((v) => Math.min(v + 0.03, isAndroid ? 0.75 : 0.9));
                                return;
                            }
                            // Desktop: step up quality
                            setQuality((q) => q === "low" ? "medium" : "high");
                            setDpr((v) => Math.min(v + 0.1, 1.5));
                            declineCountRef.current = 0;
                        }}
                        onDecline={() => {
                            declineCountRef.current++;
                            // Mobile: aggressively drop DPR for stable FPS
                            if (isMobile) {
                                setDpr((v) => Math.max(isAndroid ? 0.35 : 0.45, v - 0.08));
                                return;
                            }
                            // Desktop: step down quality
                            setQuality((q) => q === "high" ? "medium" : "low");
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
