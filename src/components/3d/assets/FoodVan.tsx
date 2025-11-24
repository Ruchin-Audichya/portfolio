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
        body: "#E63946",        // Vibrant red
        accent: "#FFFFFF",      // Clean white
        wheels: "#2B2D42",      // Dark gray/black
        awning: "#F1FAEE",      // Off-white
        window: isNight ? "#FFD60A" : "#457B9D", // Warm light / Blue glass
    };

    return (
        <group position={position} rotation={rotation}>
            {/* Main Van Body */}
            <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 1.2, 1.2]} />
                <meshStandardMaterial
                    color={colors.body}
                    roughness={0.4}
                    metalness={0.1}
                />
            </mesh>

            {/* Cabin */}
            <mesh position={[-0.7, 0.9, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.6, 0.8, 1.2]} />
                <meshStandardMaterial
                    color={colors.accent}
                    roughness={0.3}
                    metalness={0.2}
                />
            </mesh>

            {/* Serving Window */}
            <mesh position={[0.3, 0.7, 0.61]} castShadow>
                <boxGeometry args={[0.8, 0.5, 0.02]} />
                <meshStandardMaterial
                    color={colors.window}
                    emissive={isNight ? "#FFD60A" : "#000000"}
                    emissiveIntensity={isNight ? 0.8 : 0}
                    roughness={0.1}
                    metalness={0.5}
                />
            </mesh>

            {/* Window Frame */}
            <mesh position={[0.3, 0.7, 0.62]} castShadow>
                <boxGeometry args={[0.85, 0.55, 0.01]} />
                <meshStandardMaterial color="#2B2D42" />
            </mesh>

            {/* Awning */}
            <mesh position={[0.3, 1.3, 0.7]} castShadow>
                <boxGeometry args={[1, 0.05, 0.4]} />
                <meshStandardMaterial
                    color={colors.awning}
                    roughness={0.8}
                />
            </mesh>

            {/* Wheels - Optimized poly count */}
            <mesh position={[-0.6, 0.2, 0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
                <meshStandardMaterial
                    color={colors.wheels}
                    roughness={0.7}
                    metalness={0.3}
                />
            </mesh>
            <mesh position={[-0.6, 0.2, -0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
                <meshStandardMaterial color={colors.wheels} roughness={0.7} metalness={0.3} />
            </mesh>
            <mesh position={[0.6, 0.2, 0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
                <meshStandardMaterial color={colors.wheels} roughness={0.7} metalness={0.3} />
            </mesh>
            <mesh position={[0.6, 0.2, -0.7]} castShadow rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.2, 0.2, 0.1, 12]} />
                <meshStandardMaterial color={colors.wheels} roughness={0.7} metalness={0.3} />
            </mesh>

            {/* Top Sign/Menu Board */}
            <mesh position={[0.5, 1.5, 0]} castShadow>
                <boxGeometry args={[0.8, 0.3, 0.05]} />
                <meshStandardMaterial
                    color="#2B2D42"
                    roughness={0.3}
                />
            </mesh>

            {/* Night mode lights */}
            {isNight && (
                <>
                    <pointLight position={[0.3, 0.7, 0.8]} intensity={2} distance={4} color="#FFD60A" />
                    <pointLight position={[0.5, 1.5, 0.2]} intensity={1} distance={3} color="#FFFFFF" />
                </>
            )}
        </group>
    );
}
