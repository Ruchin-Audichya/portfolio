"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

export function Neon999() {
    const groupRef = useRef<THREE.Group>(null);
    const light1Ref = useRef<THREE.PointLight>(null);
    const light2Ref = useRef<THREE.PointLight>(null);
    const light3Ref = useRef<THREE.PointLight>(null);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();

        if (groupRef.current) {
            // Floating animation
            groupRef.current.position.y = 3 + Math.sin(time * 0.5) * 0.3;
            // Gentle rotation
            groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
        }

        // Pulsing neon lights
        const pulse = (Math.sin(time * 2) + 1) * 0.5; // 0 to 1
        const intensity = 3 + pulse * 2;

        if (light1Ref.current) light1Ref.current.intensity = intensity;
        if (light2Ref.current) light2Ref.current.intensity = intensity;
        if (light3Ref.current) light3Ref.current.intensity = intensity;
    });

    return (
        <group ref={groupRef} position={[0, 3, -2]}>
            {/* Clear Neon Text with Premium Look */}
            <Html
                center
                position={[0, 0, 0]}
                transform
                occlude={false}
                style={{
                    pointerEvents: 'none',
                    userSelect: 'none',
                }}
            >
                <div
                    style={{
                        fontSize: '140px',
                        fontWeight: 900,
                        fontFamily: 'Impact, Arial Black, sans-serif',
                        color: '#FFFFFF',
                        textShadow: `
                            0 0 5px #FF10F0,
                            0 0 10px #FF10F0,
                            0 0 15px #FF10F0,
                            0 0 20px #FF10F0,
                            0 0 30px #FF10F0
                        `,
                        letterSpacing: '15px',
                        whiteSpace: 'nowrap',
                        WebkitTextStroke: '2px #FF10F0',
                        animation: 'neonPulse 2s ease-in-out infinite',
                        filter: 'drop-shadow(0 0 10px #FF10F0)',
                    }}
                >
                    999
                </div>
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
            </Html>

            {/* Pulsing Point Lights for Neon Effect */}
            <pointLight
                ref={light1Ref}
                position={[-1.5, 0, 0.5]}
                color="#FF10F0"
                intensity={3}
                distance={10}
                decay={2}
            />
            <pointLight
                ref={light2Ref}
                position={[0, 0, 0.5]}
                color="#FF10F0"
                intensity={3}
                distance={10}
                decay={2}
            />
            <pointLight
                ref={light3Ref}
                position={[1.5, 0, 0.5]}
                color="#FF10F0"
                intensity={3}
                distance={10}
                decay={2}
            />

            {/* Spinning Halo Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[3.5, 0.05, 16, 100]} />
                <meshStandardMaterial
                    color="#FF10F0"
                    emissive="#FF10F0"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>

            {/* Inner Glow Halo */}
            <mesh position={[0, 0, -0.5]}>
                <circleGeometry args={[3, 32]} />
                <meshBasicMaterial
                    color="#FF10F0"
                    transparent
                    opacity={0.15}
                    toneMapped={false}
                />
            </mesh>

            {/* Subtle Particles around 999 */}
            <NeonParticles />
        </group>
    );
}

// Floating particles around the 999
function NeonParticles() {
    const particlesRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        }
    });

    const particleCount = 50;
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
    }, []);

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
                size={0.1}
                color="#FF10F0"
                transparent
                opacity={0.7}
                sizeAttenuation
                toneMapped={false}
            />
        </points>
    );
}
