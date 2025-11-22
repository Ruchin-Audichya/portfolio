"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { PerformanceMonitor } from "@react-three/drei";
import World from "./World";

interface SceneProps {
    onNodeClick?: (id: any) => void;
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
            </Canvas>
        </div>
    );
}
