"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import World from "./World";

interface SceneProps {
    onNodeClick?: (id: any) => void;
}

// Safe wrapper for EffectComposer that only renders when WebGL context is ready
function SafeEffectComposer({ children }: { children: React.ReactNode }) {
    const { gl, scene, camera } = useThree();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Wait for next frame to ensure WebGL context is fully initialized
        const timer = requestAnimationFrame(() => {
            if (gl && gl.domElement && scene && camera) {
                setIsReady(true);
            }
        });
        return () => cancelAnimationFrame(timer);
    }, [gl, scene, camera]);

    if (!isReady || !gl?.domElement) return null;

    return <EffectComposer multisampling={0}>{children}</EffectComposer>;
}

export default function Scene({ onNodeClick }: SceneProps) {
    const [dpr, setDpr] = useState(1.5);
    const [isReady, setIsReady] = useState(false);

    // Delay rendering to ensure DOM is ready after transition
    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady) return <div className="h-screen w-full absolute inset-0 z-0 bg-gradient-to-b from-sky-400 to-sky-200" />;

    return (
        <div className="h-screen w-full absolute inset-0 z-0">
            <Canvas
                shadows
                dpr={dpr}
                camera={{ position: [0, 2, 10], fov: 45 }}
                gl={{
                    antialias: false,
                    powerPreference: "high-performance",
                    preserveDrawingBuffer: true
                }}
            >
                <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />

                <Suspense fallback={null}>
                    <World onNodeClick={onNodeClick} />
                </Suspense>

                {/* Post Processing Effects with Safe Wrapper */}
                <SafeEffectComposer>
                    <Bloom
                        luminanceThreshold={0.8}
                        mipmapBlur
                        intensity={1.2}
                        radius={0.4}
                    />
                    <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </SafeEffectComposer>
            </Canvas>
        </div>
    );
}
