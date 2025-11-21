"use client";

import { useFrame } from "@react-three/fiber";
import { useState } from "react";

interface DayNightCycleProps {
  /** 0 = day, 1 = night */
  mode: "day" | "night";
}

/**
 * Controls sky color and a simple moving directional light to suggest time of day.
 */
export function DayNightCycle({ mode }: DayNightCycleProps) {
  const [lightIntensity] = useState(1.5);

  useFrame(({ scene }) => {
    const t = mode === "day" ? 0 : 1;
    const skyColor = t === 0 ? 0x87cefa : 0x050816;
    (scene.background as any) = null; // use Drei's <Sky> or gradient in CSS; keep scene background transparent
    scene.fog = null;
  });

  return (
    <>
      <ambientLight intensity={mode === "day" ? 0.8 : 0.2} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={mode === "day" ? lightIntensity : 0.4}
        castShadow
      />
    </>
  );
}
