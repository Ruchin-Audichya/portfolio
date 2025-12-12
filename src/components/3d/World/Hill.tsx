import React, { useMemo } from "react";
import { MeshStandardMaterial, Color, CylinderGeometry } from "three";
import { LowPolyTree } from "../LowPolyAssets";

interface HillProps {
  palette: {
    hillDay: Color;
    hillNight: Color;
    groundDay: Color;
    groundNight: Color;
  };
  hillMat: React.MutableRefObject<MeshStandardMaterial | null>;
  groundMat: React.MutableRefObject<MeshStandardMaterial | null>;
  isNight: boolean;
}

export function Hill({ palette, hillMat, groundMat, isNight }: HillProps) {
  const coneGeometry = useMemo(() => new CylinderGeometry(3, 9, 8, 12, 1, false), []);

  return (
    <>
      <mesh position={[0, 3, 0]} receiveShadow rotation={[0, Math.PI / 12, 0]} geometry={coneGeometry}>
        <meshStandardMaterial ref={hillMat} color={palette.hillDay} roughness={0.9} flatShading />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial ref={groundMat} color={palette.groundDay} roughness={0.9} />
      </mesh>

      <group>
        <LowPolyTree position={[2, 4, 2]} scale={0.8} />
        <LowPolyTree position={[-3, 5, 1]} scale={0.9} />
        <LowPolyTree position={[1, 6, -2]} scale={0.7} />
        <LowPolyTree position={[-2, 3, -3]} scale={1} />
        <LowPolyTree position={[4, 2, 0]} scale={0.8} />
        <pointLight position={[2, 3.5, 2]} intensity={isNight ? 3.0 : 0.9} distance={8} color="#ff2d55" decay={1.8} />
        <pointLight position={[-3, 4.5, 1]} intensity={isNight ? 2.8 : 0.9} distance={8} color="#fbbf24" decay={1.8} />
        <pointLight position={[1, 5.5, -2]} intensity={isNight ? 2.6 : 0.8} distance={8} color="#22d3ee" decay={1.8} />
      </group>

      <group>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 13.5;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          const colors = ["#6ee7ff", "#c084fc", "#fbbf24", "#22c55e", "#a855f7", "#38bdf8"];
          const color = colors[i % colors.length];
          return <pointLight key={i} position={[x, 2.8, z]} intensity={isNight ? 2.8 : 1.1} distance={11} color={color} decay={1.8} />;
        })}
      </group>
    </>
  );
}
