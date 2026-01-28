"use client";

import React, { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

// --- Materials ---
const materials = {
    treeNight: new THREE.MeshStandardMaterial({ color: "#4c1d95", roughness: 0.8 }),
    treeDay: new THREE.MeshStandardMaterial({ color: "#16a34a", roughness: 0.9 }),
    treeCapNight: new THREE.MeshStandardMaterial({ color: "#a78bfa", roughness: 1 }),
    treeCapDay: new THREE.MeshStandardMaterial({ color: "#bbf7d0", roughness: 1 }),
    truckBodyMain: new THREE.MeshStandardMaterial({ color: "#1b9aaa", roughness: 0.35 }),
    truckBodyAccent: new THREE.MeshStandardMaterial({ color: "#f97316", roughness: 0.35 }),
    truckDetail: new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.4 }),
    truckGlass: new THREE.MeshPhysicalMaterial({ color: "#8fd6ff", transmission: 0.8, opacity: 0.3, transparent: true, roughness: 0.05, metalness: 0 }),
    stageTruss: new THREE.MeshStandardMaterial({ color: "#e2e8f0", metalness: 0.55, roughness: 0.35 }),
    stageFloor: new THREE.MeshStandardMaterial({ color: "#1e293b", roughness: 0.8 }),
    skin: new THREE.MeshStandardMaterial({ color: "#fdba74", roughness: 0.5 }),
    clothes: new THREE.MeshStandardMaterial({ color: "#3b82f6", roughness: 0.6 }),
    buildingDay: new THREE.MeshStandardMaterial({ color: "#94a3b8", roughness: 0.92, metalness: 0.03 }),
    buildingNight: new THREE.MeshStandardMaterial({ color: "#0b1224", roughness: 0.85, metalness: 0.06 }),
    windowOffDay: new THREE.MeshStandardMaterial({ color: "#cbd5e1", roughness: 0.95, metalness: 0.0 }),
    windowOffNight: new THREE.MeshStandardMaterial({ color: "#111827", roughness: 0.95, metalness: 0.0 }),
    windowOn: new THREE.MeshStandardMaterial({ color: "#fbbf24", emissive: "#fbbf24", emissiveIntensity: 1.8, toneMapped: false }),
    lampPost: new THREE.MeshStandardMaterial({ color: "#0f172a", metalness: 0.6, roughness: 0.4 }),
    lampLight: new THREE.MeshStandardMaterial({ color: "#fffbeb", emissive: "#fffbeb", emissiveIntensity: 3.2 }),
    neonPink: new THREE.MeshStandardMaterial({ color: "#ff00ff", emissive: "#ff00ff", emissiveIntensity: 1.6, toneMapped: false }),
    neonCyan: new THREE.MeshStandardMaterial({ color: "#00ffff", emissive: "#00ffff", emissiveIntensity: 1.6, toneMapped: false }),
    neonYellow: new THREE.MeshStandardMaterial({ color: "#ffff00", emissive: "#ffff00", emissiveIntensity: 1.6, toneMapped: false }),
    neonBlue: new THREE.MeshStandardMaterial({ color: "#3b82f6", emissive: "#3b82f6", emissiveIntensity: 1.8, toneMapped: false }),
    neonRed: new THREE.MeshStandardMaterial({ color: "#ff2d55", emissive: "#ff2d55", emissiveIntensity: 1.6, toneMapped: false }),
    neonAmber: new THREE.MeshStandardMaterial({ color: "#fbbf24", emissive: "#fbbf24", emissiveIntensity: 1.6, toneMapped: false }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#88ccff", transmission: 0.9, opacity: 0.3, transparent: true, roughness: 0, metalness: 0 }),
    dinerWall: new THREE.MeshStandardMaterial({ color: "#1e1b4b", roughness: 0.2 }),
    cafeBody: new THREE.MeshStandardMaterial({ color: "#0ea5e9", roughness: 0.35, metalness: 0.1 }),
    cafeAccent: new THREE.MeshStandardMaterial({ color: "#a855f7", roughness: 0.4, metalness: 0.2 }),
    cyberBody: new THREE.MeshStandardMaterial({ color: "#0b1224", metalness: 0.65, roughness: 0.25 }),
    cyberGlass: new THREE.MeshPhysicalMaterial({ color: "#22d3ee", transmission: 0.85, opacity: 0.35, transparent: true, roughness: 0.15, metalness: 0.2 }),
    roomWall: new THREE.MeshStandardMaterial({ color: "#0b1224", roughness: 0.95, metalness: 0.02 }),
    roomFloor: new THREE.MeshStandardMaterial({ color: "#0f172a", roughness: 0.98, metalness: 0.0 }),
    setupWhite: new THREE.MeshStandardMaterial({ color: "#f8fafc", roughness: 0.5, metalness: 0.1 }),
    setupWhiteMatte: new THREE.MeshStandardMaterial({ color: "#e2e8f0", roughness: 0.9, metalness: 0.02 }),
    setupDark: new THREE.MeshStandardMaterial({ color: "#111827", roughness: 0.8, metalness: 0.05 }),
    rgbStrip: new THREE.MeshStandardMaterial({ color: "#111827", emissive: "#22d3ee", emissiveIntensity: 1.6, toneMapped: false, roughness: 0.7, metalness: 0.0 }),
    rgbMagenta: new THREE.MeshStandardMaterial({ color: "#111827", emissive: "#ff00ff", emissiveIntensity: 1.6, toneMapped: false, roughness: 0.7, metalness: 0.0 }),
};

// --- Components ---

export function LowPolyTree({ position, scale = 1, isNight = false }: { position: [number, number, number]; scale?: number; isNight?: boolean }) {
    const leavesMat = isNight ? materials.treeNight : materials.treeDay;
    const trunkColor = isNight ? "#4c1d95" : "#7c4a2d";

    return (
        <group position={position} scale={scale}>
            {/* Trunk - higher segments for smoothness */}
            <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.4, 1, 12]} />
                <meshStandardMaterial color={trunkColor} roughness={0.85} />
            </mesh>
            {/* Layers - increased segments */}
            <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[1.2, 2, 12]} />
                <primitive object={leavesMat} />
            </mesh>
            <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[1, 1.8, 12]} />
                <primitive object={leavesMat} />
            </mesh>
            <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[0.8, 1.5, 12]} />
                <primitive object={leavesMat} />
            </mesh>
            {/* Snow caps only at night */}
            {isNight && (
                <mesh position={[0, 1.6, 0]} scale={[1.05, 0.2, 1.05]}>
                    <coneGeometry args={[1.2, 2, 12]} />
                    <primitive object={materials.treeCapNight} />
                </mesh>
            )}
        </group>
    );
}

export function NeonFoodTruck({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Chassis */}
            <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
                <boxGeometry args={[2.9, 0.32, 4.15]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#0f172a"} roughness={0.9} metalness={0.05} />
            </mesh>

            {/* Wheels - higher segments for smoothness */}
            {[[-0.9, 0.35, 1.6], [0.9, 0.35, 1.6], [-0.9, 0.35, -1.6], [0.9, 0.35, -1.6]].map((pos, i) => (
                <mesh key={i} position={pos as [number, number, number]} castShadow>
                    <torusGeometry args={[0.35, 0.09, 12, 24]} />
                    <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.4} />
                </mesh>
            ))}

            {/* Wheel wells */}
            {[
                [-0.9, 0.85, 1.6],
                [0.9, 0.85, 1.6],
                [-0.9, 0.85, -1.6],
                [0.9, 0.85, -1.6],
            ].map((pos, i) => (
                <mesh key={`well-${i}`} position={pos as [number, number, number]} castShadow>
                    <boxGeometry args={[0.85, 0.65, 0.25]} />
                    <meshStandardMaterial color={isNight ? "#0b1224" : "#1e293b"} roughness={0.95} metalness={0.02} />
                </mesh>
            ))}

            {/* Main Body */}
            <mesh position={[0, 1.4, 0]} castShadow>
                <boxGeometry args={[2.6, 2.4, 4]} />
                <primitive object={materials.truckBodyMain} />
            </mesh>
            {/* Body trim (adds depth) */}
            <mesh position={[0, 2.55, 0]} castShadow>
                <boxGeometry args={[2.72, 0.12, 4.12]} />
                <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.92} metalness={0.02} />
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

            {/* Awning (simplified) */}
            <mesh position={[-1.35, 2, 0.6]} rotation={[0, 0, -0.2]} castShadow>
                <boxGeometry args={[0.15, 1.8, 3.2]} />
                <meshStandardMaterial color={isNight ? "#f97316" : "#fbbf24"} roughness={0.8} metalness={0.05} />
            </mesh>

            {/* Service Window */}
            <group position={[-1.3, 1.3, 0]}>
                <mesh position={[0.05, 0, 0]}>
                    <boxGeometry args={[0.05, 1.6, 0.1]} />
                    <primitive object={materials.neonCyan} />
                </mesh>
                <mesh position={[0.07, 0, 0]}>
                    <boxGeometry args={[0.02, 1.6, 0.1]} />
                    <primitive object={materials.neonPink} />
                </mesh>
            </group>

            {/* Rooftop (simplified) */}
            <mesh position={[0, 2.8, 0]} castShadow>
                <boxGeometry args={[2.2, 0.35, 2.5]} />
                <meshStandardMaterial color={isNight ? "#0f172a" : "#fde68a"} roughness={0.85} metalness={0.05} />
            </mesh>

            {/* Under-glow strip (emissive only; night identity without extra lights) */}
            <mesh position={[0, 0.18, 0]}>
                <boxGeometry args={[2.5, 0.06, 3.6]} />
                <meshStandardMaterial
                    color="#111827"
                    emissive="#22d3ee"
                    emissiveIntensity={isNight ? 0.85 : 0.0}
                    toneMapped={false}
                    roughness={0.6}
                    metalness={0.0}
                />
            </mesh>

            {/* Neon outline */}
            <mesh position={[0, 1.4, -2.05]}>
                <boxGeometry args={[2.6, 2.4, 0.08]} />
                <meshStandardMaterial
                    color={"#ff00ff"}
                    emissive={"#ff00ff"}
                    emissiveIntensity={isNight ? 2.0 : 0.08}
                    toneMapped={false}
                    roughness={0.55}
                    metalness={0.0}
                />
            </mesh>

            {/* Front lights */}
            <mesh position={[0.8, 0.9, 2.05]}>
                <boxGeometry args={[0.4, 0.25, 0.1]} />
                <meshStandardMaterial
                    color={"#fbbf24"}
                    emissive={"#fbbf24"}
                    emissiveIntensity={isNight ? 2.0 : 0.05}
                    toneMapped={false}
                    roughness={0.5}
                    metalness={0.0}
                />
            </mesh>
            <mesh position={[-0.8, 0.9, 2.05]}>
                <boxGeometry args={[0.4, 0.25, 0.1]} />
                <meshStandardMaterial
                    color={"#fbbf24"}
                    emissive={"#fbbf24"}
                    emissiveIntensity={isNight ? 2.0 : 0.05}
                    toneMapped={false}
                    roughness={0.5}
                    metalness={0.0}
                />
            </mesh>

            {/* Point light removed for performance - emissive materials provide glow */}
        </group>
    );
}

export function NeonGarage({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Building body */}
            <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
                <boxGeometry args={[5.2, 2.5, 2.8]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#cbd5e1"} roughness={isNight ? 0.85 : 0.92} metalness={0.04} />
            </mesh>
            {/* Floor pad */}
            <mesh position={[0, 0.05, 0]} receiveShadow>
                <boxGeometry args={[5.8, 0.1, 3.4]} />
                <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.95} metalness={0.02} />
            </mesh>

            {/* Roller door */}
            <mesh position={[0, 1.1, 1.41]} castShadow>
                <planeGeometry args={[4.2, 1.7]} />
                <meshStandardMaterial color={isNight ? "#111827" : "#94a3b8"} roughness={0.9} metalness={0.05} />
            </mesh>
            {Array.from({ length: 6 }).map((_, i) => (
                <mesh key={`door-slat-${i}`} position={[0, 0.45 + i * 0.28, 1.42]}>
                    <boxGeometry args={[4.18, 0.04, 0.03]} />
                    <meshStandardMaterial color={isNight ? "#0b1224" : "#e2e8f0"} roughness={0.95} metalness={0.02} />
                </mesh>
            ))}

            {/* Sign */}
            <mesh position={[0, 2.25, 1.42]} castShadow>
                <boxGeometry args={[3.4, 0.55, 0.08]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#e2e8f0"} roughness={0.9} metalness={0.03} />
            </mesh>
            <mesh position={[0, 2.25, 1.47]}>
                <planeGeometry args={[3.1, 0.38]} />
                <meshStandardMaterial
                    color="#fbbf24"
                    emissive="#fbbf24"
                    emissiveIntensity={isNight ? 1.6 : 0.08}
                    toneMapped={false}
                    roughness={0.5}
                    metalness={0.0}
                />
            </mesh>

            {/* Roof accent bar */}
            <mesh position={[0, 2.55, 0.5]}>
                <boxGeometry args={[4.8, 0.1, 0.1]} />
                <meshStandardMaterial color="#ff00ff" emissive="#ff00ff" emissiveIntensity={isNight ? 1.8 : 0.1} toneMapped={false} roughness={0.55} metalness={0.0} />
            </mesh>

            {/* Pillars */}
            <mesh position={[2.4, 1.25, 0]}>
                <boxGeometry args={[0.15, 2.5, 0.15]} />
                <meshStandardMaterial color={"#fbbf24"} emissive={"#fbbf24"} emissiveIntensity={isNight ? 2.0 : 0.08} toneMapped={false} roughness={0.55} metalness={0.0} />
            </mesh>
            <mesh position={[-2.4, 1.25, 0]}>
                <boxGeometry args={[0.15, 2.5, 0.15]} />
                <meshStandardMaterial color={"#fbbf24"} emissive={"#fbbf24"} emissiveIntensity={isNight ? 2.0 : 0.08} toneMapped={false} roughness={0.55} metalness={0.0} />
            </mesh>

            {/* Car silhouette */}
            <group position={[0, 0.6, 0]}>
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[3.8, 0.4, 1.2]} />
                    <meshStandardMaterial color={"#3b82f6"} emissive={"#3b82f6"} emissiveIntensity={isNight ? 1.8 : 0.0} toneMapped={false} roughness={0.65} metalness={0.05} />
                </mesh>
                <mesh position={[0, 0.8, 0]}>
                    <boxGeometry args={[3.4, 0.4, 1]} />
                    <meshStandardMaterial color={"#3b82f6"} emissive={"#3b82f6"} emissiveIntensity={isNight ? 1.8 : 0.0} toneMapped={false} roughness={0.65} metalness={0.05} />
                </mesh>
                <mesh position={[0, 1.2, 0]}>
                    <boxGeometry args={[2.6, 0.4, 0.9]} />
                    <meshStandardMaterial color={"#3b82f6"} emissive={"#3b82f6"} emissiveIntensity={isNight ? 1.8 : 0.0} toneMapped={false} roughness={0.65} metalness={0.05} />
                </mesh>
                <mesh position={[0, 1.48, -0.25]}>
                    <boxGeometry args={[2.4, 0.12, 0.6]} />
                    <meshStandardMaterial color="#111827" emissive="#22d3ee" emissiveIntensity={isNight ? 0.9 : 0.0} toneMapped={false} roughness={0.65} metalness={0.0} />
                </mesh>
                <mesh position={[1.6, 0.6, 0]}>
                    <boxGeometry args={[0.5, 0.4, 0.9]} />
                    <meshStandardMaterial color={"#fbbf24"} emissive={"#fbbf24"} emissiveIntensity={isNight ? 1.6 : 0.0} toneMapped={false} roughness={0.65} metalness={0.05} />
                </mesh>
                <mesh position={[-1.6, 0.6, 0]}>
                    <boxGeometry args={[0.5, 0.4, 0.9]} />
                    <meshStandardMaterial color={"#fbbf24"} emissive={"#fbbf24"} emissiveIntensity={isNight ? 1.6 : 0.0} toneMapped={false} roughness={0.65} metalness={0.05} />
                </mesh>
                <mesh position={[1.2, 0.2, 0]}>
                    <torusGeometry args={[0.45, 0.08, 12, 24]} />
                    <meshStandardMaterial color={"#ffff00"} emissive={"#ffff00"} emissiveIntensity={isNight ? 1.6 : 0.0} toneMapped={false} roughness={0.5} metalness={0.0} />
                </mesh>
                <mesh position={[-1.2, 0.2, 0]}>
                    <torusGeometry args={[0.45, 0.08, 12, 24]} />
                    <meshStandardMaterial color={"#ffff00"} emissive={"#ffff00"} emissiveIntensity={isNight ? 1.6 : 0.0} toneMapped={false} roughness={0.5} metalness={0.0} />
                </mesh>
            </group>
        </group>
    );
}

export function NeonDiner({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    const signMat = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#111827",
                emissive: "#ff2d55",
                emissiveIntensity: isNight ? 1.9 : 0.10,
                toneMapped: false,
                roughness: 0.6,
                metalness: 0.0,
            }),
        [isNight]
    );
    const warmMat = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#111827",
                emissive: "#fbbf24",
                emissiveIntensity: isNight ? 0.85 : 0.05,
                toneMapped: false,
                roughness: 0.7,
                metalness: 0.0,
            }),
        [isNight]
    );

    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Base plinth */}
            <mesh position={[0, 0.12, 0]} receiveShadow>
                <boxGeometry args={[6.8, 0.24, 4.8]} />
                <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.96} metalness={0.02} />
            </mesh>

            {/* Black-box building */}
            <mesh position={[0, 1.6, 0]} castShadow>
                <boxGeometry args={[6.2, 3.2, 4.2]} />
                <meshStandardMaterial color={isNight ? "#05070f" : "#0f172a"} roughness={0.88} metalness={0.06} />
            </mesh>

            {/* Roof parapet / trim */}
            <mesh position={[0, 3.25, 0]} castShadow>
                <boxGeometry args={[6.35, 0.18, 4.35]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#111827"} roughness={0.9} metalness={0.05} />
            </mesh>

            {/* Accent band */}
            <mesh position={[0, 2.75, 2.12]}>
                <boxGeometry args={[6.05, 0.12, 0.06]} />
                <primitive object={signMat} />
            </mesh>

            {/* Front glass */}
            <mesh position={[0, 1.55, 2.12]}>
                <planeGeometry args={[5.55, 2.15]} />
                <primitive object={materials.glass} />
            </mesh>
            <mesh position={[0, 1.55, 2.11]} castShadow>
                <boxGeometry args={[5.7, 2.3, 0.08]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} roughness={0.9} metalness={0.08} />
            </mesh>

            {/* Door */}
            <mesh position={[-2.2, 1.1, 2.13]}>
                <planeGeometry args={[1.0, 1.55]} />
                <meshPhysicalMaterial color="#88ccff" transmission={0.7} opacity={0.35} transparent roughness={0.12} metalness={0.0} />
            </mesh>
            <mesh position={[-2.2, 1.1, 2.14]}>
                <boxGeometry args={[1.06, 1.6, 0.06]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} roughness={0.9} metalness={0.08} />
            </mesh>

            {/* Menu panel (simplified) */}
            <mesh position={[1.55, 1.35, 1.88]}>
                <boxGeometry args={[1.35, 1.4, 0.08]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#0f172a"} roughness={0.9} metalness={0.04} />
            </mesh>
            <mesh position={[1.55, 1.35, 1.93]}>
                <planeGeometry args={[1.18, 1.2]} />
                <primitive object={warmMat} />
            </mesh>

            {/* Main sign box */}
            <mesh position={[0, 3.78, 2.27]} castShadow>
                <boxGeometry args={[4.9, 1.05, 0.16]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#111827"} roughness={0.9} metalness={0.03} />
            </mesh>
            <mesh position={[0, 3.78, 2.37]}>
                <planeGeometry args={[4.6, 0.85]} />
                <primitive object={signMat} />
            </mesh>

            {/* Under-canopy glow strip (emissive only) */}
            <mesh position={[0, 2.55, 2.12]}>
                <boxGeometry args={[5.2, 0.06, 0.12]} />
                <meshStandardMaterial color="#111827" emissive="#fbbf24" emissiveIntensity={isNight ? 0.85 : 0.04} toneMapped={false} roughness={0.6} metalness={0.0} />
            </mesh>
        </group>
    );
}

export function Stage({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    const spotRef1 = useRef<THREE.SpotLight>(null);
    const spotRef2 = useRef<THREE.SpotLight>(null);
    const spotRef3 = useRef<THREE.SpotLight>(null);
    const timeRef = useRef(0);

    // Animate concert lights
    useFrame((state, delta) => {
        if (!isNight) return;
        timeRef.current += delta;
        const t = timeRef.current;

        if (spotRef1.current) {
            spotRef1.current.position.x = Math.sin(t * 0.8) * 2;
        }
        if (spotRef2.current) {
            spotRef2.current.position.x = Math.sin(t * 0.6 + 1) * 2;
        }
        if (spotRef3.current) {
            spotRef3.current.position.x = Math.sin(t * 1.0 + 2) * 1.5;
        }
    });

    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Main Stage Platform - Elevated */}
            <mesh position={[0, 0.35, 0]} receiveShadow castShadow>
                <boxGeometry args={[9, 0.7, 6]} />
                <meshStandardMaterial color={isNight ? "#0a0a12" : "#1e293b"} roughness={0.7} metalness={0.3} />
            </mesh>

            {/* Stage Floor with LED Grid */}
            <mesh position={[0, 0.71, 0]}>
                <boxGeometry args={[8.5, 0.02, 5.5]} />
                <meshStandardMaterial
                    color="#111827"
                    emissive="#22d3ee"
                    emissiveIntensity={isNight ? 0.4 : 0.02}
                    roughness={0.3}
                    metalness={0.6}
                    toneMapped={false}
                />
            </mesh>

            {/* Front LED Strip - Animated glow */}
            <mesh position={[0, 0.72, 2.76]}>
                <boxGeometry args={[8.8, 0.15, 0.08]} />
                <meshStandardMaterial
                    emissive="#ff00ff"
                    emissiveIntensity={isNight ? 2.2 : 0.08}
                    color="#111827"
                    toneMapped={false}
                    roughness={0.4}
                />
            </mesh>

            {/* Side LED Strips */}
            <mesh position={[-4.4, 0.72, 0]}>
                <boxGeometry args={[0.08, 0.15, 5.5]} />
                <meshStandardMaterial emissive="#22d3ee" emissiveIntensity={isNight ? 1.8 : 0.06} color="#111827" toneMapped={false} roughness={0.4} />
            </mesh>
            <mesh position={[4.4, 0.72, 0]}>
                <boxGeometry args={[0.08, 0.15, 5.5]} />
                <meshStandardMaterial emissive="#22d3ee" emissiveIntensity={isNight ? 1.8 : 0.06} color="#111827" toneMapped={false} roughness={0.4} />
            </mesh>

            {/* Speaker Towers - Left */}
            <group position={[-4.2, 0.7, 1.8]}>
                {[0, 0.7, 1.4, 2.1].map((y, i) => (
                    <mesh key={`spk-l-${i}`} position={[0, y, 0]} castShadow>
                        <boxGeometry args={[0.9, 0.65, 0.7]} />
                        <meshStandardMaterial color={isNight ? "#0b0b15" : "#1e293b"} roughness={0.8} metalness={0.2} />
                    </mesh>
                ))}
                {/* Speaker grills */}
                {[0.3, 1.0, 1.7, 2.4].map((y, i) => (
                    <mesh key={`grill-l-${i}`} position={[0.46, y, 0]}>
                        <planeGeometry args={[0.01, 0.5]} />
                        <meshStandardMaterial color="#1a1a2e" emissive="#a855f7" emissiveIntensity={isNight ? 0.5 : 0} toneMapped={false} />
                    </mesh>
                ))}
            </group>

            {/* Speaker Towers - Right */}
            <group position={[4.2, 0.7, 1.8]}>
                {[0, 0.7, 1.4, 2.1].map((y, i) => (
                    <mesh key={`spk-r-${i}`} position={[0, y, 0]} castShadow>
                        <boxGeometry args={[0.9, 0.65, 0.7]} />
                        <meshStandardMaterial color={isNight ? "#0b0b15" : "#1e293b"} roughness={0.8} metalness={0.2} />
                    </mesh>
                ))}
            </group>

            {/* Truss System - Main Pillars */}
            <mesh position={[-4, 4.5, -2.5]} castShadow>
                <boxGeometry args={[0.25, 9, 0.25]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.25} />
            </mesh>
            <mesh position={[4, 4.5, -2.5]} castShadow>
                <boxGeometry args={[0.25, 9, 0.25]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.25} />
            </mesh>

            {/* Truss Cross Beams */}
            <mesh position={[0, 8.5, -2.5]}>
                <boxGeometry args={[8.5, 0.25, 0.25]} />
                <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.25} />
            </mesh>
            <mesh position={[0, 6, -2.5]}>
                <boxGeometry args={[8.5, 0.15, 0.15]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} />
            </mesh>

            {/* Main LED Screen / Backdrop */}
            <mesh position={[0, 4.5, -2.6]} castShadow>
                <boxGeometry args={[7.5, 6, 0.2]} />
                <meshStandardMaterial color={isNight ? "#050510" : "#0f172a"} roughness={0.3} metalness={0.4} />
            </mesh>

            {/* Screen Display - OPPO × AICTE Branding */}
            <mesh position={[0, 4.5, -2.48]}>
                <planeGeometry args={[7.2, 5.7]} />
                <meshStandardMaterial
                    color={isNight ? "#0a1628" : "#1e293b"}
                    emissive={isNight ? "#00ff88" : "#000000"}
                    emissiveIntensity={isNight ? 0.5 : 0.0}
                    roughness={0.2}
                    metalness={0.5}
                    toneMapped={false}
                />
            </mesh>

            {/* OPPO Logo representation */}
            <mesh position={[0, 5.5, -2.45]}>
                <ringGeometry args={[0.5, 0.7, 32]} />
                <meshStandardMaterial
                    color="#00ff88"
                    emissive="#00ff88"
                    emissiveIntensity={isNight ? 2.5 : 0.1}
                    toneMapped={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Moving Light Bars on Truss */}
            {[-2.5, 0, 2.5].map((x, i) => (
                <group key={`light-bar-${i}`} position={[x, 8.2, -2.2]}>
                    <mesh>
                        <boxGeometry args={[0.3, 0.3, 0.5]} />
                        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                    </mesh>
                    <mesh position={[0, -0.2, 0.2]}>
                        <cylinderGeometry args={[0.12, 0.15, 0.15, 8]} />
                        <meshStandardMaterial
                            color="#ffffff"
                            emissive={["#ff00ff", "#00ffff", "#ffff00"][i]}
                            emissiveIntensity={isNight ? 3.0 : 0.1}
                            toneMapped={false}
                        />
                    </mesh>
                </group>
            ))}

            {/* Floor Wash Lights */}
            {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
                <mesh key={`floor-light-${i}`} position={[x, 0.75, 2.5]}>
                    <boxGeometry args={[0.25, 0.12, 0.25]} />
                    <meshStandardMaterial
                        color="#111827"
                        emissive={["#ff2d55", "#a855f7", "#22d3ee", "#fbbf24", "#00ff88"][i]}
                        emissiveIntensity={isNight ? 2.5 : 0.08}
                        toneMapped={false}
                    />
                </mesh>
            ))}

            {/* Stage Monitors */}
            {[-2.5, 2.5].map((x, i) => (
                <mesh key={`monitor-${i}`} position={[x, 0.9, 1.5]} rotation={[-0.3, 0, 0]} castShadow>
                    <boxGeometry args={[0.8, 0.5, 0.4]} />
                    <meshStandardMaterial color={isNight ? "#0b0b15" : "#334155"} roughness={0.85} />
                </mesh>
            ))}

            {/* Concert Spotlights - reduced to 1 ambient light for performance */}
            {isNight && (
                <pointLight position={[0, 3, 0]} intensity={2.5} distance={10} color="#a855f7" />
            )}
        </group>
    );
}

export function CloudCafe({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Base pad */}
            <mesh position={[0, 0.12, 0]} receiveShadow>
                <boxGeometry args={[4.6, 0.24, 3.6]} />
                <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.95} metalness={0.02} />
            </mesh>
            {/* Main building */}
            <mesh position={[0, 1, 0]} castShadow>
                <boxGeometry args={[4.2, 1.6, 3.2]} />
                <primitive object={materials.cafeBody} />
            </mesh>
            {/* Roof accent */}
            <mesh position={[0, 1.9, 0]}>
                <boxGeometry args={[3.8, 0.4, 2.8]} />
                <primitive object={materials.cafeAccent} />
            </mesh>

            {/* Door + window */}
            <mesh position={[-1.4, 0.9, 1.61]}>
                <planeGeometry args={[0.8, 1.2]} />
                <primitive object={materials.glass} />
            </mesh>
            <mesh position={[0.9, 0.95, 1.61]}>
                <planeGeometry args={[1.7, 1.1]} />
                <primitive object={materials.glass} />
            </mesh>

            {/* Awning */}
            <mesh position={[0, 1.55, 1.68]} castShadow>
                <boxGeometry args={[4.0, 0.18, 0.5]} />
                <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} roughness={0.85} metalness={0.06} />
            </mesh>

            {/* ═══ GLOWING FOOD SIGNAGE ═══ */}
            {/* Burger icon - left side */}
            <group position={[-1.4, 2.4, 0.9]}>
                {/* Bottom bun */}
                <mesh position={[0, -0.12, 0]}>
                    <cylinderGeometry args={[0.22, 0.24, 0.08, 16]} />
                    <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={isNight ? 1.2 : 0.1} roughness={0.55} toneMapped={false} />
                </mesh>
                {/* Patty */}
                <mesh position={[0, -0.02, 0]}>
                    <cylinderGeometry args={[0.2, 0.2, 0.06, 16]} />
                    <meshStandardMaterial color="#7c2d12" emissive="#ea580c" emissiveIntensity={isNight ? 0.8 : 0.05} roughness={0.65} toneMapped={false} />
                </mesh>
                {/* Top bun */}
                <mesh position={[0, 0.1, 0]}>
                    <sphereGeometry args={[0.22, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
                    <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={isNight ? 1.2 : 0.1} roughness={0.55} toneMapped={false} />
                </mesh>
            </group>

            {/* Fries icon - center */}
            <group position={[0, 2.4, 0.9]}>
                {/* Fry container */}
                <mesh position={[0, -0.1, 0]}>
                    <boxGeometry args={[0.3, 0.2, 0.15]} />
                    <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={isNight ? 1.0 : 0.08} roughness={0.55} toneMapped={false} />
                </mesh>
                {/* Fries sticking out */}
                {[-0.08, 0, 0.08].map((x, i) => (
                    <mesh key={i} position={[x, 0.12 + i * 0.04, 0]} rotation={[0, 0, (i - 1) * 0.15]}>
                        <boxGeometry args={[0.04, 0.28, 0.04]} />
                        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={isNight ? 1.4 : 0.1} roughness={0.45} toneMapped={false} />
                    </mesh>
                ))}
            </group>

            {/* Coffee cup icon - right side */}
            <group position={[1.4, 2.35, 0.9]}>
                {/* Cup body */}
                <mesh position={[0, 0, 0]}>
                    <cylinderGeometry args={[0.12, 0.15, 0.32, 16]} />
                    <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={isNight ? 0.6 : 0.05} roughness={0.35} toneMapped={false} />
                </mesh>
                {/* Coffee inside */}
                <mesh position={[0, 0.12, 0]}>
                    <cylinderGeometry args={[0.1, 0.1, 0.04, 16]} />
                    <meshStandardMaterial color="#78350f" emissive="#92400e" emissiveIntensity={isNight ? 0.8 : 0.05} roughness={0.75} toneMapped={false} />
                </mesh>
                {/* Steam wisps */}
                <mesh position={[0, 0.25, 0]}>
                    <sphereGeometry args={[0.06, 12, 12]} />
                    <meshStandardMaterial color="#e2e8f0" emissive="#e2e8f0" emissiveIntensity={isNight ? 0.8 : 0.05} transparent opacity={0.7} roughness={0.85} toneMapped={false} />
                </mesh>
            </group>

            {/* Rooftop emissive bar (replaces cloud spheres) */}
            <mesh position={[0, 2.2, 0]}>
                <boxGeometry args={[3.4, 0.12, 0.12]} />
                <meshStandardMaterial
                    emissive="#22d3ee"
                    emissiveIntensity={isNight ? 1.6 : 0.08}
                    color="#22d3ee"
                    toneMapped={false}
                    roughness={0.5}
                    metalness={0.0}
                />
            </mesh>

            {/* Front sign glow panel */}
            <mesh position={[0, 1.35, 1.62]}>
                <planeGeometry args={[3.3, 0.55]} />
                <meshStandardMaterial
                    emissive="#22d3ee"
                    emissiveIntensity={isNight ? 1.5 : 0.08}
                    color="#111827"
                    toneMapped={false}
                    roughness={0.5}
                    metalness={0.0}
                />
            </mesh>

            {/* Point lights removed for performance - emissive materials provide glow */}
        </group>
    );
}

export function CyberHub({ position, rotation, isNight = false }: { position: [number, number, number]; rotation?: [number, number, number]; isNight?: boolean }) {
    const rgbCyan = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#111827",
                emissive: "#22d3ee",
                emissiveIntensity: isNight ? 2.0 : 0.12,
                toneMapped: false,
                roughness: 0.7,
                metalness: 0.0,
            }),
        [isNight]
    );
    const rgbPink = useMemo(
        () =>
            new THREE.MeshStandardMaterial({
                color: "#111827",
                emissive: "#ff00ff",
                emissiveIntensity: isNight ? 1.8 : 0.10,
                toneMapped: false,
                roughness: 0.7,
                metalness: 0.0,
            }),
        [isNight]
    );

    return (
        <group position={position} rotation={rotation ? new THREE.Euler(...rotation) : undefined}>
            {/* Base pad - higher segments for smoothness */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
                <cylinderGeometry args={[2.9, 3.3, 0.2, 48]} />
                <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.92} metalness={0.04} />
            </mesh>

            {/* Room shell (open-front diorama) */}
            <group position={[0, 1.35, 0]}>
                <mesh position={[0, -1.1, 0]} receiveShadow>
                    <boxGeometry args={[4.6, 0.16, 4.6]} />
                    <primitive object={materials.roomFloor} />
                </mesh>
                <mesh position={[0, 0.55, -2.25]} castShadow>
                    <boxGeometry args={[4.6, 3.3, 0.18]} />
                    <primitive object={materials.roomWall} />
                </mesh>
                <mesh position={[-2.25, 0.55, 0]} castShadow>
                    <boxGeometry args={[0.18, 3.3, 4.6]} />
                    <primitive object={materials.roomWall} />
                </mesh>
                <mesh position={[2.25, 0.55, 0]} castShadow>
                    <boxGeometry args={[0.18, 3.3, 4.6]} />
                    <primitive object={materials.roomWall} />
                </mesh>
                <mesh position={[0, 2.15, 0]} castShadow>
                    <boxGeometry args={[4.6, 0.16, 4.6]} />
                    <primitive object={materials.roomWall} />
                </mesh>

                {/* L-shaped LED edge (merged) */}
                <mesh position={[0, 2.10, -2.16]}>
                    <boxGeometry args={[4.2, 0.06, 0.06]} />
                    <primitive object={rgbCyan} />
                </mesh>

                {/* Desk */}
                <group position={[0, -0.55, 0.85]}>
                    <mesh position={[0, 0.62, 0]} castShadow>
                        <boxGeometry args={[2.8, 0.14, 1.2]} />
                        <primitive object={materials.setupWhite} />
                    </mesh>
                    {[[-1.25, 0.3, -0.45], [1.25, 0.3, -0.45], [-1.25, 0.3, 0.45], [1.25, 0.3, 0.45]].map((p, i) => (
                        <mesh key={`desk-leg-${i}`} position={p as [number, number, number]} castShadow>
                            <boxGeometry args={[0.12, 0.6, 0.12]} />
                            <primitive object={materials.setupWhiteMatte} />
                        </mesh>
                    ))}

                    {/* Monitor + stand (white) */}
                    <group position={[0, 1.18, -0.15]}>
                        <mesh position={[0, 0.1, 0]} castShadow>
                            <boxGeometry args={[1.35, 0.8, 0.08]} />
                            <primitive object={materials.setupWhite} />
                        </mesh>
                        <mesh position={[0, 0.1, 0.05]}>
                            <planeGeometry args={[1.22, 0.68]} />
                            <meshStandardMaterial
                                color="#05070f"
                                emissive="#22d3ee"
                                emissiveIntensity={isNight ? 0.85 : 0.05}
                                toneMapped={false}
                                roughness={0.8}
                                metalness={0.0}
                            />
                        </mesh>
                        <mesh position={[0, -0.35, 0]} castShadow>
                            <boxGeometry args={[0.25, 0.5, 0.12]} />
                            <primitive object={materials.setupWhiteMatte} />
                        </mesh>
                        <mesh position={[0, -0.65, 0.02]} castShadow>
                            <boxGeometry args={[0.9, 0.08, 0.32]} />
                            <primitive object={materials.setupWhiteMatte} />
                        </mesh>
                    </group>

                    {/* Keyboard + mouse */}
                    <mesh position={[-0.25, 0.72, 0.25]} castShadow>
                        <boxGeometry args={[0.95, 0.05, 0.28]} />
                        <primitive object={materials.setupWhiteMatte} />
                    </mesh>
                    <mesh position={[0.75, 0.72, 0.25]} castShadow>
                        <boxGeometry args={[0.18, 0.04, 0.28]} />
                        <primitive object={materials.setupWhiteMatte} />
                    </mesh>
                    <mesh position={[-0.25, 0.745, 0.25]}>
                        <boxGeometry args={[0.95, 0.01, 0.28]} />
                        <primitive object={rgbPink} />
                    </mesh>

                    {/* ═══ RUCHIN'S RIG - i7-12700K Lian Li RGB Setup ═══ */}
                    <group position={[1.25, 0.86, -0.35]}>
                        {/* Lian Li O11 Dynamic style case - white with glass panel */}
                        <mesh castShadow>
                            <boxGeometry args={[0.58, 1.1, 0.58]} />
                            <meshStandardMaterial color={isNight ? "#1e293b" : "#f1f5f9"} roughness={0.3} metalness={0.4} />
                        </mesh>
                        {/* Glass side panel with RGB glow */}
                        <mesh position={[0, 0.1, 0.295]}>
                            <planeGeometry args={[0.5, 0.9]} />
                            <meshStandardMaterial
                                color="#0f172a"
                                emissive="#22d3ee"
                                emissiveIntensity={isNight ? 1.2 : 0.06}
                                toneMapped={false}
                                roughness={0.2}
                                metalness={0.6}
                                transparent
                                opacity={0.85}
                            />
                        </mesh>
                        {/* RGB fan strip top */}
                        <mesh position={[0, 0.48, 0.30]}>
                            <boxGeometry args={[0.48, 0.04, 0.02]} />
                            <primitive object={rgbCyan} />
                        </mesh>
                        {/* RGB fan strip middle */}
                        <mesh position={[0, 0.25, 0.30]}>
                            <boxGeometry args={[0.48, 0.04, 0.02]} />
                            <primitive object={rgbPink} />
                        </mesh>
                        {/* RGB fan strip bottom */}
                        <mesh position={[0, 0.02, 0.30]}>
                            <boxGeometry args={[0.48, 0.04, 0.02]} />
                            <meshStandardMaterial
                                color="#111827"
                                emissive="#a855f7"
                                emissiveIntensity={isNight ? 1.8 : 0.10}
                                toneMapped={false}
                                roughness={0.7}
                            />
                        </mesh>
                        {/* Side RGB accent strip */}
                        <mesh position={[-0.295, 0.2, 0]}>
                            <boxGeometry args={[0.02, 0.85, 0.04]} />
                            <primitive object={rgbCyan} />
                        </mesh>
                        {/* Bottom RGB strip */}
                        <mesh position={[0, -0.52, 0.15]}>
                            <boxGeometry args={[0.52, 0.02, 0.4]} />
                            <primitive object={rgbPink} />
                        </mesh>
                        {/* GPU sag bracket (white) */}
                        <mesh position={[-0.15, -0.1, 0.25]}>
                            <boxGeometry args={[0.28, 0.04, 0.04]} />
                            <meshStandardMaterial color="#f8fafc" roughness={0.4} metalness={0.3} />
                        </mesh>
                        {isNight && <pointLight position={[0, 0, 0.6]} intensity={0.6} distance={3} color="#22d3ee" />}
                    </group>
                </group>

                {/* Chair (simple) */}
                <group position={[-1.1, -0.55, 1.8]}>
                    <mesh position={[0, 0.35, 0]} castShadow>
                        <boxGeometry args={[0.75, 0.12, 0.75]} />
                        <primitive object={materials.setupDark} />
                    </mesh>
                    <mesh position={[0, 0.85, -0.28]} castShadow>
                        <boxGeometry args={[0.75, 0.9, 0.12]} />
                        <primitive object={materials.setupDark} />
                    </mesh>
                    <mesh position={[0, 0.05, 0]} castShadow>
                        <boxGeometry args={[0.12, 0.4, 0.12]} />
                        <primitive object={materials.setupDark} />
                    </mesh>
                </group>
            </group>
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
    // Fixed 4-window grid (2x2) - no random noise
    const windowOffsets = useMemo(() => [
        { x: -0.25, y: scale[1] * 0.35 },
        { x: 0.25, y: scale[1] * 0.35 },
        { x: -0.25, y: scale[1] * 0.65 },
        { x: 0.25, y: scale[1] * 0.65 },
    ], [scale]);

    return (
        <group position={position} rotation={[0, rotationY, 0]}>
            <mesh position={[0, scale[1] / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[scale[0], scale[1], scale[2]]} />
                <primitive object={isNight ? materials.buildingNight : materials.buildingDay} />
            </mesh>
            {/* Roof trim for depth */}
            <mesh position={[0, scale[1] + 0.06, 0]} castShadow receiveShadow>
                <boxGeometry args={[scale[0] + 0.12, 0.12, scale[2] + 0.12]} />
                <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.95} metalness={0.02} />
            </mesh>
            {/* Fixed 4-window grid */}
            {windowOffsets.map((w, i) => (
                <mesh key={i} position={[w.x * scale[0], w.y, scale[2] / 2 + 0.01]}>
                    <planeGeometry args={[0.28, 0.38]} />
                    <primitive object={isNight ? materials.windowOn : materials.windowOffDay} />
                </mesh>
            ))}
        </group>
    );
}

export function StreetLamp({ position, isNight = false }: { position: [number, number, number]; isNight?: boolean }) {
    return (
        <group position={position}>
            {/* Base - higher segments */}
            <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.18, 0.22, 0.24, 16]} />
                <primitive object={materials.lampPost} />
            </mesh>
            <mesh position={[0, 1.5, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.08, 3, 12]} />
                <primitive object={materials.lampPost} />
            </mesh>
            <mesh position={[0, 3, 0.3]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.6, 12]} />
                <primitive object={materials.lampPost} />
            </mesh>
            {/* Lamp head */}
            <mesh position={[0, 3.05, 0.62]} castShadow>
                <boxGeometry args={[0.28, 0.16, 0.38]} />
                <primitive object={materials.lampPost} />
            </mesh>
            {/* Light Bulb - higher segments for smoothness */}
            <mesh position={[0, 2.9, 0.6]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial
                    color={isNight ? "#fffbeb" : "#e2e8f0"}
                    emissive={"#fffbeb"}
                    emissiveIntensity={isNight ? 2.6 : 0.05}
                    toneMapped={false}
                    roughness={0.3}
                    metalness={0.0}
                />
            </mesh>
            {isNight && <pointLight position={[0, 2.5, 0.6]} intensity={2.4} distance={9} color="#fffbeb" decay={2} />}
        </group>
    );
}
