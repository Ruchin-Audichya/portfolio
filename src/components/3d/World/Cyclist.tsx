import React, { forwardRef } from "react";
import * as THREE from "three";

export const Cyclist = forwardRef<THREE.Group, { isNight: boolean }>(function Cyclist({ isNight }, ref) {
  return (
    <group ref={ref}>
      {/* Wheels */}
      <mesh position={[-0.6, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.42, 0.065, 8, 16]} />
        <meshStandardMaterial color={isNight ? "#a5b4fc" : "#0f172a"} metalness={0.25} roughness={0.55} />
      </mesh>
      <mesh position={[0.85, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.42, 0.065, 8, 16]} />
        <meshStandardMaterial color={isNight ? "#a5b4fc" : "#0f172a"} metalness={0.25} roughness={0.55} />
      </mesh>

      {/* Frame */}
      <mesh position={[0.12, 0.6, 0]} rotation={[0, 0, 0.05]} castShadow>
        <boxGeometry args={[1.55, 0.09, 0.09]} />
        <meshStandardMaterial
          color={isNight ? "#7c3aed" : "#2563eb"}
          emissive={isNight ? "#7c3aed" : "#000000"}
          emissiveIntensity={isNight ? 1.35 : 0.0}
          toneMapped={false}
          metalness={0.15}
          roughness={0.55}
        />
      </mesh>
      <mesh position={[0.12, 0.3, 0]} rotation={[0, 0, -0.1]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.65, 8]} />
        <meshStandardMaterial color={isNight ? "#c084fc" : "#475569"} metalness={0.15} roughness={0.7} />
      </mesh>

      {/* Seat + handlebar */}
      <mesh position={[0.15, 0.95, 0]} castShadow>
        <boxGeometry args={[0.32, 0.07, 0.18]} />
        <meshStandardMaterial color={"#111827"} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh position={[0.75, 0.82, 0]} rotation={[0, 0, 0.15]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.06]} />
        <meshStandardMaterial color={isNight ? "#0ea5e9" : "#334155"} emissive={isNight ? "#0ea5e9" : "#000000"} emissiveIntensity={isNight ? 0.9 : 0.0} toneMapped={false} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Rider */}
      <group position={[0.05, 1.0, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <sphereGeometry args={[0.24, 8, 8]} />
          <meshStandardMaterial color={isNight ? "#fbbf24" : "#fde68a"} roughness={0.6} metalness={0.0} />
        </mesh>
        <mesh position={[0, 0.1, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.18, 0.65, 6]} />
          <meshStandardMaterial color={isNight ? "#0ea5e9" : "#2563eb"} emissive={isNight ? "#0ea5e9" : "#000000"} emissiveIntensity={isNight ? 0.75 : 0.0} toneMapped={false} roughness={0.65} metalness={0.05} />
        </mesh>
        <mesh position={[-0.2, -0.18, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
          <boxGeometry args={[0.42, 0.12, 0.12]} />
          <meshStandardMaterial color={"#1e293b"} roughness={0.75} metalness={0.1} />
        </mesh>
      </group>

      {/* Headlight (night only) */}
      {isNight && <pointLight position={[1.15, 0.55, 0]} intensity={2} distance={6} color="#7dd3fc" decay={2} />}
    </group>
  );
});
