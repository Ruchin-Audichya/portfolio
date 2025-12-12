import React from "react";
import { MeshStandardMaterial } from "three";

interface RoadRingProps {
  roadMat: React.MutableRefObject<MeshStandardMaterial | null>;
  isNight: boolean;
}

export function RoadRing({ roadMat, isNight }: RoadRingProps) {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
        <ringGeometry args={[11, 14, 64]} />
        <meshStandardMaterial ref={roadMat} color="#4a5568" roughness={0.65} metalness={0.1} />
      </mesh>

      <group>
        {[
          [0, 0, 14],
          [0, 0, -14],
          [14, 0, 0],
          [-14, 0, 0],
        ].map((pos, idx) => (
          <group key={idx} position={pos as [number, number, number]} rotation={[0, idx % 2 === 0 ? 0 : Math.PI / 2, 0]}>
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[4, 2]} />
              <meshStandardMaterial color="#111827" metalness={0.2} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[3.6, 0.4]} />
              <meshStandardMaterial emissive={isNight ? "#f97316" : "#22c55e"} emissiveIntensity={isNight ? 2.4 : 1.4} color="#f97316" toneMapped={false} />
            </mesh>
            <pointLight position={[0, 0.7, 0]} intensity={isNight ? 3.0 : 1.4} distance={9} color={isNight ? "#f97316" : "#22c55e"} decay={1.8} />
          </group>
        ))}
      </group>

      <group>
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const r = 12.5;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          const color = i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#f472b6" : "#fbbf24";
          return <pointLight key={i} position={[x, 0.4, z]} intensity={isNight ? 2.6 : 1.0} distance={7} color={color} decay={1.8} />;
        })}
      </group>
    </>
  );
}
