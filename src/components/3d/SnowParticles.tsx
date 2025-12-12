"use client";

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SnowParticles({ count = 1000 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

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

    useFrame(() => {
        if (!meshRef.current) return;

        for (let i = 0; i < count; i++) {
            // Update positions
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

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
