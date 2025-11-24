"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { skills } from "@/data/skills";
import { computeForceDirectedLayout } from "@/lib/skillGraphLayout";
import { useSkillMeshContext } from "./SkillMeshContext";

export function SkillMesh() {
    const groupRef = useRef<THREE.Group>(null);
    const {
        selectedSkillId,
        hoveredSkillId,
        searchQuery,
        setSelectedSkillId,
        setHoveredSkillId,
    } = useSkillMeshContext();

    const [localHoveredEdge, setLocalHoveredEdge] = useState<string | null>(null);

    // Compute layout once
    const { nodes, edges } = useMemo(() => {
        return computeForceDirectedLayout(skills, 150);
    }, []);

    // Gentle rotation
    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Render edges first (behind nodes) */}
            {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);

                if (!sourceNode || !targetNode) return null;

                const isHighlighted =
                    hoveredSkillId === edge.source ||
                    hoveredSkillId === edge.target ||
                    selectedSkillId === edge.source ||
                    selectedSkillId === edge.target ||
                    localHoveredEdge === `${edge.source}-${edge.target}`;

                const edgeKey = `${edge.source}-${edge.target}`;

                return (
                    <group key={edgeKey}>
                        <Line
                            points={[
                                [sourceNode.x, sourceNode.y, sourceNode.z],
                                [targetNode.x, targetNode.y, targetNode.z],
                            ]}
                            color={isHighlighted ? "#8b5cf6" : "#4a4a4a"}
                            lineWidth={isHighlighted ? 2 : 1}
                            transparent
                            opacity={isHighlighted ? 0.8 : 0.2}
                            onPointerEnter={() => setLocalHoveredEdge(edgeKey)}
                            onPointerLeave={() => setLocalHoveredEdge(null)}
                        />

                        {/* Edge tooltip on hover */}
                        {localHoveredEdge === edgeKey && (
                            <Html
                                position={[
                                    (sourceNode.x + targetNode.x) / 2,
                                    (sourceNode.y + targetNode.y) / 2,
                                    (sourceNode.z + targetNode.z) / 2,
                                ]}
                                center
                            >
                                <div className="px-3 py-2 bg-black/80 text-white text-xs rounded-lg border border-purple-500/30 backdrop-blur-md whitespace-nowrap">
                                    {edge.relationship}
                                </div>
                            </Html>
                        )}
                    </group>
                );
            })}

            {/* Render nodes */}
            {nodes.map((node) => {
                const isHovered = hoveredSkillId === node.id;
                const isSelected = selectedSkillId === node.id;
                const isConnected = edges.some(
                    (e) => (e.source === node.id || e.target === node.id) &&
                        (hoveredSkillId === e.source || hoveredSkillId === e.target)
                );

                // Dim nodes that don't match search
                const isDimmed = searchQuery && !(
                    node.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    node.category.toLowerCase().includes(searchQuery.toLowerCase())
                );

                return (
                    <group key={node.id} position={[node.x, node.y, node.z]}>
                        <mesh
                            onPointerEnter={(e) => {
                                e.stopPropagation();
                                setHoveredSkillId(node.id);
                                document.body.style.cursor = "pointer";
                            }}
                            onPointerLeave={() => {
                                setHoveredSkillId(null);
                                document.body.style.cursor = "auto";
                            }}
                            onClick={() => setSelectedSkillId(node.id === selectedSkillId ? null : node.id)}
                            scale={(isHovered || isSelected) ? 1.3 : isConnected ? 1.1 : isDimmed ? 0.8 : 1}
                        >
                            <sphereGeometry args={[0.3, 16, 16]} />
                            <meshStandardMaterial
                                color={node.colorAccent}
                                emissive={node.colorAccent}
                                emissiveIntensity={(isHovered || isSelected) ? 1 : isConnected ? 0.5 : 0.2}
                                roughness={0.3}
                                metalness={0.8}
                                transparent
                                opacity={isDimmed ? 0.3 : 1}
                            />
                        </mesh>

                        {/* Label (always visible for core nodes, on hover/select for others) */}
                        {(isHovered || isSelected || node.category === "core") && !isDimmed && (
                            <Html position={[0, 0.6, 0]} center distanceFactor={8}>
                                <div className="px-2 py-1 bg-black/70 text-white text-xs rounded backdrop-blur-sm border border-white/10 whitespace-nowrap">
                                    {node.displayName}
                                </div>
                            </Html>
                        )}

                        {/* Detailed tooltip on hover */}
                        {isHovered && (
                            <Html position={[0, -1, 0]} center distanceFactor={8}>
                                <div className="w-48 p-3 bg-black/90 text-white text-xs rounded-xl border border-purple-500/30 backdrop-blur-xl">
                                    <div className="font-bold text-sm mb-1">{node.displayName}</div>
                                    <div className="text-purple-300 text-[10px] uppercase tracking-wider mb-2">
                                        {node.category}
                                    </div>
                                    <div className="text-gray-300 mb-2 leading-relaxed">
                                        {node.shortDescription}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-[10px] text-gray-400 uppercase tracking-wide">
                                            Example Uses:
                                        </div>
                                        {node.exampleUses.map((use, i) => (
                                            <div key={i} className="text-[10px] text-gray-300">
                                                • {use}
                                            </div>
                                        ))}
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
