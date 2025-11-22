"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";

function Cloud({ position, speed }: { position: [number, number, number]; speed: number }) {
    const ref = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.position.x += speed * delta;
            if (ref.current.position.x > 15) {
                ref.current.position.x = -15;
            }
        }
    });

    return (
        <group ref={ref} position={position}>
            <Instance position={[-0.5, 0, 0]} scale={[1.2, 1.2, 1.2]} />
            <Instance position={[0.5, 0, 0]} scale={[1.1, 1.1, 1.1]} />
            <Instance position={[0, 0.5, 0]} scale={[1.3, 1.3, 1.3]} />
            <Instance position={[0, -0.2, 0.2]} scale={[1, 1, 1]} />
        </group>
    );
}

export function Clouds({ count = 5, isNight = false }: { count?: number; isNight: boolean }) {
    const clouds = useMemo(() => {
        return new Array(count).fill(0).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                4 + Math.random() * 3,
                (Math.random() - 0.5) * 10
            ] as [number, number, number],
            speed: 0.2 + Math.random() * 0.3
        }));
    }, [count]);

    if (isNight) return null;

    return (
        <Instances range={count * 4}>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshStandardMaterial color="white" transparent opacity={0.8} />
            {clouds.map((cloud, i) => (
                <Cloud key={i} position={cloud.position} speed={cloud.speed} />
            ))}
        </Instances>
    );
}
