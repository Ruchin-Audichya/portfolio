"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import World from "./World";

interface SceneProps {
    onNodeClick?: (id: any) => void;
}

export default function Scene({ onNodeClick }: SceneProps) {
    const [dpr, setDpr] = useState(1.5); // Default DPR

    return (
        <div className="h-screen w-full absolute inset-0 z-0">
            <Canvas
                shadows
                dpr={dpr}
                camera={{ position: [0, 2, 10], fov: 45 }}
                gl={{ antialias: false, powerPreference: "high-performance" }}
            >
                {/* Performance Monitor to adjust quality dynamically */}
                <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />

                <Suspense fallback={null}>
                    <World onNodeClick={onNodeClick} />
                </Suspense>

                {/* Post Processing Effects - Optimized for Mobile */}
                <EffectComposer multisampling={0}>
                    <Bloom
                        luminanceThreshold={0.8}
                        mipmapBlur
                        intensity={1.2}
                        radius={0.4}
                    />
                    <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
                    <Vignette eskil={false} offset={0.1} darkness={0.5} />
                </EffectComposer>
            </Canvas>
        </div>
    );
}
