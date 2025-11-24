"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { Instances, Instance, Detailed } from "@react-three/drei";

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
                roughness: 0.8,
            }),
            rock: new THREE.MeshStandardMaterial({
                color: isNight ? "#4c1d95" : "#94a3b8", // Deep purple vs Gray
                flatShading: true,
                roughness: 0.6,
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
            {/* Main Base Cylinder - LOD */}
            <Detailed distances={[0, 30, 60]}>
                {/* High Detail */}
                <group>
                    <mesh position={[0, -1, 0]} receiveShadow>
                        <cylinderGeometry args={[12, 10, 2, 8]} />
                        <primitive object={materials.ground} attach="material" />
                    </mesh>
                    <mesh position={[0, 0.1, 0]} receiveShadow>
                        <cylinderGeometry args={[11.5, 11.5, 0.4, 8]} />
                        <primitive object={materials.grass} attach="material" />
                    </mesh>
                </group>

                {/* Medium Detail - No grass layer */}
                <mesh position={[0, -1, 0]} receiveShadow>
                    <cylinderGeometry args={[12, 10, 2, 8]} />
                    <primitive object={materials.ground} attach="material" />
                </mesh>

                {/* Low Detail - Lower poly cylinder */}
                <mesh position={[0, -1, 0]}>
                    <cylinderGeometry args={[12, 10, 2, 6]} />
                    <primitive object={materials.ground} attach="material" />
                </mesh>
            </Detailed>

            {/* Decorative Rocks - Hide at distance */}
            <Detailed distances={[0, 25]}>
                <group>
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
                </group>
                <group /> {/* Empty group for far distance */}
            </Detailed>

            {/* Trees - Instanced for performance */}
            <Instances range={5} material={materials.treeTrunk} geometry={new THREE.CylinderGeometry(0.2, 0.3, 2, 5)} castShadow receiveShadow>
                <group position={[0, 1, 0]}>
                    <TreeInstance position={[-3, 0, -4]} scale={1.2} />
                    <TreeInstance position={[4, 0, 4]} scale={0.9} />
                    <TreeInstance position={[-5, 0, 2]} scale={0.8} />
                    <TreeInstance position={[2, 0, -5]} scale={1.1} />
                    <TreeInstance position={[6, 0, 1]} scale={0.7} />
                </group>
            </Instances>

            <Instances range={5} material={materials.treeLeaves} geometry={new THREE.ConeGeometry(1.2, 2, 5)} castShadow receiveShadow>
                <group position={[0, 2.5, 0]}>
                    <TreeInstance position={[-3, 0, -4]} scale={1.2} />
                    <TreeInstance position={[4, 0, 4]} scale={0.9} />
                    <TreeInstance position={[-5, 0, 2]} scale={0.8} />
                    <TreeInstance position={[2, 0, -5]} scale={1.1} />
                    <TreeInstance position={[6, 0, 1]} scale={0.7} />
                </group>
            </Instances>

            <Instances range={5} material={materials.treeLeaves} geometry={new THREE.ConeGeometry(0.9, 1.5, 5)} castShadow receiveShadow>
                <group position={[0, 3.5, 0]}>
                    <TreeInstance position={[-3, 0, -4]} scale={1.2} />
                    <TreeInstance position={[4, 0, 4]} scale={0.9} />
                    <TreeInstance position={[-5, 0, 2]} scale={0.8} />
                    <TreeInstance position={[2, 0, -5]} scale={1.1} />
                    <TreeInstance position={[6, 0, 1]} scale={0.7} />
                </group>
            </Instances>
        </group>
    );
}

function TreeInstance({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
    return <Instance position={position} scale={scale} />;
}
