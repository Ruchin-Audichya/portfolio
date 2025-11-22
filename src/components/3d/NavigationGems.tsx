"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
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
                scale={hovered ? 1.2 : 1}
            >
                <octahedronGeometry args={[0.5, 0]} />
                <meshPhysicalMaterial
                    color={color}
                    roughness={0}
                    metalness={0.8}
                    transmission={0.4}
                    thickness={2}
                    emissive={color}
                    emissiveIntensity={hovered ? 1 : 0.5}
                />
            </mesh>
            {hovered && (
                <mesh position={[0, 1, 0]}>
                    <planeGeometry args={[2, 0.5]} />
                    <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
                </mesh>
            )}
        </group>
    );
}

export function NavigationGems() {
    const gems = useMemo(() => [
        { position: [3, 2, -5] as [number, number, number], label: "Skills", targetSection: "skills", color: "#3B82F6" },
        { position: [-4, 2, -3] as [number, number, number], label: "Projects", targetSection: "projects", color: "#8B5CF6" },
        { position: [5, 2, 2] as [number, number, number], label: "Contact", targetSection: "contact", color: "#10B981" },
    ], []);

    return (
        <group>
            {gems.map((gem, i) => (
                <NavigationGem key={i} {...gem} />
            ))}
        </group>
    );
}
