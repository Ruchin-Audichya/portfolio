"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CyclistProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    animated?: boolean;
    speed?: number;
    isNight?: boolean;
}

export default function Cyclist({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    animated = true,
    speed = 1,
    isNight = false,
}: CyclistProps) {
    const wheelRef1 = useRef<THREE.Mesh>(null);
    const wheelRef2 = useRef<THREE.Mesh>(null);
    const legRef1 = useRef<THREE.Group>(null);
    const legRef2 = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (animated) {
            const rotationSpeed = delta * speed * 5;

            // Rotate wheels
            if (wheelRef1.current) wheelRef1.current.rotation.x += rotationSpeed;
            if (wheelRef2.current) wheelRef2.current.rotation.x += rotationSpeed;

            // Animate legs (pedaling)
            const time = state.clock.getElapsedTime() * speed;
            if (legRef1.current) {
                legRef1.current.rotation.x = Math.sin(time * 3) * 0.5;
            }
            if (legRef2.current) {
                legRef2.current.rotation.x = Math.sin(time * 3 + Math.PI) * 0.5;
            }
        }
    });

    const colors = {
        body: "#9D4EDD",
        pants: "#7B2CBF",
        skin: "#E0AAFF",
        bike: "#5A189A",
        wheels: "#240046",
    };

    return (
        <group position={position} rotation={rotation}>
            {/* Bike Frame */}
            <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.8, 0.05, 0.05]} />
                <meshStandardMaterial color={colors.bike} />
            </mesh>
            <mesh position={[0.3, 0.3, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
                <boxGeometry args={[0.5, 0.05, 0.05]} />
                <meshStandardMaterial color={colors.bike} />
            </mesh>

            {/* Wheels */}
            <mesh ref={wheelRef1} position={[-0.4, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.25, 0.04, 6, 8]} />
                <meshStandardMaterial color={colors.wheels} />
            </mesh>
            <mesh ref={wheelRef2} position={[0.4, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
                <torusGeometry args={[0.25, 0.04, 6, 8]} />
                <meshStandardMaterial color={colors.wheels} />
            </mesh>

            {/* Rider Body */}
            <mesh position={[0, 0.85, 0]} castShadow>
                <capsuleGeometry args={[0.15, 0.4, 6, 8]} />
                <meshStandardMaterial color={colors.body} />
            </mesh>

            {/* Head */}
            <mesh position={[0, 1.35, 0]} castShadow>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial color={colors.skin} />
            </mesh>

            {/* Arms */}
            <mesh position={[0.15, 0.8, 0]} rotation={[0, 0, Math.PI / 3]} castShadow>
                <capsuleGeometry args={[0.05, 0.3, 4, 6]} />
                <meshStandardMaterial color={colors.body} />
            </mesh>
            <mesh position={[-0.15, 0.8, 0]} rotation={[0, 0, -Math.PI / 3]} castShadow>
                <capsuleGeometry args={[0.05, 0.3, 4, 6]} />
                <meshStandardMaterial color={colors.body} />
            </mesh>

            {/* Legs (animated) */}
            <group ref={legRef1} position={[0.08, 0.6, 0]}>
                <mesh position={[0, -0.15, 0]} castShadow>
                    <capsuleGeometry args={[0.06, 0.3, 4, 6]} />
                    <meshStandardMaterial color={colors.pants} />
                </mesh>
            </group>
            <group ref={legRef2} position={[-0.08, 0.6, 0]}>
                <mesh position={[0, -0.15, 0]} castShadow>
                    <capsuleGeometry args={[0.06, 0.3, 4, 6]} />
                    <meshStandardMaterial color={colors.pants} />
                </mesh>
            </group>
        </group>
    );
}
