"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import * as THREE from "three";
import { Trees, SceneElements } from "./Elements";

export default function World() {
    const groupRef = useRef<THREE.Group>(null);
    const [isNight, setIsNight] = useState(false);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Continuous slow rotation
            groupRef.current.rotation.y += delta * 0.05;

            // Check rotation for Day/Night cycle (simple logic)
            const rotationY = groupRef.current.rotation.y % (Math.PI * 2);
            if (rotationY > Math.PI && !isNight) setIsNight(true);
            if (rotationY <= Math.PI && isNight) setIsNight(false);
        }
    });

    return (
        <>
            {/* Lighting changes based on Day/Night with purple/blue theme */}
            <ambientLight intensity={isNight ? 0.3 : 0.7} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={isNight ? 0.2 : 1.2}
                color={isNight ? "#C77DFF" : "#E0AAFF"}
                castShadow
            />
            {isNight && <pointLight position={[0, 5, 0]} intensity={1.5} color="#9D4EDD" distance={15} />}

            {/* The Rotating World */}
            <group ref={groupRef} position={[0, -2, 0]}>
                {/* Ground - Purple/Blue palette */}
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[10, 64]} />
                    <meshStandardMaterial color={isNight ? "#240046" : "#7B2CBF"} />
                </mesh>

                {/* Elements */}
                <Trees count={20} radius={9} isNight={isNight} />
                <SceneElements isNight={isNight} />
            </group>

            {/* Background Color - Purple/Blue gradient */}
            <color attach="background" args={[isNight ? "#10002B" : "#C77DFF"]} />

            {/* Fog for depth */}
            <fog attach="fog" args={[isNight ? "#10002B" : "#E0AAFF", 10, 30]} />
        </>
    );
}
