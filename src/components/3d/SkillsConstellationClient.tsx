"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { content } from "@/lib/content";
import { skills as dataSkills } from "@/data/skills";
import { achievements } from "@/data/achievements";

// Skill Orb with always-visible label
const SkillOrb = ({
    position,
    color,
    label,
    type,
    size = 0.15
}: {
    position: [number, number, number],
    color: string,
    label: string,
    type: 'cert' | 'skill',
    size?: number
}) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const { size: windowSize } = useThree();
    const isMobile = windowSize.width < 768;

    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.3;
        }
    });

    const orbSize = type === 'cert' ? size * 1.5 : size;

    return (
        <group position={position}>
            {/* The orb itself */}
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={hovered ? 1.2 : 1}
            >
                <sphereGeometry args={[orbSize, 12, 12]} />
                <meshStandardMaterial
                    color={hovered ? "#ffffff" : color}
                    roughness={0.3}
                    metalness={0.7}
                    emissive={color}
                    emissiveIntensity={hovered ? 0.8 : 0.4}
                />
            </mesh>

            {/* Glow on hover */}
            {hovered && (
                <pointLight
                    position={[0, 0, 0]}
                    intensity={1.5}
                    distance={2}
                    color={color}
                />
            )}

            {/* Always visible label */}
            <Html
                position={[0, orbSize + 0.25, 0]}
                center
                style={{ pointerEvents: "none" }}
                distanceFactor={isMobile ? 6 : 8}
            >
                <div className={`
                    px-2 py-1 rounded-md backdrop-blur-sm border transition-all duration-200
                    ${type === 'cert'
                        ? "bg-yellow-500/30 border-yellow-500/60 text-yellow-100 font-semibold shadow-lg"
                        : "bg-purple-500/20 border-purple-400/50 text-purple-100 font-normal"}
                    ${hovered ? "scale-110 shadow-xl" : ""}
                `}>
                    <span className="text-[9px] md:text-[10px] whitespace-nowrap tracking-wide">
                        {label}
                    </span>
                </div>
            </Html>
        </group>
    );
};

// Category Ring with label
const CategoryRing = ({
    radius,
    skills,
    color,
    label,
    yPosition = 0
}: {
    radius: number,
    skills: string[],
    color: string,
    label: string,
    yPosition?: number
}) => {
    const ringRef = useRef<THREE.Group>(null);

    // Arrange skills in a circle
    const skillPositions = useMemo(() => {
        if (!Array.isArray(skills)) return [];
        return skills.map((skill, i) => {
            const angle = (i / skills.length) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            return { skill, position: [x, yPosition, z] as [number, number, number] };
        });
    }, [skills, radius, yPosition]);

    return (
        <group ref={ringRef}>
            {/* Category label in center */}
            <Html position={[0, yPosition + 2, 0]} center>
                <div className="px-4 py-2 rounded-full bg-black/60 border border-white/30 backdrop-blur-md">
                    <span className="text-sm font-bold text-white uppercase tracking-widest" style={{ color }}>
                        {label}
                    </span>
                </div>
            </Html>

            {/* Ring guide (subtle) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, yPosition, 0]}>
                <ringGeometry args={[radius - 0.05, radius + 0.05, 64]} />
                <meshBasicMaterial color={color} transparent opacity={0.1} />
            </mesh>

            {/* Skills */}
            {Array.isArray(skillPositions) && skillPositions.map(({ skill, position }, i) => (
                <SkillOrb
                    key={i}
                    position={position}
                    color={color}
                    label={skill}
                    type="skill"
                />
            ))}
        </group>
    );
};

// Main Constellation Scene
function SkillConstellation() {
    const groupRef = useRef<THREE.Group>(null);
    const [isInteracting, setIsInteracting] = useState(false);

    // Get skills by category
    const cloudSkills = content.skills.find(c => c.category === "Cloud & AWS")?.items || [];
    const aiSkills = content.skills.find(c => c.category === "AI-Driven Dev")?.items || [];
    const frontendSkills = content.skills.find(c => c.category === "Frontend & Motion")?.items || [];
    const certs = achievements;

    // Certifications at top
    const certPositions = useMemo(() => {
        if (!Array.isArray(certs)) return [];
        return certs.map((cert, i) => {
            const angle = (i / certs.length) * Math.PI * 2;
            const x = Math.cos(angle) * 1.5;
            const z = Math.sin(angle) * 1.5;
            return { cert, position: [x, 3.5, z] as [number, number, number] };
        });
    }, [certs]);

    useFrame((state, delta) => {
        if (groupRef.current && !isInteracting) {
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    return (
        <>
            <group ref={groupRef}>
                {/* Certifications (Top) */}
                <Html position={[0, 4.5, 0]} center>
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-yellow-500/60 backdrop-blur-md">
                        <span className="text-sm font-bold text-yellow-100 uppercase tracking-widest">
                            ⭐ Certifications
                        </span>
                    </div>
                </Html>
                {Array.isArray(certPositions) && certPositions.map(({ cert, position }, i) => (
                    <SkillOrb
                        key={i}
                        position={position}
                        color="#fbbf24"
                        label={cert.title}
                        type="cert"
                        size={0.2}
                    />
                ))}

                {/* Cloud & AWS Ring (Outer) */}
                <CategoryRing
                    radius={4}
                    skills={cloudSkills}
                    color="#3b82f6"
                    label="Cloud & AWS"
                    yPosition={1.5}
                />

                {/* AI/ML Ring (Middle) */}
                <CategoryRing
                    radius={3}
                    skills={aiSkills}
                    color="#a855f7"
                    label="AI-Driven Dev"
                    yPosition={0}
                />

                {/* Frontend Ring (Inner) */}
                <CategoryRing
                    radius={2}
                    skills={frontendSkills}
                    color="#10b981"
                    label="Frontend & Motion"
                    yPosition={-1.5}
                />
            </group>

            <OrbitControls
                enableZoom={false}
                autoRotate={!isInteracting}
                autoRotateSpeed={0.3}
                enablePan={false}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI * 0.7}
                onStart={() => setIsInteracting(true)}
                onEnd={() => setTimeout(() => setIsInteracting(false), 3000)}
                makeDefault
            />
        </>
    );
}

// Loading component
function ConstellationLoader() {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 relative mx-auto">
                    <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-white/50 font-medium">Loading Skill Constellation...</p>
            </div>
        </div>
    );
}

// Main export
export function SkillsConstellationClient() {
    return (
        <div className="h-[700px] w-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-black/60 via-purple-900/10 to-black/60 backdrop-blur-sm">
            <Canvas camera={{ position: [0, 2, 12], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.8} />
                <pointLight position={[-10, -10, -10]} intensity={0.4} color="#a855f7" />
                <pointLight position={[0, 15, -10]} intensity={0.6} color="#3b82f6" />
                <SkillConstellation />
            </Canvas>

            {/* Instructions */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="px-6 py-3 rounded-full bg-black/70 border border-white/20 backdrop-blur-md">
                    <span className="text-xs text-white/90 uppercase tracking-widest font-medium">
                        🌌 Drag to Rotate • All Skills Visible
                    </span>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-6 left-6 pointer-events-none">
                <div className="space-y-2 px-4 py-3 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-xs text-yellow-100 font-medium">Certifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-blue-100">Cloud & AWS</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-purple-100">AI-Driven Dev</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-xs text-green-100">Frontend & Motion</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
