"use client";

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SnowParticles({
    count = 1000,
    visibleCount = count,
    fps = 26,
}: {
    count?: number;
    visibleCount?: number;
    fps?: number;
}) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const tickRef = useRef(0);

    const { positions, velocities } = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const vel = [];

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 100; // Spread x
            pos[i * 3 + 1] = Math.random() * 40;      // Spread y
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100; // Spread z

            vel.push({
                x: (Math.random() - 0.5) * 0.05,
                y: -(Math.random() * 0.05 + 0.02), // Falling down
                z: (Math.random() - 0.5) * 0.05
            });
        }
        return { positions: pos, velocities: vel };
    }, [count]);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (!meshRef.current) return;
        meshRef.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    }, []);

    useFrame((_state, delta) => {
        if (!meshRef.current) return;

        // Update at a lower rate to reduce per-frame CPU work.
        tickRef.current += delta;
        const targetFps = Math.max(10, Math.min(60, fps));
        if (tickRef.current < 1 / targetFps) return;
        const step = tickRef.current;
        tickRef.current = 0;

        // Render/update only the visible subset to reduce work.
        const activeCount = Math.max(0, Math.min(visibleCount, count));
        meshRef.current.count = activeCount;

        for (let i = 0; i < activeCount; i++) {
            // Update positions
            positions[i * 3] += velocities[i].x * (step * 60);
            positions[i * 3 + 1] += velocities[i].y * (step * 60);
            positions[i * 3 + 2] += velocities[i].z * (step * 60);

            // Reset if below ground
            if (positions[i * 3 + 1] < -2) {
                positions[i * 3 + 1] = 40;
            }

            dummy.position.set(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            );
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.05, 0]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </instancedMesh>
    );
}
