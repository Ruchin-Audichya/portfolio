"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import World from "./World";

interface SceneProps {
    onNodeClick?: (id: any) => void;
}

export default function Scene({ onNodeClick }: SceneProps) {
    return (
        <div className="h-screen w-full absolute inset-0 z-0">
            <Canvas shadows camera={{ position: [0, 2, 10], fov: 45 }}>
                <Suspense fallback={null}>
                    <World onNodeClick={onNodeClick} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
