import React, { useMemo } from "react";
import { CityBuilding } from "../LowPolyAssets";
import type { QualityTier } from "@/lib/three/performance";

export function DowntownCluster({
  isNight,
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
  quality = "high",
}: {
  isNight: boolean;
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
  quality?: QualityTier;
}) {
  const buildings = useMemo(
    () => [
      // Reduced to 3 key buildings for cleaner silhouette
      { id: "dt-1", position: [-1.8, 0, -1.2] as [number, number, number], scale: [2.2, 6.5, 2.0] as [number, number, number], rot: -Math.PI / 6 },
      { id: "dt-2", position: [1.5, 0, 0.0] as [number, number, number], scale: [1.8, 5.0, 1.8] as [number, number, number], rot: -Math.PI / 8 },
      { id: "dt-3", position: [-0.5, 0, 1.8] as [number, number, number], scale: [1.5, 4.0, 1.5] as [number, number, number], rot: Math.PI / 10 },
    ],
    []
  );

  const emissiveBoost = quality === "high" ? 1.0 : 1.5;

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Simple ground pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color={isNight ? "#0b1224" : "#cbd5e1"} roughness={0.95} metalness={0.0} />
      </mesh>

      {buildings.map((b) => (
        <CityBuilding key={b.id} position={b.position} scale={b.scale} rotationY={b.rot} isNight={isNight} />
      ))}

      {/* Rooftop accent bars (emissive only) */}
      <group>
        <mesh position={[-1.8, 6.8, -1.2]} rotation={[0, -Math.PI / 6, 0]}>
          <boxGeometry args={[1.8, 0.14, 0.14]} />
          <meshStandardMaterial emissive="#22d3ee" emissiveIntensity={(isNight ? 1.8 : 0.12) * emissiveBoost} color="#22d3ee" toneMapped={false} />
        </mesh>
        <mesh position={[1.5, 5.3, 0.0]} rotation={[0, -Math.PI / 8, 0]}>
          <boxGeometry args={[1.4, 0.14, 0.14]} />
          <meshStandardMaterial emissive="#f472b6" emissiveIntensity={(isNight ? 1.7 : 0.12) * emissiveBoost} color="#f472b6" toneMapped={false} />
        </mesh>

        {/* Point lights only at high quality */}
        {isNight && quality === "high" && (
          <>
            <pointLight position={[-1.8, 6.8, -1.2]} intensity={1.0} distance={10} color="#22d3ee" decay={2} />
            <pointLight position={[1.5, 5.3, 0.0]} intensity={0.9} distance={10} color="#f472b6" decay={2} />
          </>
        )}
      </group>
    </group>
  );
}
