import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { QualityTier } from "@/lib/three/performance";

type NeonStreetPropsProps = {
  isNight: boolean;
  quality?: QualityTier;
};

type NeonSign = {
  id: string;
  position: [number, number, number];
  rotationY: number;
  color: string;
  /** Higher priority signs keep their lights even at lower quality. */
  priority?: number;
};

export function NeonStreetProps({ isNight, quality = "high" }: NeonStreetPropsProps) {
  // Priority: higher = more important to keep lights on at lower quality
  const signs = useMemo<NeonSign[]>(
    () => [
      { id: "neon-1", position: [6.8, 1.8, 15.2], rotationY: -Math.PI / 2, color: "#22d3ee", priority: 2 },
      { id: "neon-2", position: [-6.6, 1.75, 15.0], rotationY: Math.PI / 2, color: "#f472b6", priority: 1 },
      { id: "neon-3", position: [16.2, 1.8, 3.6], rotationY: Math.PI, color: "#a855f7", priority: 2 },
      { id: "neon-4", position: [16.1, 1.8, -3.6], rotationY: Math.PI, color: "#f97316", priority: 0 },
      { id: "neon-5", position: [-16.3, 1.8, -4.0], rotationY: 0, color: "#fbbf24", priority: 0 },
      { id: "neon-6", position: [-16.1, 1.8, 4.0], rotationY: 0, color: "#60a5fa", priority: 1 },
    ],
    []
  );

  // Quality-aware light budget: reduced for performance
  const signLightBudget = quality === "high" ? 3 : quality === "medium" ? 1 : 0;
  // Quality-aware lamp budget: reduced for performance  
  const lampLightBudget = quality === "high" ? 4 : quality === "medium" ? 2 : 0;

  const nightBlend = useRef(0);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    nightBlend.current = THREE.MathUtils.lerp(nightBlend.current, isNight ? 1 : 0, 1 - Math.exp(-delta * 6));
    timeRef.current = state.clock.elapsedTime;
  });

  // Sort signs by priority (descending) to allocate lights to most important first
  const sortedSigns = useMemo(() =>
    [...signs].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0)),
    [signs]
  );

  return (
    <group>
      {/* Simple neon billboards (safe glow: emissive + quality-aware point light) */}
      {sortedSigns.map((s, idx) => {
        const base = THREE.MathUtils.lerp(0.12, 1.55, nightBlend.current);
        const jitter = isNight ? 0.35 * Math.max(0, statefulFlicker(idx, timeRef.current)) : 0;
        const emissiveIntensity = base + jitter;
        // Only add point light if within budget
        const hasLight = isNight && idx < signLightBudget;
        // Subtle sway animation - different phase per sign
        const sway = isNight ? 0.015 * Math.sin(timeRef.current * 0.8 + idx * 1.3) : 0;
        return (
          <group key={s.id} position={s.position} rotation={[sway, s.rotationY, sway * 0.5]}>
            {/* Support pole */}
            <mesh position={[0, 0.55, -0.1]} castShadow={quality === "high"} receiveShadow={quality === "high"}>
              <cylinderGeometry args={[0.06, 0.08, 1.1, 10]} />
              <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} roughness={0.85} metalness={0.15} />
            </mesh>

            {/* Base pad */}
            <mesh position={[0, 0.06, -0.1]} receiveShadow={quality === "high"}>
              <cylinderGeometry args={[0.22, 0.26, 0.12, 12]} />
              <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.95} metalness={0.02} />
            </mesh>

            {/* Back plate */}
            <mesh castShadow={quality === "high"}>
              <boxGeometry args={[2.6, 1.2, 0.12]} />
              <meshStandardMaterial color={isNight ? "#0b1224" : "#e2e8f0"} metalness={isNight ? 0.15 : 0.0} roughness={isNight ? 0.65 : 0.92} />
            </mesh>

            {/* Frame */}
            <mesh position={[0, 0, 0.02]} castShadow={quality === "high"}>
              <boxGeometry args={[2.72, 1.32, 0.06]} />
              <meshStandardMaterial color={isNight ? "#111827" : "#cbd5e1"} roughness={0.9} metalness={0.06} />
            </mesh>

            {/* Emissive surface - always present, provides glow without point light cost */}
            <mesh position={[0, 0, 0.07]}>
              <planeGeometry args={[2.35, 0.95]} />
              <meshStandardMaterial
                emissive={s.color}
                emissiveIntensity={emissiveIntensity}
                color={s.color}
                toneMapped={false}
                roughness={0.4}
                metalness={0.0}
              />
            </mesh>
            {/* Point light only for high-priority signs within budget */}
            {hasLight && <pointLight position={[0, 0.2, 0.55]} intensity={1.2} distance={7} color={s.color} decay={2} />}
          </group>
        );
      })}

      {/* Street lamps around the ring for navigation readability */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 14.6;
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;
        const warm = i % 2 === 0 ? "#ffbf66" : "#ffd6a5";
        const intensity = isNight ? 2.4 : 0.0;
        // Evenly distribute lamp lights: every Nth lamp gets a light based on budget
        const lampStep = lampLightBudget > 0 ? Math.ceil(6 / lampLightBudget) : 999;
        const hasLampLight = isNight && i % lampStep === 0;
        // Boost emissive on lamps without lights to compensate visually
        const emissiveBoost = isNight && !hasLampLight ? 1.8 : 1.0;
        return (
          <group key={`lamp-${i}`} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            {/* Base */}
            <mesh position={[0, 0.12, 0]} castShadow={quality === "high"} receiveShadow={quality === "high"}>
              <cylinderGeometry args={[0.18, 0.22, 0.24, 6]} />
              <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} metalness={0.25} roughness={0.75} />
            </mesh>
            <mesh castShadow={quality === "high"}>
              <cylinderGeometry args={[0.06, 0.08, 3.1, 6]} />
              <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} metalness={0.25} roughness={0.7} />
            </mesh>
            {/* Arm + head */}
            <mesh position={[0, 3.05, 0.62]} castShadow={quality === "high"}>
              <boxGeometry args={[0.28, 0.16, 0.38]} />
              <meshStandardMaterial color={isNight ? "#111827" : "#334155"} roughness={0.8} metalness={0.18} />
            </mesh>
            {/* Lamp bulb - boosted emissive when no light to preserve visual warmth */}
            <mesh position={[0, 2.9, 0.6]}>
              <sphereGeometry args={[0.13, 8, 8]} />
              <meshStandardMaterial
                emissive={warm}
                emissiveIntensity={(isNight ? 2.1 : 0.05) * emissiveBoost}
                color={isNight ? warm : "#e2e8f0"}
                toneMapped={false}
                roughness={0.35}
                metalness={0.0}
              />
            </mesh>
            {/* Point light only for lamps within budget - evenly distributed around ring */}
            {hasLampLight && <pointLight position={[0, 1.48, 0.3]} intensity={intensity} distance={9} color={warm} decay={2} />}
          </group>
        );
      })}
    </group>
  );
}

function statefulFlicker(seed: number, t: number) {
  const a = Math.sin((seed + 1.2) * 13.7 + t * 4.4);
  const b = 0.35 * Math.sin((seed + 2.1) * 7.3 + t * 8.1);
  return a + b;
}
