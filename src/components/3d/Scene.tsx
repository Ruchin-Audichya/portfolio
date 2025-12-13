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
    
    // Track FPS for adaptive quality
    const declineCountRef = useRef(0);
    const inclineCountRef = useRef(0);
    
    // Device detection for smart defaults
    const [isAndroid, setIsAndroid] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isWindows, setIsWindows] = useState(false);
    const [gpuTier, setGpuTier] = useState<'high' | 'medium' | 'low'>('medium');
    
    useEffect(() => {
        const ua = navigator.userAgent;
        const mobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(ua);
        const android = /Android/i.test(ua);
        const ios = /iPhone|iPad|iPod/i.test(ua);
        const windows = /Windows/i.test(ua);
        const ipad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        
        setIsMobile(mobile);
        setIsAndroid(android);
        setIsIOS(ios);
        setIsWindows(windows);
        
        // Detect GPU capabilities
        const cores = navigator.hardwareConcurrency || 4;
        const memory = (navigator as any).deviceMemory || 4; // GB
        const pixelRatio = window.devicePixelRatio || 1;
        
        // Determine GPU tier based on device signals
        let tier: 'high' | 'medium' | 'low' = 'medium';
        
        if (ipad) {
            // iPads have good GPUs - medium-high tier
            tier = cores >= 6 ? 'high' : 'medium';
        } else if (ios) {
            // iPhones: newer ones are capable
            tier = cores >= 6 ? 'medium' : 'low';
        } else if (android) {
            // Android: varies widely, check cores and memory
            if (cores >= 8 && memory >= 6) tier = 'medium';
            else if (cores >= 6 && memory >= 4) tier = 'low';
            else tier = 'low';
        } else if (windows) {
            // Windows: check for discrete GPU signals
            // High core count + high memory usually means gaming/workstation
            if (cores >= 8 && memory >= 8) tier = 'high';
            else if (cores >= 4 && memory >= 4) tier = 'medium';
            else tier = 'low'; // Likely iGPU
        } else {
            // Linux/Mac desktop: usually capable
            tier = cores >= 4 ? 'high' : 'medium';
        }
        
        setGpuTier(tier);
        
        // Set initial DPR based on GPU tier and device type
        let deviceRatio: number;
        if (mobile) {
            // Mobile DPR: balance quality and performance
            if (tier === 'high') {
                deviceRatio = Math.min(pixelRatio * 0.7, 1.0); // iPad Pro, flagship phones
            } else if (tier === 'medium') {
                deviceRatio = Math.min(pixelRatio * 0.55, 0.85); // Mid-range
            } else {
                deviceRatio = Math.min(pixelRatio * 0.4, 0.7); // Budget devices
            }
        } else {
            // Desktop DPR
            if (tier === 'high') {
                deviceRatio = Math.min(pixelRatio * 0.85, 1.3);
            } else if (tier === 'medium') {
                deviceRatio = Math.min(pixelRatio * 0.7, 1.0);
            } else {
                deviceRatio = Math.min(pixelRatio * 0.5, 0.8); // iGPU
            }
        }
        setDpr(deviceRatio);

        // Start quality based on GPU tier (not always low)
        if (tier === 'high') {
            setQuality(mobile ? 'medium' : 'high');
        } else if (tier === 'medium') {
            setQuality('medium');
        } else {
            setQuality('low');
        }

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
                    flat={isMobile && gpuTier === 'low'}
                >
                    <PerformanceMonitor
                        ms={400}
                        iterations={3}
                        threshold={0.75}
                        onIncline={() => {
                            inclineCountRef.current++;
                            
                            // Require 2 consecutive inclines before upgrading (stability check)
                            if (inclineCountRef.current < 2) return;
                            inclineCountRef.current = 0;
                            declineCountRef.current = 0;
                            
                            // Mobile: can increase DPR more aggressively now
                            if (isMobile) {
                                const maxDpr = gpuTier === 'high' ? 1.1 : gpuTier === 'medium' ? 0.95 : 0.8;
                                setDpr((v) => Math.min(v + 0.05, maxDpr));
                                // High-tier mobile can also increase quality
                                if (gpuTier === 'high') {
                                    setQuality((q) => q === 'low' ? 'medium' : q);
                                }
                                return;
                            }
                            
                            // Desktop: step up quality then DPR
                            setQuality((q) => {
                                if (q === 'low') return 'medium';
                                if (q === 'medium') return 'high';
                                return q;
                            });
                            const maxDpr = gpuTier === 'high' ? 1.5 : gpuTier === 'medium' ? 1.2 : 1.0;
                            setDpr((v) => Math.min(v + 0.08, maxDpr));
                        }}
                        onDecline={() => {
                            declineCountRef.current++;
                            inclineCountRef.current = 0;
                            
                            // Mobile: drop DPR first, then quality
                            if (isMobile) {
                                const minDpr = gpuTier === 'high' ? 0.6 : gpuTier === 'medium' ? 0.5 : 0.4;
                                if (dpr > minDpr + 0.1) {
                                    setDpr((v) => Math.max(minDpr, v - 0.06));
                                } else {
                                    setQuality((q) => q === 'high' ? 'medium' : 'low');
                                }
                                return;
                            }
                            
                            // Desktop: drop quality first (preserves visual clarity)
                            if (declineCountRef.current >= 2) {
                                setQuality((q) => q === 'high' ? 'medium' : 'low');
                                declineCountRef.current = 0;
                            }
                            const minDpr = gpuTier === 'low' ? 0.6 : 0.7;
                            setDpr((v) => Math.max(minDpr, v - 0.08));
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
