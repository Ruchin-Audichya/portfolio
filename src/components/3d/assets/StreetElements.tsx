"use client";

import * as THREE from "three";

interface BenchProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
}

export function Bench({ position = [0, 0, 0], rotation = [0, 0, 0] }: BenchProps) {
    const colors = {
        wood: "#7B2CBF",
        metal: "#5A189A",
    };

    return (
        <group position={position} rotation={rotation}>
            {/* Seat slats */}
            <mesh position={[0, 0.35, 0]} castShadow>
                <boxGeometry args={[1, 0.05, 0.3]} />
                <meshStandardMaterial color={colors.wood} />
            </mesh>
            <mesh position={[0, 0.42, 0]} castShadow>
                <boxGeometry args={[1, 0.05, 0.3]} />
                <meshStandardMaterial color={colors.wood} />
            </mesh>

            {/* Backrest */}
            <mesh position={[0, 0.6, -0.12]} castShadow>
                <boxGeometry args={[1, 0.3, 0.05]} />
                <meshStandardMaterial color={colors.wood} />
            </mesh>

            {/* Legs */}
            <mesh position={[-0.4, 0.17, 0.1]} castShadow>
                <boxGeometry args={[0.05, 0.35, 0.05]} />
                <meshStandardMaterial color={colors.metal} />
            </mesh>
            <mesh position={[0.4, 0.17, 0.1]} castShadow>
                <boxGeometry args={[0.05, 0.35, 0.05]} />
                <meshStandardMaterial color={colors.metal} />
            </mesh>
            <mesh position={[-0.4, 0.17, -0.1]} castShadow>
                <boxGeometry args={[0.05, 0.35, 0.05]} />
                <meshStandardMaterial color={colors.metal} />
            </mesh>
            <mesh position={[0.4, 0.17, -0.1]} castShadow>
                <boxGeometry args={[0.05, 0.35, 0.05]} />
                <meshStandardMaterial color={colors.metal} />
            </mesh>
        </group>
    );
}

interface LampPostProps {
    position?: [number, number, number];
    isNight?: boolean;
}

export function LampPost({ position = [0, 0, 0], isNight = false }: LampPostProps) {
    const colors = {
        pole: "#5A189A",
        light: "#FFD700",
    };

    return (
        <group position={position}>
            {/* Pole */}
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
                <meshStandardMaterial color={colors.pole} />
            </mesh>

            {/* Light fixture */}
            <mesh position={[0, 2.1, 0]} castShadow>
                <coneGeometry args={[0.2, 0.3, 8]} />
                <meshStandardMaterial
                    color={colors.light}
                    emissive={isNight ? colors.light : "#000000"}
                    emissiveIntensity={isNight ? 0.8 : 0}
                />
            </mesh>

            {/* Light glow */}
            {isNight && (
                <pointLight position={[0, 2, 0]} intensity={2} distance={5} color={colors.light} />
            )}

            {/* Base */}
            <mesh position={[0, 0.05, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.1, 8]} />
                <meshStandardMaterial color={colors.pole} />
            </mesh>
        </group>
    );
}

interface SignPostProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    text?: string;
}

export function SignPost({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    text = "PROJECT"
}: SignPostProps) {
    const colors = {
        pole: "#5A189A",
        sign: "#9D4EDD",
        text: "#E0AAFF",
    };

    return (
        <group position={position} rotation={rotation}>
            {/* Pole */}
            <mesh position={[0, 0.6, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
                <meshStandardMaterial color={colors.pole} />
            </mesh>

            {/* Sign board */}
            <mesh position={[0, 1.3, 0]} castShadow>
                <boxGeometry args={[0.8, 0.3, 0.05]} />
                <meshStandardMaterial color={colors.sign} />
            </mesh>

            {/* Text placeholder (simple rectangles) */}
            <mesh position={[0, 1.3, 0.03]} castShadow>
                <boxGeometry args={[0.6, 0.15, 0.01]} />
                <meshStandardMaterial color={colors.text} />
            </mesh>
        </group>
    );
}
