"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { content } from "@/lib/content";
import { skills as dataSkills } from "@/data/skills";

// Gem Geometry
const GemGeometry = ({ position, color, label, type }: { position: [number, number, number], color: string, label: string, type: 'skill' | 'cert' }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.2;
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh
                    ref={meshRef}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                    scale={hovered ? 1.3 : 1}
                    onClick={() => setHovered(!hovered)}
                >
                    {type === 'cert' ? (
                        <icosahedronGeometry args={[0.6, 0]} />
                    ) : (
                        <octahedronGeometry args={[0.5, 0]} />
                    )}
                    <meshPhysicalMaterial
                        color={hovered ? "#ffffff" : color}
                        roughness={0.1}
                        metalness={0.8}
                        transmission={0.5}
                        thickness={2}
                        emissive={hovered ? color : "#000000"}
                        emissiveIntensity={hovered ? 2 : 0}
                    />
                </mesh>
            </Float>
            <Html position={[0, type === 'cert' ? -1.4 : -1, 0]} center style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
                <div className={`
          px-3 py-1.5 rounded-full backdrop-blur-md border transition-all duration-300 whitespace-nowrap
          ${hovered ? "opacity-100 scale-110" : "opacity-60 scale-100"}
          ${type === 'cert'
                        ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-200 font-bold shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                        : "bg-purple-500/20 border-purple-500/30 text-purple-200 font-medium"}
        `}>
                    <span className="text-xs tracking-wider">{label}</span>
                </div>
            </Html>
        </group>
    );
};

function Galaxy({ skills, certs }: { skills: string[], certs: any[] }) {
    const groupRef = useRef<THREE.Group>(null);

    // Arrange items in a double helix / cylinder
    const nodes = useMemo(() => {
        const allItems = [
            ...certs.map(c => ({ label: c.name, type: 'cert' as const })),
            ...skills.map(s => ({ label: s, type: 'skill' as const }))
        ];

        return allItems.map((item, i) => {
            const phi = Math.acos(-1 + (2 * i) / allItems.length);
            const theta = Math.sqrt(allItems.length * Math.PI) * phi;

            const r = 5;
            const x = r * Math.cos(theta) * Math.sin(phi);
            const y = r * Math.sin(theta) * Math.sin(phi);
            const z = r * Math.cos(phi);

            return { pos: [x, y, z] as [number, number, number], ...item };
        });
    }, [skills, certs]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <group ref={groupRef}>
            {nodes.map((node, i) => (
                <GemGeometry
                    key={i}
                    position={node.pos}
                    color={node.type === 'cert' ? "#fbbf24" : `hsl(${i * 15}, 70%, 60%)`}
                    label={node.label}
                    type={node.type}
                />
            ))}
        </group>
    );
}

export function SkillsGalaxy() {
    // Flatten skills from content.ts
    const allSkills = content.skills.flatMap(cat => cat.items);
    const certs = dataSkills.certifications;

    return (
        <div className="h-[600px] w-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-black/50 to-purple-900/20 backdrop-blur-sm">
            <Canvas camera={{ position: [0, 0, 14], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
                <Galaxy skills={allSkills} certs={certs} />
                <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    enablePan={false}
                    minPolarAngle={Math.PI / 4}
                    maxPolarAngle={Math.PI * 0.75}
                />
            </Canvas>

            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-xs text-white/70 uppercase tracking-widest font-medium">
                        Interactive 3D Skills Universe
                    </span>
                </div>
            </div>
        </div>
    );
}
