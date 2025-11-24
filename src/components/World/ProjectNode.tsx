"use client";

import { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { clsx } from "clsx";

export type ProjectNodeId = "journey" | "skills" | "projects" | "testimonials" | string;

interface ProjectNodeProps {
  id: ProjectNodeId;
  position: [number, number, number];
  label: string;
  onClick: (id: ProjectNodeId) => void;
  isNight: boolean;
}

export function ProjectNode({ id, position, label, onClick, isNight }: ProjectNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      // Rotation
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      {/* Interactive Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
          setHovered(true);
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
          setHovered(false);
        }}
      >
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={hovered ? "#F0ABFC" : isNight ? "#C77DFF" : "#A020F0"}
          emissive={hovered ? "#E879F9" : isNight ? "#7B2CBF" : "#4A044E"}
          emissiveIntensity={hovered ? 2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Glow effect */}
      <pointLight
        distance={3}
        intensity={hovered ? 2 : 1}
        color={isNight ? "#E0AAFF" : "#D946EF"}
      />

      {/* Label */}
      {/* Label - Accessible Button */}
      <Html
        position={[0, 0.8, 0]}
        center
        className="pointer-events-auto" // Enable pointer events for the button
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={clsx(
            "whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",
            isNight ? "bg-black/50 text-purple-200 focus:ring-offset-black" : "bg-white/80 text-purple-900 focus:ring-offset-white",
            hovered ? "scale-110 opacity-100" : "opacity-70"
          )}
          aria-label={`View ${label}`}
        >
          {label}
        </button>
      </Html>
    </group>
  );
}
