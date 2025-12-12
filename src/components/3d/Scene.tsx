"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { PerformanceMonitor, Preload } from "@react-three/drei";
import { RuchinWorld } from "./RuchinWorld";
import { LoadingProgress } from "@/components/ui/LoadingProgress";

interface SceneProps {
    onNodeClick?: (id: any) => void;
    scrollProgress?: number;
}

function ResponsiveCamera() {
    const { camera, size } = useThree();

    useEffect(() => {
        const isMobile = size.width < 768;
        const targetZ = isMobile ? 24 : 18; // Pull back on load for wider POV
        const targetY = isMobile ? 6.5 : 4.5;

        camera.position.set(0, targetY, targetZ);
        camera.updateProjectionMatrix();
    }, [camera, size]);

    return null;
}

export default function Scene({ onNodeClick, scrollProgress = 0 }: SceneProps) {
    const [dpr, setDpr] = useState(1.25);
    const [webglSupported, setWebglSupported] = useState(true);
    useEffect(() => {
        const isMobile = window.innerWidth < 768;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.1 : 1.5);
        setDpr(pixelRatio);

        try {
            const canvas = document.createElement("canvas");
            const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            setWebglSupported(!!gl);
        } catch {
            setWebglSupported(false);
        }
    }, []);

    return (
        <div className="h-screen w-full absolute inset-0 z-0 select-none" id="hero-canvas" style={{ touchAction: "none", userSelect: "none" }}>
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
            <Canvas
                shadows
                dpr={dpr}
                // frameloop="demand" removed for smooth day/night transitions
                camera={{ position: [0, 5, 18], fov: 45 }}
                gl={{
                    antialias: true,
                    powerPreference: "high-performance",
                    alpha: false,
                    stencil: false,
                    depth: true
                }}
            >
                <PerformanceMonitor onIncline={() => setDpr((v) => Math.min(v + 0.25, 1.5))} onDecline={() => setDpr((v) => Math.max(1, v - 0.25))} />
                <ResponsiveCamera />
                <Suspense fallback={<LoadingProgress />}>
                    <RuchinWorld onNodeClick={onNodeClick} scrollProgress={scrollProgress} />
                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
