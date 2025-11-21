"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface IslandProps {
    isNight: boolean;
}

export function Island({ isNight }: IslandProps) {
    // Memoize geometries and materials for performance
    const materials = useMemo(() => {
        return {
            ground: new THREE.MeshStandardMaterial({
                color: isNight ? "#1a0b2e" : "#e0e7ff", // Dark purple vs Light blue-ish white
                flatShading: true,
                roughness: 0.8,
            }),
            grass: new THREE.MeshStandardMaterial({
                color: isNight ? "#2d1b4e" : "#4ade80", // Darker purple vs Green
                flatShading: true,
            }),
            rock: new THREE.MeshStandardMaterial({
                color: isNight ? "#4c1d95" : "#94a3b8", // Deep purple vs Gray
                flatShading: true,
            }),
            treeTrunk: new THREE.MeshStandardMaterial({
                color: isNight ? "#3b0764" : "#78350f", // Very dark purple vs Brown
                flatShading: true,
            }),
            treeLeaves: new THREE.MeshStandardMaterial({
                color: isNight ? "#581c87" : "#22c55e", // Purple vs Green
                flatShading: true,
            }),
        };
    }, [isNight]);

    return (
        <group>
            {/* Main Base Cylinder */}
            <mesh position={[0, -1, 0]} receiveShadow>
                <cylinderGeometry args={[12, 10, 2, 8]} /> {/* Low poly cylinder */}
                <primitive object={materials.ground} attach="material" />
            </mesh>

            {/* Top Grass Layer */}
            <mesh position={[0, 0.1, 0]} receiveShadow>
                <cylinderGeometry args={[11.5, 11.5, 0.4, 8]} />
                <primitive object={materials.grass} attach="material" />
            </mesh>

            {/* Decorative Rocks */}
            <group position={[-4, 0.5, 3]}>
                <mesh castShadow receiveShadow rotation={[0, 0.5, 0]}>
                    <dodecahedronGeometry args={[0.8, 0]} />
                    <primitive object={materials.rock} attach="material" />
                </mesh>
                <mesh position={[1.2, -0.2, 0.5]} castShadow receiveShadow>
                    <dodecahedronGeometry args={[0.5, 0]} />
                    <primitive object={materials.rock} attach="material" />
                </mesh>
            </group>

            <group position={[5, 0.5, -2]}>
                <mesh castShadow receiveShadow rotation={[0.2, 0.2, 0]}>
                    <dodecahedronGeometry args={[1, 0]} />
                    <primitive object={materials.rock} attach="material" />
                </mesh>
            </group>

            {/* Trees */}
            <Tree position={[-3, 0, -4]} materials={materials} scale={1.2} />
            <Tree position={[4, 0, 4]} materials={materials} scale={0.9} />
            <Tree position={[-5, 0, 2]} materials={materials} scale={0.8} />
            <Tree position={[2, 0, -5]} materials={materials} scale={1.1} />
            <Tree position={[6, 0, 1]} materials={materials} scale={0.7} />
        </group>
    );
}

function Tree({
    position,
    materials,
    scale = 1,
}: {
    position: [number, number, number];
    materials: any;
    scale?: number;
}) {
    return (
        <group position={position} scale={scale}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]} castShadow receiveShadow>
                <cylinderGeometry args={[0.2, 0.3, 2, 5]} />
                <primitive object={materials.treeTrunk} attach="material" />
            </mesh>
            {/* Leaves (Cone layers) */}
            <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[1.2, 2, 5]} />
                <primitive object={materials.treeLeaves} attach="material" />
            </mesh>
            <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
                <coneGeometry args={[0.9, 1.5, 5]} />
                <primitive object={materials.treeLeaves} attach="material" />
            </mesh>
        </group>
    );
}
