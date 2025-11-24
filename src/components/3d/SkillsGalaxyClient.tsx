"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { content } from "@/lib/content";
import { skills as dataSkills } from "@/data/skills";

// Smooth Gem Geometry with GTA-style glow
const GemGeometry = ({ position, color, label, type }: { position: [number, number, number], color: string, label: string, type: 'skill' | 'cert' }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const { size } = useThree();
    const isMobile = size.width < 768;

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += delta * 0.15;
            meshRef.current.rotation.y += delta * 0.2;
        }
    });

    const sizeScale = type === 'cert' ? 0.4 : 0.3;
    const showLabel = hovered || isMobile;

    return (
        <group position={position}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.4 : 1}
            >
                <sphereGeometry args={[sizeScale, 16, 16]} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : color}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={color}
                    emissiveIntensity={hovered ? 1.5 : 0.3}
                />
            </mesh>

            {hovered && (
                <pointLight
                    position={[0, 0, 0]}
                    intensity={2}
                    distance={3}
                    color={color}
                />
            )}

            {showLabel && (
                <Html position={[0, type === 'cert' ? -0.9 : -0.7, 0]} center style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
                    <div className={`
                        px-2 py-1 md:px-3 md:py-2 rounded-lg backdrop-blur-md border transition-all duration-300 whitespace-nowrap
                        ${type === 'cert'
                            ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-100 font-bold shadow-[0_0_20px_rgba(234,179,8,0.4)]"
                            : "bg-purple-500/20 border-purple-500/40 text-purple-100 font-medium shadow-[0_0_15px_rgba(168,85,247,0.3)]"}
                    `}>
                        <span className="text-[10px] md:text-xs tracking-wide">{label}</span>
                    </div>
                </Html>
            )}
        </group>
    );
};

function Galaxy({ skills, certs }: { skills: string[], certs: any[] }) {
    const groupRef = useRef<THREE.Group>(null);
    const [isInteracting, setIsInteracting] = useState(false);

    // Arrange items in a sphere
    const nodes = useMemo(() => {
        const safeCerts = Array.isArray(certs) ? certs : [];
        const safeSkills = Array.isArray(skills) ? skills : [];

        const allItems = [
            ...safeCerts.map(c => ({ label: c.title, type: 'cert' as const })),
            ...safeSkills.map(s => ({ label: s, type: 'skill' as const }))
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
        if (groupRef.current && !isInteracting) {
            groupRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <>
            <group ref={groupRef}>
                {Array.isArray(nodes) && nodes.map((node, i) => (
                    <GemGeometry
                        key={i}
                        position={node.pos}
                        color={node.type === 'cert' ? "#fbbf24" : `hsl(${i * 15}, 70%, 60%)`}
                        label={node.label}
                        type={node.type}
                    />
                ))}
            </group>

            <OrbitControls
                enableZoom={false}
                autoRotate={!isInteracting}
                autoRotateSpeed={0.5}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI * 0.75}
                onStart={() => setIsInteracting(true)}
                onEnd={() => setTimeout(() => setIsInteracting(false), 2000)}
                makeDefault
            />
        </>
    );
}

function CanvasLoader() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
                <p className="text-sm text-white/50">Loading 3D Skills Universe...</p>
            </div>
        </div>
    );
}

import { achievements } from "@/data/achievements";

// ...

export function SkillsGalaxyClient() {
    const allSkills = content.skills.flatMap(cat => cat.items);
    const certs = achievements;

    return (
        <div className="h-[600px] w-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-black/50 to-purple-900/20 backdrop-blur-sm">
            <Suspense fallback={<CanvasLoader />}>
                <Canvas camera={{ position: [0, 0, 16], fov: 50 }}>
                    <ambientLight intensity={0.6} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
                    <pointLight position={[0, 10, -10]} intensity={0.4} color="#3b82f6" />
                    <Galaxy skills={allSkills} certs={certs} />
                </Canvas>
            </Suspense>

            {/* UX Hint */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="px-4 py-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-md animate-pulse">
                    <span className="text-xs text-white/80 uppercase tracking-widest font-medium">
                        🖱️ Drag to Explore • Hover to See Skills
                    </span>
                </div>
            </div>

            {/* Bottom indicator */}
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
