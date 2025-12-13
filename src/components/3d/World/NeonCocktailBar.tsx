import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function NeonCocktailBar({
  isNight,
  position = [0, 0, 0],
  rotationY = 0,
  scale = 1,
}: {
  isNight: boolean;
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
}) {
  const nightBlend = useRef(0);
  const tRef = useRef(0);

  const signMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const tubeMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const windowMat = useRef<THREE.MeshStandardMaterial | null>(null);
  const signLight = useRef<THREE.PointLight | null>(null);
  const interiorLight = useRef<THREE.PointLight | null>(null);

  const palette = useMemo(
    () => ({
      shellDay: "#cbd5e1",
      shellNight: "#0b1224",
      trimDay: "#94a3b8",
      trimNight: "#111827",
      neonPink: "#ff66c4",
      neonCyan: "#22d3ee",
      neonAmber: "#fbbf24",
    }),
    []
  );

  useFrame((state, delta) => {
    nightBlend.current = THREE.MathUtils.lerp(nightBlend.current, isNight ? 1 : 0, 1 - Math.exp(-delta * 6));
    tRef.current = state.clock.elapsedTime;

    const baseSign = THREE.MathUtils.lerp(0.15, 2.8, nightBlend.current);
    const baseTube = THREE.MathUtils.lerp(0.06, 2.0, nightBlend.current);
    const baseWindows = THREE.MathUtils.lerp(0.0, 1.6, nightBlend.current);

    const flicker = isNight ? 0.35 * Math.max(0, flickerNoise(tRef.current)) : 0;
    const tubePulse = isNight ? 0.18 * (0.5 + 0.5 * Math.sin(tRef.current * 2.2)) : 0;

    if (signMat.current) signMat.current.emissiveIntensity = baseSign + flicker;
    if (tubeMat.current) tubeMat.current.emissiveIntensity = baseTube + tubePulse;
    if (windowMat.current) windowMat.current.emissiveIntensity = baseWindows;

    if (signLight.current) signLight.current.intensity = THREE.MathUtils.lerp(0.0, 2.2 + flicker, nightBlend.current);
    if (interiorLight.current) interiorLight.current.intensity = THREE.MathUtils.lerp(0.0, 1.4, nightBlend.current);
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      {/* Sidewalk pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 1.2]} receiveShadow>
        <planeGeometry args={[6.2, 3.8]} />
        <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Simple low-poly bar building */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[4.6, 2.2, 2.8]} />
        <meshStandardMaterial color={isNight ? palette.shellNight : palette.shellDay} roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Door */}
      <mesh castShadow position={[0, 0.95, 1.41]}>
        <boxGeometry args={[0.95, 1.35, 0.08]} />
        <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} roughness={0.85} metalness={0.08} />
      </mesh>
      <mesh position={[0, 0.92, 1.46]}>
        <planeGeometry args={[0.62, 0.85]} />
        <meshStandardMaterial color={"#111827"} emissive={palette.neonCyan} emissiveIntensity={isNight ? 0.55 : 0.02} toneMapped={false} roughness={0.25} metalness={0.0} transparent opacity={isNight ? 0.65 : 0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 1.95]} receiveShadow>
        <planeGeometry args={[1.25, 0.75]} />
        <meshStandardMaterial color={isNight ? "#0b1224" : "#cbd5e1"} roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Roof/awning */}
      <mesh castShadow receiveShadow position={[0.0, 2.3, 0.15]}>
        <boxGeometry args={[5.0, 0.25, 3.1]} />
        <meshStandardMaterial color={isNight ? palette.trimNight : palette.trimDay} roughness={0.85} metalness={0.12} />
      </mesh>

      {/* Underglow strip (emissive only) */}
      <mesh position={[0, 0.22, 1.35]}>
        <boxGeometry args={[4.2, 0.06, 0.18]} />
        <meshStandardMaterial color="#111827" emissive={palette.neonPink} emissiveIntensity={isNight ? 1.1 : 0.0} toneMapped={false} roughness={0.6} metalness={0.0} />
      </mesh>

      {/* Bar counter (outside) */}
      <mesh castShadow receiveShadow position={[0.0, 0.8, 1.7]}>
        <boxGeometry args={[3.1, 0.95, 0.6]} />
        <meshStandardMaterial color={isNight ? "#111827" : "#64748b"} roughness={0.85} metalness={0.05} />
      </mesh>
      <mesh castShadow receiveShadow position={[0.0, 1.3, 1.7]}>
        <boxGeometry args={[3.25, 0.15, 0.7]} />
        <meshStandardMaterial color={isNight ? "#0f172a" : "#e2e8f0"} roughness={0.7} metalness={0.12} />
      </mesh>

      {/* Stools */}
      {[-1.0, 0.0, 1.0].map((x) => (
        <group key={`stool-${x}`} position={[x, 0, 2.25]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.55, 10]} />
            <meshStandardMaterial color={isNight ? "#0f172a" : "#475569"} roughness={0.75} metalness={0.12} />
          </mesh>
          <mesh castShadow position={[0, 0.35, 0]}>
            <cylinderGeometry args={[0.28, 0.28, 0.12, 12]} />
            <meshStandardMaterial color={isNight ? "#111827" : "#64748b"} roughness={0.8} metalness={0.08} />
          </mesh>
        </group>
      ))}

      {/* Planter props (simplified - no glow spheres) */}
      {[[-2.35, 0.2, 2.0], [2.35, 0.2, 2.0]].map((p, i) => (
        <group key={`planter-${i}`} position={p as [number, number, number]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.36, 0.4, 12]} />
            <meshStandardMaterial color={isNight ? "#0b1224" : "#cbd5e1"} roughness={0.9} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <sphereGeometry args={[0.42, 10, 10]} />
            <meshStandardMaterial color={isNight ? "#16a34a" : "#22c55e"} roughness={0.95} />
          </mesh>
        </group>
      ))}

      {/* Neon sign backing */}
      <mesh castShadow position={[0, 2.0, 1.46]}>
        <boxGeometry args={[3.4, 0.75, 0.12]} />
        <meshStandardMaterial color={isNight ? "#0b1224" : "#e2e8f0"} roughness={isNight ? 0.65 : 0.92} metalness={isNight ? 0.1 : 0.02} />
      </mesh>

      {/* Neon sign glow */}
      <mesh position={[0, 2.0, 1.53]}>
        <planeGeometry args={[3.1, 0.55]} />
        <meshStandardMaterial
          ref={signMat}
          emissive={palette.neonPink}
          emissiveIntensity={isNight ? 2.0 : 0.12}
          color={palette.neonPink}
          toneMapped={false}
          roughness={0.4}
          metalness={0.0}
        />
      </mesh>

      {/* Neon tubes (simple cocktail vibe) */}
      <group position={[0, 1.55, 1.6]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, 2.2, 10]} />
          <meshStandardMaterial ref={tubeMat} emissive={palette.neonCyan} emissiveIntensity={isNight ? 1.45 : 0.05} color={palette.neonCyan} toneMapped={false} />
        </mesh>
        <mesh position={[1.05, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.75, 10]} />
          <meshStandardMaterial emissive={palette.neonAmber} emissiveIntensity={isNight ? 1.25 : 0.05} color={palette.neonAmber} toneMapped={false} />
        </mesh>
        <mesh position={[-1.05, 0, 0]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.75, 10]} />
          <meshStandardMaterial emissive={palette.neonAmber} emissiveIntensity={isNight ? 1.25 : 0.05} color={palette.neonAmber} toneMapped={false} />
        </mesh>

        {/* Extra tube border */}
        <mesh position={[0, -0.28, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 2.55, 10]} />
          <meshStandardMaterial emissive={palette.neonPink} emissiveIntensity={isNight ? 1.05 : 0.04} color={palette.neonPink} toneMapped={false} />
        </mesh>
      </group>

      {/* Windows glow */}
      <mesh position={[-1.35, 1.1, 1.41]}>
        <planeGeometry args={[0.85, 0.9]} />
        <meshStandardMaterial ref={windowMat} emissive="#ffd6a5" emissiveIntensity={isNight ? 1.25 : 0.0} color="#111827" toneMapped={false} />
      </mesh>
      <mesh position={[1.35, 1.1, 1.41]}>
        <planeGeometry args={[0.85, 0.9]} />
        <meshStandardMaterial emissive="#ffd6a5" emissiveIntensity={isNight ? 1.25 : 0.0} color="#111827" toneMapped={false} />
      </mesh>

      {/* Bottles (tiny silhouettes) */}
      <group position={[0.0, 1.35, 1.95]}>
        {[-0.85, -0.35, 0.15, 0.6, 1.05].map((x, i) => (
          <group key={`b-${i}`} position={[x, 0, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.06, 0.08, 0.32, 10]} />
              <meshStandardMaterial color={isNight ? "#0f172a" : "#334155"} roughness={0.6} metalness={0.12} />
            </mesh>
            <mesh position={[0, 0.07, 0.07]}>
              <planeGeometry args={[0.09, 0.14]} />
              <meshStandardMaterial emissive={i % 2 === 0 ? palette.neonCyan : palette.neonPink} emissiveIntensity={isNight ? 0.85 : 0.0} color="#111827" toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Local lights (night only) */}
      <pointLight ref={signLight} position={[0, 2.0, 2.4]} intensity={0} distance={10} color={palette.neonPink} decay={2} />
      <pointLight ref={interiorLight} position={[0, 1.2, 0.3]} intensity={0} distance={8} color="#ffd6a5" decay={2} />
    </group>
  );
}

function flickerNoise(t: number) {
  const a = Math.sin(13.7 + t * 4.3);
  const b = 0.6 * Math.sin(2.1 + t * 11.2);
  const c = 0.35 * Math.sin(9.1 + t * 23.0);
  return a + b + c;
}
