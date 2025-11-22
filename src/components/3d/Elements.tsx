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
            <FoodVan
                position={[4, 0, 2]}
                rotation={[0, -Math.PI / 4, 0]}
                isNight={isNight}
            />

            <Cyclist
                position={[-3, 0, -3]}
                rotation={[0, Math.PI / 3, 0]}
                animated={true}
                speed={1.2}
                isNight={isNight}
            />

            <Bench position={[2, 0, -4]} rotation={[0, Math.PI / 6, 0]} />
            <Bench position={[-4, 0, 2]} rotation={[0, -Math.PI / 4, 0]} />

            <SignPost position={[0, 0, -7]} rotation={[0, 0, 0]} text="PROJECTS" />
            <SignPost position={[6, 0, 0]} rotation={[0, Math.PI / 2, 0]} text="STORY" />
            <SignPost position={[-6, 0, -1]} rotation={[0, -Math.PI / 2, 0]} text="SKILLS" />
        </group>
    );
}
