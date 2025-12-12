"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// --- Materials ---
const materials = {
    tree: new THREE.MeshStandardMaterial({ color: "#4c1d95", roughness: 0.8 }),
    treeSnow: new THREE.MeshStandardMaterial({ color: "#a78bfa", roughness: 1 }),
    truckBodyMain: new THREE.MeshStandardMaterial({ color: "#1b9aaa", roughness: 0.35 }),
    truckBodyAccent: new THREE.MeshStandardMaterial({ color: "#f97316", roughness: 0.35 }),
    truckDetail: new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.4 }),
    truckGlass: new THREE.MeshPhysicalMaterial({ color: "#8fd6ff", transmission: 0.8, opacity: 0.3, transparent: true, roughness: 0.05, metalness: 0 }),
    stageTruss: new THREE.MeshStandardMaterial({ color: "#e2e8f0", metalness: 0.8, roughness: 0.2 }),
    stageFloor: new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.8 }),
    skin: new THREE.MeshStandardMaterial({ color: "#fdba74", roughness: 0.5 }),
    clothes: new THREE.MeshStandardMaterial({ color: "#3b82f6", roughness: 0.6 }),
    building: new THREE.MeshStandardMaterial({ color: "#334155", roughness: 0.2, metalness: 0.1 }),
    windowOff: new THREE.MeshStandardMaterial({ color: "#1e293b" }),
    windowOn: new THREE.MeshStandardMaterial({ color: "#fbbf24", emissive: "#fbbf24", emissiveIntensity: 2.6 }),
    lampPost: new THREE.MeshStandardMaterial({ color: "#0f172a", metalness: 0.6, roughness: 0.4 }),
    lampLight: new THREE.MeshStandardMaterial({ color: "#fffbeb", emissive: "#fffbeb", emissiveIntensity: 4 }),
    neonPink: new THREE.MeshStandardMaterial({ color: "#ff00ff", emissive: "#ff00ff", emissiveIntensity: 2, toneMapped: false }),
    neonCyan: new THREE.MeshStandardMaterial({ color: "#00ffff", emissive: "#00ffff", emissiveIntensity: 2, toneMapped: false }),
    neonYellow: new THREE.MeshStandardMaterial({ color: "#ffff00", emissive: "#ffff00", emissiveIntensity: 2, toneMapped: false }),
    neonBlue: new THREE.MeshStandardMaterial({ color: "#3b82f6", emissive: "#3b82f6", emissiveIntensity: 2, toneMapped: false }),
    neonRed: new THREE.MeshStandardMaterial({ color: "#ff2d55", emissive: "#ff2d55", emissiveIntensity: 2, toneMapped: false }),
    neonAmber: new THREE.MeshStandardMaterial({ color: "#fbbf24", emissive: "#fbbf24", emissiveIntensity: 2, toneMapped: false }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#88ccff", transmission: 0.9, opacity: 0.3, transparent: true, roughness: 0, metalness: 0 }),
    dinerWall: new THREE.MeshStandardMaterial({ color: "#1e1b4b", roughness: 0.2 }),
    cafeBody: new THREE.MeshStandardMaterial({ color: "#0ea5e9", roughness: 0.35, metalness: 0.1 }),
    cafeAccent: new THREE.MeshStandardMaterial({ color: "#a855f7", roughness: 0.4, metalness: 0.2 }),
    cyberBody: new THREE.MeshStandardMaterial({ color: "#0b1224", metalness: 0.65, roughness: 0.25 }),
    cyberGlass: new THREE.MeshPhysicalMaterial({ color: "#22d3ee", transmission: 0.85, opacity: 0.35, transparent: true, roughness: 0.15, metalness: 0.2 }),
};

// --- Components ---

export function LowPolyTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.4, 1, 6]} />
                <meshStandardMaterial color="#4c1d95" />
            </mesh>
            {/* Layers */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[1.2, 2, 6]} />
                <primitive object={materials.tree} />
            </mesh>
            <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[1, 1.8, 6]} />
                <primitive object={materials.tree} />
            </mesh>
            <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[0.8, 1.5, 6]} />
                <primitive object={materials.tree} />
            </mesh>
            {/* Snow Caps (slightly larger/offset) */}
            <mesh position={[0, 1.6, 0]} scale={[1.05, 0.2, 1.05]}>
                <coneGeometry args={[1.2, 2, 6]} />
                <primitive object={materials.treeSnow} />
            </mesh>
        </group>
    );
}

export function NeonFoodTruck({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Wheels */}
            {[[-0.9, 0.35, 1.6], [0.9, 0.35, 1.6], [-0.9, 0.35, -1.6], [0.9, 0.35, -1.6]].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]} castShadow>
                    <torusGeometry args={[0.35, 0.09, 12, 24]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
                </mesh>
            ))}

            {/* Main Body */}
            <mesh position={[0, 1.4, 0]} castShadow>
                <boxGeometry args={[2.6, 2.4, 4]} />
                <primitive object={materials.truckBodyMain} />
            </mesh>
            <mesh position={[0, 1.2, 1.4]} castShadow>
                <boxGeometry args={[2.4, 2.0, 1.2]} />
                <primitive object={materials.truckBodyAccent} />
            </mesh>

            {/* Windows */}
            <mesh position={[0, 1.6, 2.1]}>
                <planeGeometry args={[2.2, 1.1]} />
                <primitive object={materials.truckGlass} />
            </mesh>
            <mesh position={[0.9, 1.2, 2.05]}>
                <planeGeometry args={[0.5, 0.6]} />
                <primitive object={materials.truckGlass} />
            </mesh>

            {/* Awning */}
            <group position={[-1.35, 2, 0.6]} rotation={[0, 0, -0.2]}>
                <mesh>
                    <boxGeometry args={[0.15, 1.8, 3.2]} />
                    <primitive object={materials.truckDetail} />
                </mesh>
                {Array.from({ length: 6 }).map((_, i) => (
                    <mesh key={i} position={[0.12, 0.7 - i * 0.28, 0]}>
                        <boxGeometry args={[0.06, 0.24, 3.2]} />
                        <meshStandardMaterial color={i % 2 === 0 ? "#f97316" : "#fbbf24"} />
                    </mesh>
                ))}
            </group>

            {/* Service Window */}
            <group position={[-1.3, 1.3, 0]}>
                <mesh position={[0, 0.2, 0]}>
                    <planeGeometry args={[0.05, 1.6]} />
                    <primitive object={materials.truckDetail} />
                </mesh>
                <mesh position={[0.05, 0, 0]}>
                    <planeGeometry args={[0.05, 1.6]} />
                    <primitive object={materials.neonCyan} />
                </mesh>
                <mesh position={[0.07, 0, 0]}>
                    <planeGeometry args={[0.01, 1.6]} />
                    <primitive object={materials.neonPink} />
                </mesh>
                <Text position={[0.2, 0.5, 0]} fontSize={0.35} color="#0f172a" anchorX="left" anchorY="middle">TACOS</Text>
            </group>

            {/* Roof topper */}
            <group position={[0, 2.7, 0]}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[2.2, 0.4, 2.5]} />
                    <meshStandardMaterial color="#fde68a" />
                </mesh>
                <mesh position={[0, 0.5, 0]}>
                    <boxGeometry args={[1.6, 0.4, 1.8]} />
                    <meshStandardMaterial color="#ef4444" />
                </mesh>
                <mesh position={[0, 0.9, 0]}>
                    <boxGeometry args={[1.2, 0.3, 1.2]} />
                    <meshStandardMaterial color="#22c55e" />
                </mesh>
            </group>

            {/* Neon outline */}
            <mesh position={[0, 1.4, -2.05]}>
                <boxGeometry args={[2.6, 2.4, 0.08]} />
                <primitive object={materials.neonPink} />
            </mesh>

            {/* Front lights */}
            <mesh position={[0.8, 0.9, 2.05]}>
                <boxGeometry args={[0.4, 0.25, 0.1]} />
                <primitive object={materials.neonAmber} />
            </mesh>
            <mesh position={[-0.8, 0.9, 2.05]}>
                <boxGeometry args={[0.4, 0.25, 0.1]} />
                <primitive object={materials.neonAmber} />
            </mesh>

            <pointLight position={[0, 2, 0]} intensity={isNight ? 2.5 : 1.2} distance={isNight ? 7 : 4} color="#f97316" />
        </group>
    );
}

export function NeonGarage({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number]; }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Roof outline */}
            <mesh position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.05, 0.05, 5]} />
                <primitive object={materials.neonPink} />
            </mesh>
            <mesh position={[0, 2.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <cylinderGeometry args={[0.05, 0.05, 5]} />
                <primitive object={materials.neonPink} />
            </mesh>
            <mesh position={[0, 1.6, 0]}>
                <boxGeometry args={[5, 0.1, 0.1]} />
                <primitive object={materials.neonPink} />
            </mesh>

            {/* Pillars */}
            <mesh position={[2.4, 1.25, 0]}>
                <boxGeometry args={[0.15, 2.5, 0.15]} />
                <primitive object={materials.neonAmber} />
            </mesh>
            <mesh position={[-2.4, 1.25, 0]}>
                <boxGeometry args={[0.15, 2.5, 0.15]} />
                <primitive object={materials.neonAmber} />
            </mesh>

            {/* Car silhouette */}
            <group position={[0, 0.6, 0]}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[3.8, 0.4, 1.2]} />
                    <primitive object={materials.neonBlue} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[3.4, 0.4, 1]} />
                    <primitive object={materials.neonBlue} />
                </mesh>
                <mesh position={[0, 1.2, 0]}>
                    <boxGeometry args={[2.6, 0.4, 0.9]} />
                    <primitive object={materials.neonBlue} />
                </mesh>
                <mesh position={[1.6, 0.6, 0]}>
                    <boxGeometry args={[0.5, 0.4, 0.9]} />
                    <primitive object={materials.neonAmber} />
                </mesh>
                <mesh position={[-1.6, 0.6, 0]}>
                    <boxGeometry args={[0.5, 0.4, 0.9]} />
                    <primitive object={materials.neonAmber} />
                </mesh>
                <mesh position={[1.2, 0.2, 0]}>
                    <torusGeometry args={[0.45, 0.08, 12, 24]} />
                    <primitive object={materials.neonYellow} />
                </mesh>
                <mesh position={[-1.2, 0.2, 0]}>
                    <torusGeometry args={[0.45, 0.08, 12, 24]} />
                    <primitive object={materials.neonYellow} />
                </mesh>
            </group>
        </group>
    );
}

export function NeonDiner({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Main Structure */}
            <mesh position={[0, 1.5, 0]} castShadow>
                <boxGeometry args={[6, 3, 4]} />
                <primitive object={materials.dinerWall} />
            </mesh>

            {/* Large Window */}
            <mesh position={[0, 1.5, 2.05]}>
                <planeGeometry args={[5, 2]} />
                <primitive object={materials.glass} />
            </mesh>

            {/* Interior (Visible through window) */}
            <group position={[0, 0.5, 1]}>
                <mesh position={[-1.5, 0.5, 0]}>
                    <boxGeometry args={[1, 0.8, 1]} />
                    <meshStandardMaterial color="#ef4444" />
                </mesh>
                <mesh position={[1.5, 0.5, 0]}>
                    <boxGeometry args={[1, 0.8, 1]} />
                    <meshStandardMaterial color="#ef4444" />
                </mesh>
                <mesh position={[0, 0.6, 0]}>
                    <cylinderGeometry args={[0.8, 0.8, 0.1]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>
            </group>

            {/* Roof Neon */}
            <mesh position={[0, 3, 2]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 6]} />
                <primitive object={materials.neonPink} />
            </mesh>

            {/* Main Sign */}
            <group position={[0, 3.8, 0]}>
                <Text
                    position={[0, 0, 0]}
                    fontSize={0.8}
                    color="#ff00ff"
                    anchorX="center"
                    anchorY="middle"
                >
                    NEON DINER
                </Text>
                {/* Glow effect backing */}
                <pointLight position={[0, 0, 1]} intensity={isNight ? 2 : 0} color="#ff00ff" distance={5} />
            </group>

            {/* Window Signs */}
            <group position={[0, 2, 2.1]}>
                <Text position={[-1.5, 0, 0]} fontSize={0.3} color="#00ffff">BURGERS</Text>
                <Text position={[0, 0, 0]} fontSize={0.3} color="#ffff00">FRIES</Text>
                <Text position={[1.5, 0, 0]} fontSize={0.3} color="#ff00ff">SHAKES</Text>
            </group>

            {/* Interior Light */}
            {isNight && (
                <pointLight position={[0, 2, 0]} intensity={1.5} distance={8} color="#ffaa00" />
            )}
        </group>
    );
}

export function Stage({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Platform */}
            <mesh position={[0, 0.5, 0]} receiveShadow>
                <boxGeometry args={[6, 1, 4]} />
                <primitive object={materials.stageFloor} />
            </mesh>
            {/* Truss Pillars */}
            <mesh position={[-2.8, 3, -1.8]}>
                <boxGeometry args={[0.2, 6, 0.2]} />
                <primitive object={materials.stageTruss} />
            </mesh>
            <mesh position={[2.8, 3, -1.8]}>
                <boxGeometry args={[0.2, 6, 0.2]} />
                <primitive object={materials.stageTruss} />
            </mesh>
            {/* Top Truss */}
            <mesh position={[0, 5.9, -1.8]}>
                <boxGeometry args={[6, 0.2, 0.2]} />
                <primitive object={materials.stageTruss} />
            </mesh>
            {/* Screen/Backdrop */}
            <mesh position={[0, 3, -1.9]}>
                <planeGeometry args={[5.5, 4]} />
                <meshBasicMaterial color="#000" />
            </mesh>
            {/* Stage Lights */}
            <group position={[0, 5.8, -1.8]}>
                <pointLight position={[-2, -0.5, 0.5]} intensity={isNight ? 2 : 0} distance={8} color="#ec4899" />
                <pointLight position={[0, -0.5, 0.5]} intensity={isNight ? 2 : 0} distance={8} color="#8b5cf6" />
                <pointLight position={[2, -0.5, 0.5]} intensity={isNight ? 2 : 0} distance={8} color="#3b82f6" />
            </group>
        </group>
    );
}

export function CloudCafe({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[4.2, 1.6, 3.2]} />
                <primitive object={materials.cafeBody} />
            </mesh>
            <mesh position={[0, 1.9, 0]}>
                <boxGeometry args={[3.8, 0.4, 2.8]} />
                <primitive object={materials.cafeAccent} />
            </mesh>
            <group position={[0, 2.5, 0]}>
                {[-1.2, 0, 1.2].map((x, idx) => (
                    <mesh key={idx} position={[x, 0, 0]}>
                        <sphereGeometry args={[1.1, 16, 16]} />
                        <meshStandardMaterial color="#e5e7eb" />
                    </mesh>
                ))}
                <mesh position={[0, 0.2, 0]} scale={[1.8, 0.6, 1.2]}>
                    <sphereGeometry args={[1.2, 16, 16]} />
                    <meshStandardMaterial color="#f8fafc" />
                </mesh>
            </group>
            <Text position={[0, 1.4, 1.7]} fontSize={0.35} color="#0f172a" anchorX="center" anchorY="middle">
                CLOUD CAFE
            </Text>
            <Text position={[0, 1.0, -1.7]} fontSize={0.25} color="#0ea5e9" anchorX="center" anchorY="middle">
                WiFi + Espresso
            </Text>
            {isNight && <pointLight position={[0, 2.6, 0]} intensity={2.4} distance={9} color="#38bdf8" />}
        </group>
    );
}

export function CyberHub({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            <mesh position={[0, 1.6, 0]} castShadow>
                <boxGeometry args={[4.5, 3.2, 4.5]} />
                <primitive object={materials.cyberBody} />
            </mesh>
            <mesh position={[0, 3.3, 0]}>
                <boxGeometry args={[4.7, 0.2, 4.7]} />
                <primitive object={materials.neonCyan} />
            </mesh>
            <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[3.8, 1.2, 3.8]} />
                <primitive object={materials.cyberGlass} />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
                <cylinderGeometry args={[2.2, 2.6, 0.4, 32]} />
                <primitive object={materials.neonPink} />
            </mesh>
            <mesh position={[0, 3.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[2.4, 0.08, 16, 48]} />
                <primitive object={materials.neonAmber} />
            </mesh>
            <Text position={[0, 2.6, 2.4]} fontSize={0.4} color="#22d3ee" anchorX="center" anchorY="middle">
                CYBER HUB
            </Text>
            {isNight && (
                <>
                    <pointLight position={[0, 3.4, 0]} intensity={2.4} distance={10} color="#22d3ee" />
                    <pointLight position={[0, 1.4, 0]} intensity={1.6} distance={8} color="#a855f7" />
                </>
            )}
        </group>
    );
}

export function Character({ position, color = "#3b82f6" }: { position: [number, number, number]; color?: string }) {
    return (
        <group position={position}>
            {/* Legs */}
            <mesh position={[-0.2, 0.4, 0]}>
                <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            <mesh position={[0.2, 0.4, 0]}>
                <capsuleGeometry args={[0.1, 0.8, 4, 8]} />
                <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Torso */}
            <mesh position={[0, 1.1, 0]}>
                <boxGeometry args={[0.5, 0.7, 0.3]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.65, 0]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <primitive object={materials.skin} />
            </mesh>
        </group>
    );
}

export function WalkingCharacter({ path, color = "#3b82f6", speed = 1 }: { path: [number, number, number][]; color?: string; speed?: number }) {
    const ref = useRef<THREE.Group>(null);
    const [targetIndex, setTargetIndex] = useState(1);

    useFrame((state, delta) => {
        if (!ref.current || path.length < 2) return;

        const currentPos = ref.current.position;
        const target = new THREE.Vector3(...path[targetIndex]);

        // Move towards target
        const direction = target.clone().sub(currentPos).normalize();
        const distance = currentPos.distanceTo(target);

        if (distance < 0.1) {
            // Reached target, go to next
            setTargetIndex((prev) => (prev + 1) % path.length);
        } else {
            ref.current.position.add(direction.multiplyScalar(speed * delta));
            ref.current.lookAt(target);
        }

        // Bobbing animation
        ref.current.position.y = Math.abs(Math.sin(state.clock.elapsedTime * speed * 5)) * 0.2;
    });

    return (
        <group ref={ref} position={path[0]}>
            <Character position={[0, 0, 0]} color={color} />
        </group>
    );
}

export function Mailbox({ position }: { position: [number, number, number] }) {
    return (
        <group position={position}>
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1]} />
                <meshStandardMaterial color="#94a3b8" />
            </mesh>
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[0.4, 0.3, 0.6]} />
                <meshStandardMaterial color="#e2e8f0" />
            </mesh>
        </group>
    )
}

export function CityBuilding({ position, scale = [1, 1, 1], isNight = false, rotationY = 0 }: { position: [number, number, number]; scale?: [number, number, number]; isNight?: boolean; rotationY?: number; }) {
    // Randomize window pattern per instance (stable via useMemo if needed, but here we keep it simple)
    const windows = useMemo(() => {
        const wins = [];
        const floors = Math.floor(scale[1] * 2); // Approx floors
        const width = Math.floor(scale[0] * 2);

        for (let y = 0; y < floors; y++) {
            for (let x = 0; x < width; x++) {
                if (Math.random() > 0.3) { // 70% chance of window
                    wins.push({ x: (x - width / 2) * 0.6 + 0.3, y: y * 0.8 + 0.5 });
                }
            }
        }
        return wins;
    }, [scale]);

    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            <mesh position={[0, scale[1] / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[scale[0], scale[1], scale[2]]} />
                <primitive object={materials.building} />
            </mesh>
            {/* Windows */}
            {windows.map((w, i) => (
                <mesh key={i} position={[w.x, w.y, scale[2] / 2 + 0.01]} rotation={[0, 0, 0]}>
                    <planeGeometry args={[0.3, 0.4]} />
                    <primitive object={isNight && Math.random() > 0.2 ? materials.windowOn : materials.windowOff} />
                </mesh>
            ))}
            {/* Roof Snow */}
            <mesh position={[0, scale[1] + 0.1, 0]}>
                <boxGeometry args={[scale[0] + 0.1, 0.2, scale[2] + 0.1]} />
                <meshStandardMaterial color="#ffffff" />
            </mesh>
        </group>
    );
}

export function StreetLamp({ position, isNight = false }: { position: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position}>
            <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.08, 3]} />
                <primitive object={materials.lampPost} />
            </mesh>
            <mesh position={[0, 3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.6]} />
                <primitive object={materials.lampPost} />
            </mesh>
            {/* Light Bulb */}
            <mesh position={[0, 2.9, 0.6]}>
                <sphereGeometry args={[0.15]} />
                <primitive object={isNight ? materials.lampLight : materials.lampPost} />
            </mesh>
                <pointLight position={[0, 2.5, 0.6]} intensity={isNight ? 2.4 : 0.8} distance={9} color="#fffbeb" decay={2} />
        </group>
    );
}
