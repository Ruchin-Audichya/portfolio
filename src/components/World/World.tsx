"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Cloud } from "@react-three/drei";
import * as THREE from "three";
import { Island } from "./Island";
import { ProjectNode, type ProjectNodeId } from "./ProjectNode";

interface WorldProps {
  onNodeClick?: (id: ProjectNodeId) => void;
}

export function World({ onNodeClick }: WorldProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isNight, setIsNight] = useState(false);
  const { camera } = useThree();

  // Keyboard toggle for Day/Night
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n") {
        setIsNight((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Gentle floating rotation
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  const handleNodeClick = (id: ProjectNodeId) => {
    if (onNodeClick) onNodeClick(id);
  };

  return (
    <>
      {/* Controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={8}
        maxDistance={20}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping
        dampingFactor={0.05}
      />

      {/* Lighting */}
      <ambientLight intensity={isNight ? 0.2 : 0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={isNight ? 0.2 : 1.5}
        color={isNight ? "#8b5cf6" : "#fff7ed"}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {isNight && (
        <pointLight position={[-5, 5, -5]} intensity={1} color="#4c1d95" distance={20} />
      )}

      {/* Environment */}
      <color attach="background" args={[isNight ? "#0f0518" : "#dbeafe"]} />
      <fog attach="fog" args={[isNight ? "#0f0518" : "#dbeafe", 10, 35]} />

      {isNight && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
      {!isNight && <Cloud position={[-10, 5, -10]} opacity={0.5} speed={0.2} />}
      {!isNight && <Cloud position={[10, 2, -15]} opacity={0.4} speed={0.2} />}

      {/* The Island World */}
      <group ref={groupRef} position={[0, -2, 0]}>
        <Island isNight={isNight} />

        {/* Interactive Nodes */}
        <ProjectNode
          id="journey"
          position={[0, 1.5, 4]}
          label="Journey"
          onClick={handleNodeClick}
          isNight={isNight}
        />
        <ProjectNode
          id="skills"
          position={[-4, 1, 0]}
          label="Skills"
          onClick={handleNodeClick}
          isNight={isNight}
        />
        <ProjectNode
          id="projects"
          position={[4, 1.2, -1]}
          label="Projects"
          onClick={handleNodeClick}
          isNight={isNight}
        />
        <ProjectNode
          id="testimonials"
          position={[0, 1, -4]}
          label="Testimonials"
          onClick={handleNodeClick}
          isNight={isNight}
        />
      </group>
    </>
  );
}
