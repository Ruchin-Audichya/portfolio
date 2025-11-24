"use client";

import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Line } from "@react-three/drei";
import * as THREE from "three";
import { generateSkillGraph, type SkillNode } from "@/lib/skill-graph";
import { useSkillStore } from "@/lib/skill-store";

function GraphNodes({ onNodeClick }: { onNodeClick?: (node: SkillNode) => void }) {
    const { nodes, edges } = useMemo(() => generateSkillGraph(), []);
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const { selectedSkill, setSelectedSkill, searchQuery } = useSkillStore();
    const groupRef = useRef<THREE.Group>(null);
    const { camera } = useThree();

    // Animation
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.05;
        }
    });

    const handleNodeClick = (node: SkillNode) => {
        setSelectedSkill(node.id === selectedSkill ? null : node.id);
        onNodeClick?.(node);

        // Fly to node logic
        const targetPos = new THREE.Vector3(...node.position);
        const offset = targetPos.clone().normalize().multiplyScalar(4);
        const camPos = targetPos.clone().add(offset);
        // In a real implementation, we'd tween the camera here
    };

    // Filter nodes based on search
    const filteredNodes = useMemo(() => {
        if (!searchQuery) return nodes;
        const lowerQuery = searchQuery.toLowerCase();
        return nodes.map(node => ({
            ...node,
            dimmed: !node.label.toLowerCase().includes(lowerQuery) && !node.category.toLowerCase().includes(lowerQuery)
        }));
    }, [nodes, searchQuery]);

    return (
        <group ref={groupRef}>
            {/* Connections */}
            <group>
                {edges.map((edge, i) => {
                    const source = nodes.find(n => n.id === edge.source);
                    const target = nodes.find(n => n.id === edge.target);
                    if (!source || !target) return null;

                    const isConnectedToHover = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);

                    return (
                        <Line
                            key={`${edge.source}-${edge.target}`}
                            points={[source.position, target.position]}
                            color={isConnectedToHover ? "#ffffff" : source.color}
                            transparent
                            opacity={isConnectedToHover ? 0.8 : 0.1}
                            lineWidth={isConnectedToHover ? 2 : 1}
                        />
                    );
                })}
            </group>

            {/* Nodes */}
            {filteredNodes.map((node) => {
                const isSelected = selectedSkill === node.id;
                const isDimmed = (node as any).dimmed;
                const isHovered = hoveredNode === node.id;

                return (
                    <group key={node.id} position={node.position}>
                        <mesh
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNodeClick(node);
                            }}
                            onPointerOver={(e) => {
                                e.stopPropagation();
                                document.body.style.cursor = "pointer";
                                setHoveredNode(node.id);
                            }}
                            onPointerOut={() => {
                                document.body.style.cursor = "auto";
                                setHoveredNode(null);
                            }}
                            scale={isSelected || isHovered ? 1.5 : 1}
                        >
                            <sphereGeometry args={[node.type === 'category' ? 0.4 : 0.2, 16, 16]} />
                            <meshStandardMaterial
                                color={isDimmed ? "#333333" : node.color}
                                emissive={isDimmed ? "#000000" : node.color}
                                emissiveIntensity={isSelected || isHovered ? 2 : 0.5}
                                roughness={0.2}
                                metalness={0.8}
                                transparent
                                opacity={isDimmed ? 0.2 : 1}
                            />
                        </mesh>

                        {/* Label */}
                        {(isSelected || isHovered || node.type === 'category') && !isDimmed && (
                            <Html position={[0, 0.5, 0]} center style={{ pointerEvents: "none" }} zIndexRange={[100, 0]}>
                                <div className={`
                                px-2 py-1 rounded-lg backdrop-blur-md border transition-all duration-300 whitespace-nowrap
                                ${node.type === 'category'
                                        ? "bg-black/60 border-white/20 text-white font-bold"
                                        : "bg-black/40 border-white/10 text-white/80 text-xs"}
                            `}>
                                    {node.label}
                                </div>
                            </Html>
                        )}

                        {/* Detail Panel (Only for selected node) */}
                        {isSelected && (
                            <Html position={[0, -1, 0]} center zIndexRange={[100, 0]}>
                                <div className="w-64 p-4 rounded-xl bg-black/80 border border-purple-500/30 backdrop-blur-xl text-left shadow-2xl">
                                    <h3 className="text-lg font-bold text-white mb-1">{node.label}</h3>
                                    <p className="text-xs text-purple-300 uppercase tracking-wider mb-3">{node.category}</p>
                                    <div className="text-sm text-gray-300 leading-relaxed">
                                        {node.type === 'project' ? 'Project Node' : 'Skill Node'}
                                    </div>
                                </div>
                            </Html>
                        )}
                    </group>
                );
            })}
        </group>
    );
}

export function SkillsGalaxy() {
    return (
        <div className="h-[600px] w-full relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-black/50 to-purple-900/20 backdrop-blur-sm">
            <Canvas camera={{ position: [0, 0, 16], fov: 50 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />
                <GraphNodes />
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    autoRotate
                    autoRotateSpeed={0.5}
                    minDistance={2}
                    maxDistance={20}
                />
            </Canvas>

            {/* UX Hint */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none">
                <div className="px-4 py-2 rounded-full bg-black/60 border border-white/20 backdrop-blur-md animate-pulse">
                    <span className="text-xs text-white/80 uppercase tracking-widest font-medium">
                        🖱️ Drag to Explore • Click to Inspect
                    </span>
                </div>
            </div>

            {/* Bottom indicator */}
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    <span className="text-xs text-white/70 uppercase tracking-widest font-medium">
                        Interactive Skill Mesh
                    </span>
                </div>
            </div>
        </div>
    );
}
