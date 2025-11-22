"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
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
                </Suspense>
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={5}
                    maxDistance={20}
                    minPolarAngle={Math.PI / 6}
                    maxPolarAngle={Math.PI / 2.2}
                    enableDamping={true}
                    dampingFactor={0.05}
                    rotateSpeed={0.6}
                    zoomSpeed={0.8}
                    touches={{
                        ONE: 2, // TOUCH_ROTATE
                        TWO: 1  // TOUCH_DOLLY_PAN
                    }}
                    makeDefault
                />
            </Canvas>
        </div>
    );
}
