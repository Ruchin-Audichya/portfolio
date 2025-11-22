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
            {/* Simple Bird Shape */}
            <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <coneGeometry args={[0.05, 0.2, 4]} />
                <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[-0.2, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
                <coneGeometry args={[0.05, 0.2, 4]} />
                <meshStandardMaterial color="#333" />
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
