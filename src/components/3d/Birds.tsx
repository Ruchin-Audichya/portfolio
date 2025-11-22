"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Bird({ position, speed, factor }: { position: [number, number, number]; speed: number; factor: number }) {
    const ref = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (ref.current) {
            const t = state.clock.elapsedTime * speed + factor;
            ref.current.position.y = position[1] + Math.sin(t) * 0.5;
            ref.current.rotation.z = Math.sin(t * 2) * 0.1;

            // Circular motion
            ref.current.position.x = position[0] + Math.cos(t * 0.5) * 5;
            ref.current.position.z = position[2] + Math.sin(t * 0.5) * 5;

            // Face direction of movement
            ref.current.rotation.y = -t * 0.5 + Math.PI / 2;
        }
    });

    return (
        <group ref={ref} position={position}>
            {/* Bird Body */}
            <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshStandardMaterial color="#1A1A1A" roughness={0.6} />
            </mesh>

            {/* Left Wing - Smoother */}
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <coneGeometry args={[0.06, 0.25, 8]} />
                <meshStandardMaterial color="#2B2B2B" roughness={0.5} />
            </mesh>

            {/* Right Wing - Smoother */}
            <mesh position={[0.15, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <coneGeometry args={[0.06, 0.25, 8]} />
                <meshStandardMaterial color="#2B2B2B" roughness={0.5} />
            </mesh>

            {/* Beak */}
            <mesh position={[0, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
                <coneGeometry args={[0.02, 0.06, 6]} />
                <meshStandardMaterial color="#FFA500" roughness={0.4} />
            </mesh>
        </group>
    );
}

export function Birds({ count = 5, isNight = false }: { count?: number; isNight: boolean }) {
    const birds = useMemo(() => {
        return new Array(count).fill(0).map((_, i) => ({
            position: [0, 6 + Math.random() * 2, 0] as [number, number, number],
            speed: 0.5 + Math.random() * 0.5,
            factor: i * 2
        }));
    }, [count]);

    if (isNight) return null;

    return (
        <group>
            {birds.map((bird, i) => (
                <Bird key={i} position={bird.position} speed={bird.speed} factor={bird.factor} />
            ))}
        </group>
    );
}
