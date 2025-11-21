"use client";

import * as THREE from "three";

interface FoodVanProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    isNight?: boolean;
}

export default function FoodVan({
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    isNight = false,
}: FoodVanProps) {
    const colors = {
        body: "#7B2CBF",
        accent: "#C77DFF",
        wheels: "#240046",
        awning: "#9D4EDD",
        window: isNight ? "#FFD700" : "#E0AAFF",
    };

    return (
        <group position={position} rotation={rotation}>
            {/* Main Van Body */}
            <mesh position={[0, 0.6, 0]} castShadow>
                <boxGeometry args={[2, 1.2, 1.2]} />
                <meshStandardMaterial color={colors.body} />
            </mesh>

            {/* Cabin */}
            <mesh position={[-0.7, 0.9, 0]} castShadow>
                <boxGeometry args={[0.6, 0.8, 1.2]} />
                <meshStandardMaterial color={colors.accent} />
            </mesh>

            {/* Serving Window */}
            <mesh position={[0.3, 0.7, 0.61]} castShadow>
                <boxGeometry args={[0.8, 0.5, 0.02]} />
                <meshStandardMaterial
                    color={colors.window}
                    emissive={isNight ? "#FFD700" : "#000000"}
                    emissiveIntensity={isNight ? 0.5 : 0}
                />
            </mesh>

            {/* Awning */}
            <mesh position={[0.3, 1.3, 0.7]} castShadow>
                <boxGeometry args={[1, 0.05, 0.4]} />
                <meshStandardMaterial color={colors.awning} />
            </mesh>

            {/* Wheels */}
            <mesh position={[-0.6, 0.2, 0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
                <meshStandardMaterial color={colors.wheels} />
            </mesh>
            <mesh position={[-0.6, 0.2, -0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
                <meshStandardMaterial color={colors.wheels} />
            </mesh>
            <mesh position={[0.6, 0.2, 0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
                <meshStandardMaterial color={colors.wheels} />
            </mesh>
            <mesh position={[0.6, 0.2, -0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
                <meshStandardMaterial color={colors.wheels} />
            </mesh>

            {/* Top Sign/Menu Board */}
            <mesh position={[0.5, 1.5, 0]} castShadow>
                <boxGeometry args={[0.8, 0.3, 0.05]} />
                <meshStandardMaterial color={colors.accent} />
            </mesh>

            {/* Night mode lights */}
            {isNight && (
                <>
                    <pointLight position={[0.3, 0.7, 0.8]} intensity={1} distance={3} color="#FFD700" />
                    <pointLight position={[0.5, 1.5, 0.2]} intensity={0.5} distance={2} color="#C77DFF" />
                </>
            )}
        </group>
    );
}
