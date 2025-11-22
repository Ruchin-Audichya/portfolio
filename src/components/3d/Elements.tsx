"use client";

import { useMemo } from "react";
import LowPolyTree from "./assets/LowPolyTree";
import FoodVan from "./assets/FoodVan";
import Cyclist from "./assets/Cyclist";
import { Bench, LampPost, SignPost } from "./assets/StreetElements";

interface ElementsProps {
    isNight?: boolean;
}

export function Trees({ count, radius, isNight = false }: { count: number; radius: number; isNight?: boolean }) {
    const trees = useMemo(() => {
        const variants = ["conifer", "rounded", "tall"] as const;
        return new Array(count).fill(0).map((_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const r = radius * (0.8 + Math.random() * 0.2);
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            return {
                position: [x, 0, z] as [number, number, number],
                scale: 0.5 + Math.random() * 0.5,
                variant: variants[i % variants.length]
            };
        });
    }, [count, radius]);

    return (
        <group>
            {trees.map((tree, i) => (
                <LowPolyTree
                    key={i}
                    position={tree.position}
                    scale={tree.scale}
                    variant={tree.variant}
                    isNight={isNight}
                />
            ))}
        </group>
    );
}

export function SceneElements({ isNight = false }: ElementsProps) {
    return (
        <group>
            {/* Food Van with individual GTA-style lights */}
            <group>
                <FoodVan
                    position={[4, 0, 2]}
                    rotation={[0, -Math.PI / 4, 0]}
                    isNight={isNight}
                />
                {isNight && (
                    <>
                        <pointLight position={[4, 1, 2]} intensity={1.5} distance={4} color="#FFD700" />
                        <pointLight position={[4.5, 0.5, 2.5]} intensity={0.8} distance={2} color="#FF4500" />
                    </>
                )}
            </group>

            {/* Cyclist */}
            <Cyclist
                position={[-3, 0, -3]}
                rotation={[0, Math.PI / 3, 0]}
                animated={true}
                speed={1.2}
                isNight={isNight}
            />

            {/* Benches */}
            <Bench position={[2, 0, -4]} rotation={[0, Math.PI / 6, 0]} />
            <Bench position={[-4, 0, 2]} rotation={[0, -Math.PI / 4, 0]} />

            {/* Lamp Posts with GTA 3DFX-style street lights */}
            <group>
                <LampPost position={[5, 0, -2]} isNight={isNight} />
                {isNight && <pointLight position={[5, 2.5, -2]} intensity={2} distance={8} color="#FFE87C" />}
            </group>

            <group>
                <LampPost position={[-2, 0, 5]} isNight={isNight} />
                {isNight && <pointLight position={[-2, 2.5, 5]} intensity={2} distance={8} color="#FFE87C" />}
            </group>

            <group>
                <LampPost position={[-5, 0, -3]} isNight={isNight} />
                {isNight && <pointLight position={[-5, 2.5, -3]} intensity={2} distance={8} color="#FFE87C" />}
            </group>

            {/* Additional ambient city lights at night (GTA 3DFX style) */}
            {isNight && (
                <>
                    {/* Red traffic/building lights */}
                    <pointLight position={[6, 1, 1]} intensity={0.8} distance={3} color="#FF0000" />
                    <pointLight position={[-6, 1, -1]} intensity={0.8} distance={3} color="#FF0000" />

                    {/* Blue neon-style lights */}
                    <pointLight position={[3, 1, -5]} intensity={1} distance={4} color="#00BFFF" />
                    <pointLight position={[-4, 1, 3]} intensity={1} distance={4} color="#00BFFF" />

                    {/* Warm ambient ground lights */}
                    <pointLight position={[0, 0.5, 0]} intensity={0.5} distance={6} color="#FFA500" />
                </>
            )}

            {/* Sign Posts */}
            <SignPost position={[0, 0, -7]} rotation={[0, 0, 0]} text="PROJECTS" />
            <SignPost position={[6, 0, 0]} rotation={[0, Math.PI / 2, 0]} text="STORY" />
            <SignPost position={[-6, 0, -1]} rotation={[0, -Math.PI / 2, 0]} text="SKILLS" />
        </group>
    );
}
