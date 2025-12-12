"use client";

import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Generate a simple glow texture programmatically
function getGlowTexture() {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext("2d");
    if (context) {
        const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.2, "rgba(255, 255, 255, 0.8)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.2)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 32, 32);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.premultiplyAlpha = true;
    return texture;
}

export function CityCoronas({ count = 3000, materialRef }: { count?: number; materialRef?: React.Ref<THREE.PointsMaterial> }) {
    const texture = useMemo(() => getGlowTexture(), []);
    const pointsRef = useRef<THREE.Points>(null);
    const prevBlinkOn = useRef<boolean>(false);

    // Data for blinking
    const blinkIndices = useRef<number[]>([]);

    const { positions, colors, sizes } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        blinkIndices.current = [];

        // GTA SA Project2DFX Inspired Palette
        const palette = {
            orange: new THREE.Color("#ff9434"), // Streetlamps (255 148 052)
            amber: new THREE.Color("#e15023"),  // Airport/Industrial (225 080 035)
            red: new THREE.Color("#ff0505"),    // Towers (255 005 005)
            white: new THREE.Color("#ffffff"),  // General
            blue: new THREE.Color("#d7e6ff"),   // Office/Modern
            pink: new THREE.Color("#fe7586"),   // "Gay Lamppost" (254 117 134)
            green: new THREE.Color("#00ff00"),  // Traffic Light
        };

        let i = 0;

        // 1. "Highways" - Concentric Rings of Orange Lights
        // Simulates main roads circling the city
        const rings = [25, 35, 50, 70];
        rings.forEach((r) => {
            const lightsInRing = Math.floor(r * 4);
            for (let j = 0; j < lightsInRing && i < count; j++) {
                const angle = (j / lightsInRing) * Math.PI * 2;
                // Add some noise to radius to make it look organic
                const radius = r + (Math.random() - 0.5) * 2;

                positions[i * 3] = Math.cos(angle) * radius;
                positions[i * 3 + 1] = 0.5 + Math.random() * 0.5; // Ground level
                positions[i * 3 + 2] = Math.sin(angle) * radius;

                const c = palette.orange;
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                sizes[i] = 1.5 + Math.random();
                i++;
            }
        });

        // 2. "Skyscrapers" - Vertical Grids of White/Blue
        // Simulates distant buildings
        const buildings = 40;
        for (let b = 0; b < buildings && i < count; b++) {
            // Random cluster center
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 40;
            const cx = Math.cos(angle) * dist;
            const cz = Math.sin(angle) * dist;

            const height = 5 + Math.random() * 15;
            const width = 2 + Math.random() * 3;

            // Create a grid for this building
            const wins = Math.floor(height * width);
            for (let w = 0; w < wins && i < count; w++) {
                if (Math.random() > 0.4) continue; // Some lights off

                const wx = (Math.random() - 0.5) * width;
                const wy = Math.random() * height;
                const wz = (Math.random() - 0.5) * width;

                positions[i * 3] = cx + wx;
                positions[i * 3 + 1] = wy;
                positions[i * 3 + 2] = cz + wz;

                const c = Math.random() > 0.7 ? palette.blue : palette.white;
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                sizes[i] = 0.8 + Math.random() * 0.5;
                i++;
            }

            // 3. "Radio Tower" - Red Blinker on top of some buildings
            if (height > 12 && i < count) {
                positions[i * 3] = cx;
                positions[i * 3 + 1] = height + 2; // Antenna tip
                positions[i * 3 + 2] = cz;

                const c = palette.red;
                colors[i * 3] = c.r;
                colors[i * 3 + 1] = c.g;
                colors[i * 3 + 2] = c.b;

                sizes[i] = 2.5;
                blinkIndices.current.push(i); // Mark for blinking
                i++;
            }
        }

        // 4. Fill remaining with random distant "Ambient" lights (Airport/Industrial)
        while (i < count) {
            const angle = Math.random() * Math.PI * 2;
            const r = 20 + Math.random() * 80;

            positions[i * 3] = Math.cos(angle) * r;
            positions[i * 3 + 1] = Math.random() * 3;
            positions[i * 3 + 2] = Math.sin(angle) * r;

            const c = Math.random() > 0.8 ? palette.amber : palette.white;
            colors[i * 3] = c.r;
            colors[i * 3 + 1] = c.g;
            colors[i * 3 + 2] = c.b;

            sizes[i] = 1.0;
            i++;
        }

        return { positions, colors, sizes };
    }, [count]);

    // Blinking Animation
    useFrame((state) => {
        if (!pointsRef.current) return;

        const time = state.clock.elapsedTime;
        const geometry = pointsRef.current.geometry;
        const sizesAttr = geometry.attributes.size;

        // Blink every second or so
        const isOn = Math.sin(time * 3) > 0;

        // Only touch the buffer when the state toggles to avoid per-frame uploads
        if (isOn !== prevBlinkOn.current) {
            blinkIndices.current.forEach((idx) => {
                // Toggle size between 0 and original (approx 2.5)
                sizesAttr.setX(idx, isOn ? 2.5 : 0);
            });
            sizesAttr.needsUpdate = true;
            prevBlinkOn.current = isOn;
        }
    });

    // Clean up generated texture when unmounting
    useEffect(() => {
        return () => {
            texture?.dispose();
        };
    }, [texture]);

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={count}
                    array={colors}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
            </bufferGeometry>
            <pointsMaterial
                ref={materialRef}
                size={1}
                vertexColors
                map={texture || undefined}
                transparent
                depthWrite={false}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
                opacity={0.9}
            />
        </points>
    );
}
