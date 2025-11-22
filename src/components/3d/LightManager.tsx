import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { VolumetricBeam } from './VolumetricBeam';
import * as THREE from 'three';

interface LightManagerProps {
    isNight: boolean;
}

export function LightManager({ isNight }: LightManagerProps) {
    const groupRef = useRef<THREE.Group>(null);

    // GTA San Andreas Color Palette (converted from RGB)
    const colors = {
        yellow: '#ffaa00', // Street lamps
        white: '#ffffff',  // Headlights/Spotlights
        pink: '#ff7586',   // Neon/Special
        blue: '#4488ff'    // Ambient
    };

    useFrame((state) => {
        if (groupRef.current) {
            // Distance fading logic from C++ source
            // Iterate through children and fade based on distance to camera
            groupRef.current.children.forEach((child) => {
                if (child instanceof THREE.Mesh) {
                    const dist = child.position.distanceTo(state.camera.position);
                    const material = child.material as THREE.ShaderMaterial;

                    // Logic: if (fDistSqr > 50.0f*50.0f && fDistSqr < 300.0f*300.0f)
                    if (dist > 50) {
                        // Simple linear fade out
                        // material.uniforms.opacity.value = THREE.MathUtils.lerp(0.6, 0, (dist - 50) / 100);
                    }
                }
            });
        }
    });

    if (!isNight) return null;

    return (
        <group ref={groupRef}>
            {/* Street Lamps (Yellow) */}
            <VolumetricBeam position={[-5, 4, -5]} color={colors.yellow} scale={[1.5, 8, 1.5]} opacity={0.4} />
            <VolumetricBeam position={[5, 4, -2]} color={colors.yellow} scale={[1.5, 8, 1.5]} opacity={0.4} />
            <VolumetricBeam position={[-2, 4, 8]} color={colors.yellow} scale={[1.5, 8, 1.5]} opacity={0.4} />

            {/* Food Van Area (Pink/White Mix) */}
            <VolumetricBeam position={[8, 3, 5]} color={colors.pink} scale={[1, 4, 1]} opacity={0.5} />

            {/* Ambient Ground Glows (Blue) */}
            <VolumetricBeam position={[0, 0.5, 0]} color={colors.blue} scale={[5, 1, 5]} opacity={0.1} />
        </group>
    );
}
