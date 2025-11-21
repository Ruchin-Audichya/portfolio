"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import World from "./World";

export default function Scene() {
    return (
        <div className="h-screen w-full absolute inset-0 z-0">
            <Canvas shadows camera={{ position: [0, 2, 10], fov: 45 }}>
                <Suspense fallback={null}>
                    <World />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
}
