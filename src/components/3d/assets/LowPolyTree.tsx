"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface LowPolyTreeProps {
    position?: [number, number, number];
    scale?: number;
    variant?: "conifer" | "rounded" | "tall";
    isNight?: boolean;
}

export default function LowPolyTree({
    position = [0, 0, 0],
    scale = 1,
    variant = "conifer",
    isNight = false,
}: LowPolyTreeProps) {
    const colors = useMemo(() => {
        if (isNight) {
            return {
                trunk: "#3C096C",
                leaves: "#7B2CBF",
                leavesAccent: "#9D4EDD",
            };
        }
        return {
            trunk: "#5A189A",
            leaves: "#7B2CBF",
            leavesAccent: "#C77DFF",
        };
    }, [isNight]);

    const geometry = useMemo(() => {
        switch (variant) {
            case "conifer":
                return {
                    trunkHeight: 1,
                    trunkRadius: 0.15,
                    foliageLayers: 3,
                    foliageType: "cone" as const,
                };
            case "rounded":
                return {
                    trunkHeight: 0.8,
                    trunkRadius: 0.12,
                    foliageLayers: 2,
                    foliageType: "sphere" as const,
                };
            case "tall":
                return {
                    trunkHeight: 1.5,
                    trunkRadius: 0.18,
                    foliageLayers: 4,
                    foliageType: "cone" as const,
                };
        }
    }, [variant]);

    return (
        <group position={position} scale={[scale, scale, scale]}>
            {/* Trunk */}
            <mesh position={[0, geometry.trunkHeight / 2, 0]} castShadow>
                <cylinderGeometry args={[geometry.trunkRadius, geometry.trunkRadius, geometry.trunkHeight, 6]} />
                <meshStandardMaterial color={colors.trunk} />
            </mesh>

            {/* Foliage Layers */}
            {Array.from({ length: geometry.foliageLayers }).map((_, i) => {
                const layerHeight = geometry.trunkHeight + i * 0.5;
                const layerSize = 1.2 - i * 0.2;

                return geometry.foliageType === "cone" ? (
                    <mesh key={i} position={[0, layerHeight, 0]} castShadow>
                        <coneGeometry args={[layerSize * 0.7, 1.2, 6]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? colors.leaves : colors.leavesAccent}
                        />
                    </mesh>
                ) : (
                    <mesh key={i} position={[0, layerHeight, 0]} castShadow>
                        <dodecahedronGeometry args={[layerSize * 0.6, 0]} />
                        <meshStandardMaterial
                            color={i % 2 === 0 ? colors.leaves : colors.leavesAccent}
                        />
                    </mesh>
                );
            })}
        </group>
    );
}
