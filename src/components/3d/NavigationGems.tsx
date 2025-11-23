"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

interface NavigationGemProps {
    position: [number, number, number];
    label: string;
    targetSection: string;
    color: string;
}

function NavigationGem({ position, label, targetSection, color }: NavigationGemProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = React.useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
        }
    });

    const handleClick = () => {
        const element = document.getElementById(targetSection);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onClick={handleClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.3 : 1}
            >
                <octahedronGeometry args={[0.5, 0]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0}
                    metalness={0.8}
                    transmission={0.4}
                    thickness={2}
                    emissive={color}
                    emissiveIntensity={hovered ? 1.5 : 0.5}
                />
            </mesh>

            <Html position={[0, -1, 0]} center style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
                <div className={`
                    px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 whitespace-nowrap
                    ${hovered ? "scale-110" : "scale-100"}
                    bg-black/70 border-white/30 text-white font-bold shadow-lg
                `}>
                    <span className="text-sm tracking-wide">{label}</span>
                </div>
            </Html>
        </group>
    );
}

export function NavigationGems() {
    const gems = useMemo(() => [
        { position: [2.5, 1.5, -4] as [number, number, number], label: "Skills", targetSection: "skills", color: "#3B82F6" },
        { position: [-3, 1.5, -2.5] as [number, number, number], label: "Projects", targetSection: "projects", color: "#8B5CF6" },
        { position: [4, 1.5, 1.5] as [number, number, number], label: "Contact", targetSection: "contact", color: "#10B981" },
    ], []);

    return (
        <group>
            {gems.map((gem, i) => (
                <NavigationGem key={i} {...gem} />
            ))}
        </group>
    );
}
