import React, { forwardRef } from "react";
import * as THREE from "three";

export const Cyclist = forwardRef<THREE.Group, { isNight: boolean }>(function Cyclist({ isNight }, ref) {
  return (
    <group ref={ref}>
      <mesh position={[-0.5, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.07, 12, 24]} />
        <meshStandardMaterial color={isNight ? "#a5b4fc" : "#0f172a"} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.4, 0.07, 12, 24]} />
        <meshStandardMaterial color={isNight ? "#a5b4fc" : "#0f172a"} metalness={0.3} roughness={0.5} />
      </mesh>
      <mesh position={[0.15, 0.6, 0]} rotation={[0, 0, 0.05]}>
        <boxGeometry args={[1.4, 0.08, 0.08]} />
        <meshStandardMaterial color={isNight ? "#7c3aed" : "#3b82f6"} emissive={isNight ? "#7c3aed" : undefined} emissiveIntensity={isNight ? 1.5 : 0} />
      </mesh>
      <mesh position={[0.15, 0.3, 0]} rotation={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 8]} />
        <meshStandardMaterial color={isNight ? "#c084fc" : "#475569"} />
      </mesh>
      <group position={[0.1, 0.9, 0]}>
        <mesh position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.25, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.6, 8]} />
          <meshStandardMaterial color={isNight ? "#0ea5e9" : "#0ea5e9"} emissive={isNight ? "#0ea5e9" : undefined} emissiveIntensity={isNight ? 0.8 : 0} />
        </mesh>
        <mesh position={[-0.2, -0.2, 0]} rotation={[0, 0, Math.PI / 6]}>
          <boxGeometry args={[0.4, 0.12, 0.12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      </group>
      {isNight && <pointLight position={[1.1, 0.5, 0]} intensity={2} distance={6} color="#7dd3fc" decay={2} />}
    </group>
  );
});
