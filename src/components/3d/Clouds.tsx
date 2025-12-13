"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Reusable cloud geometry and material (created once, shared across all instances)
const cloudGeometry = new THREE.SphereGeometry(0.8, 8, 6);
const cloudMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });

export function Clouds({ count = 3, isNight = false }: { count?: number; isNight: boolean }) {
    const groupRef = useRef<THREE.Group>(null);
    const tickRef = useRef(0);

    // Pre-generate cloud data with fewer puffs per cloud
    const cloudData = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            x: (Math.random() - 0.5) * 20,
            y: 4 + Math.random() * 3,
            z: (Math.random() - 0.5) * 10,
            speed: 0.15 + Math.random() * 0.2,
        }));
    }, [count]);

    // Single useFrame for all clouds, throttled to 12 FPS
    useFrame((_, delta) => {
        if (!groupRef.current || isNight) return;
        tickRef.current += delta;
        if (tickRef.current < 0.083) return; // ~12 FPS
        const step = tickRef.current;
        tickRef.current = 0;

        const children = groupRef.current.children;
        for (let i = 0; i < children.length; i++) {
            const cloud = children[i];
            const data = cloudData[i];
            if (!cloud || !data) continue;
            cloud.position.x += data.speed * step;
            if (cloud.position.x > 15) cloud.position.x = -15;
        }
    });

    if (isNight) return null;

    return (
        <group ref={groupRef}>
            {cloudData.map((data, i) => (
                <group key={i} position={[data.x, data.y, data.z]}>
                    {/* Simplified: 2 puffs per cloud instead of 4 */}
                    <mesh geometry={cloudGeometry} material={cloudMaterial} position={[-0.4, 0, 0]} scale={1.2} />
                    <mesh geometry={cloudGeometry} material={cloudMaterial} position={[0.4, 0.3, 0]} scale={1.1} />
                </group>
            ))}
        </group>
    );
}
