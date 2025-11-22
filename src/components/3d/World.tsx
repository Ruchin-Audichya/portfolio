"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Sun, Moon } from "lucide-react";
import { Trees, SceneElements } from "./Elements";
import { LoadingProgress } from "./LoadingProgress";
import { Particles } from "./Particles";
import { Clouds } from "./Clouds";
import { Birds } from "./Birds";

interface WorldProps {
    onNodeClick?: (id: any) => void;
}

export default function World({ onNodeClick }: WorldProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [isNight, setIsNight] = useState(false);
    const isManualRef = useRef(false);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Continuous slow rotation
            groupRef.current.rotation.y += delta * 0.05;

            // Check rotation for Day/Night cycle (simple logic)
            // Only update if not manually overridden
            if (!isManualRef.current) {
                const rotationY = groupRef.current.rotation.y % (Math.PI * 2);
                if (rotationY > Math.PI && !isNight) setIsNight(true);
                if (rotationY <= Math.PI && isNight) setIsNight(false);
            }
        }
    });

    const toggleTheme = () => {
        setIsNight((prev) => !prev);
        isManualRef.current = true;
    };

    // Keyboard shortcut 'N'
    useState(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key.toLowerCase() === 'n') {
                toggleTheme();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    return (
        <>
            <LoadingProgress />

            {/* UI Controls - Mobile Friendly */}
            <Html position={[0, 0, 0]} fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
                <div className="absolute bottom-6 right-6 pointer-events-auto z-50">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-white hover:bg-white/20 transition-all active:scale-95"
                        aria-label={isNight ? "Switch to Day Mode" : "Switch to Night Mode"}
                    >
                        {isNight ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </button>
                </div>
            </Html>

            {/* Lighting changes based on Day/Night with purple/blue theme */}
            <ambientLight intensity={isNight ? 0.3 : 0.7} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={isNight ? 0.2 : 1.2}
                color={isNight ? "#C77DFF" : "#E0AAFF"}
                castShadow
            />
            {isNight && <pointLight position={[0, 5, 0]} intensity={1.5} color="#9D4EDD" distance={15} />}

            {/* The Rotating World */}
            <group ref={groupRef} position={[0, -2, 0]}>
                {/* Ground - Purple/Blue palette */}
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[10, 64]} />
                    <meshStandardMaterial color={isNight ? "#240046" : "#7B2CBF"} />
                </mesh>

                {/* Elements */}
                <Trees count={20} radius={9} isNight={isNight} />
                <SceneElements isNight={isNight} />
            </group>

            {/* Background Color - Purple/Blue gradient */}
            <color attach="background" args={[isNight ? "#10002B" : "#C77DFF"]} />

            {/* Fog for depth */}
            <fog attach="fog" args={[isNight ? "#10002B" : "#E0AAFF", 10, 30]} />

            {/* Ambient Particles (Fireflies/Stars) */}
            <Particles count={isNight ? 150 : 0} isNight={isNight} />

            {/* Day Clouds */}
            <Clouds count={8} isNight={isNight} />

            {/* Day Birds */}
            <Birds count={5} isNight={isNight} />
        </>
    );
}
