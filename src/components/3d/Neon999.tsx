"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { usePerf } from "@/lib/three/perf";

export function Neon999() {
    const groupRef = useRef<THREE.Group>(null);
    const light1Ref = useRef<THREE.PointLight>(null);
    const light2Ref = useRef<THREE.PointLight>(null);
    const tier = usePerf((state) => state.tier);

    // Adaptive settings based on performance tier
    const showParticles = tier !== "low";
    const showMultipleLights = tier === "high";
    const lightIntensityMultiplier = tier === "high" ? 1 : tier === "medium" ? 0.7 : 0.5;

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Floating animation (lighter on mobile)
            groupRef.current.position.y = 3 + Math.sin(time * 0.5) * (tier === "low" ? 0.2 : 0.3);
            // Gentle rotation
            groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
        }

        // Pulsing neon lights
        const pulse = (Math.sin(time * 2) + 1) * 0.5; // 0 to 1
        const baseIntensity = 2 * lightIntensityMultiplier;
        const intensity = baseIntensity + pulse * 1.5 * lightIntensityMultiplier;

        if (light1Ref.current) light1Ref.current.intensity = intensity;
        if (showMultipleLights && light2Ref.current) {
            light2Ref.current.intensity = intensity;
        }
    });

    // Adaptive HTML font size
    const fontSize = tier === "low" ? "100px" : tier === "medium" ? "120px" : "140px";

    return (
        <group ref={groupRef} position={[0, 3, -2]}>
            {/* Optimized Neon Text with CSS-based glow */}
            <Html
                center
                position={[0, 0, 0]}
                transform
                occlude={false}
                distanceFactor={tier === "low" ? 10 : 8}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <div
                    style={{
                        fontSize,
                        fontWeight: 900,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#FFFFFF',
                        textShadow: tier === "low"
                            ? `
                                0 0 5px #FF10F0,
                                0 0 10px #FF10F0,
                                0 0 15px #FF10F0
                            `
                            : `
                                0 0 5px #FF10F0,
                                0 0 10px #FF10F0,
                                0 0 15px #FF10F0,
                                0 0 20px #FF10F0,
                                0 0 30px #FF10F0
                            `,
                        letterSpacing: '15px',
                        whiteSpace: 'nowrap',
                        WebkitTextStroke: '2px #FF10F0',
                        animation: tier !== "low" ? 'neonPulse 2s ease-in-out infinite' : 'none',
                        filter: tier !== "low" ? 'drop-shadow(0 0 10px #FF10F0)' : 'none',
                    }}
                >
                    999
                </div>
                {tier !== "low" && (
                    <style>{`
                        @keyframes neonPulse {
                            0%, 100% {
                                text-shadow: 
                                    0 0 5px #FF10F0,
                                    0 0 10px #FF10F0,
                                    0 0 15px #FF10F0,
                                    0 0 20px #FF10F0,
                                    0 0 30px #FF10F0;
                            }
                            50% {
                                text-shadow: 
                                    0 0 3px #FF10F0,
                                    0 0 6px #FF10F0,
                                    0 0 10px #FF10F0,
                                    0 0 15px #FF10F0,
                                    0 0 20px #FF10F0;
                            }
                        }
                    `}</style>
                )}
            </Html>

            {/* Optimized Point Lights - reduced count on lower tiers */}
            <pointLight
                ref={light1Ref}
                position={[0, 0, 0.5]}
                color="#FF10F0"
                intensity={2}
                distance={tier === "low" ? 8 : 10}
                decay={2}
            />

            {/* Additional lights only on high tier */}
            {showMultipleLights && (
                <>
                    <pointLight
                        ref={light2Ref}
                        position={[-1, 0, 0.5]}
                        color="#FF10F0"
                        intensity={1.5}
                        distance={8}
                        decay={2}
                    />
                    <pointLight
                        position={[1, 0, 0.5]}
                        color="#FF10F0"
                        intensity={1.5}
                        distance={8}
                        decay={2}
                    />
                </>
            )}

            {/* Spinning Halo Ring - simpler on low tier */}
            {tier !== "low" && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[3.5, 0.05, tier === "medium" ? 12 : 16, tier === "medium" ? 64 : 100]} />
                    <meshStandardMaterial
                        color="#FF10F0"
                        emissive="#FF10F0"
                        emissiveIntensity={tier === "high" ? 2 : 1.5}
                        toneMapped={false}
                    />
                </mesh>
            )}

            {/* Inner Glow Halo - only on medium/high */}
            {tier !== "low" && (
                <mesh position={[0, 0, -0.5]}>
                    <circleGeometry args={[3, tier === "medium" ? 24 : 32]} />
                    <meshBasicMaterial
                        color="#FF10F0"
                        transparent
                        opacity={tier === "high" ? 0.15 : 0.1}
                        toneMapped={false}
                    />
                </mesh>
            )}

            {/* Particles - only on medium/high tier */}
            {showParticles && <NeonParticles tier={tier} />}
        </group>
    );
}

// Floating particles around the 999
function NeonParticles({ tier }: { tier: "high" | "medium" | "low" }) {
    const particlesRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    // Fewer particles on medium tier
    const particleCount = tier === "high" ? 50 : 30;
    const positions = useMemo(() => {
        const arr = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const radius = 2.5 + Math.random() * 0.5;
            const height = (Math.random() - 0.5) * 2.5;

            arr[i * 3] = Math.cos(angle) * radius;
            arr[i * 3 + 1] = height;
            arr[i * 3 + 2] = Math.sin(angle) * radius;
        }

        return arr;
    }, [particleCount]);

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={tier === "high" ? 0.1 : 0.08}
                color="#FF10F0"
                transparent
                opacity={tier === "high" ? 0.7 : 0.5}
                sizeAttenuation
                toneMapped={false}
            />
        </points>
    );
}
