import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshStandardMaterial, Color, CylinderGeometry, PointLight, InstancedMesh, Matrix4, Euler, Vector3, Group } from "three";
import { freezeGroup } from "@/lib/three/performance";
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
  const coneGeometry = useMemo(() => new CylinderGeometry(3, 9, 8, 8, 1, false), []);
  const rockGeometry = useMemo(() => new CylinderGeometry(0.4, 0.55, 0.35, 6, 1, false), []);
  const rockMaterial = useMemo(() => new MeshStandardMaterial({ color: "#94a3b8", roughness: 0.98, metalness: 0.02 }), []);
  const rockMatrices = useMemo(
    () => [
      { p: [6.4, 0.18, -0.8], s: 1.2, r: [0.1, 0.4, 0.0] },
      { p: [6.9, 0.18, -1.4], s: 0.9, r: [0.2, 0.1, 0.2] },
      { p: [-6.2, 0.18, 1.2], s: 1.15, r: [0.05, -0.3, 0.1] },
      { p: [-6.8, 0.18, 0.55], s: 0.85, r: [0.15, 0.2, -0.1] },
      { p: [0.9, 0.18, 7.0], s: 1.1, r: [0.12, 0.6, 0.05] },
      { p: [-0.4, 0.18, 7.2], s: 0.95, r: [0.08, 0.25, 0.12] },
    ],
    []
  );
  const rockInstancesRef = useRef<InstancedMesh>(null);
  const tmpMatrix = useMemo(() => new Matrix4(), []);
  const beaconRef = useRef<PointLight>(null);
  const stripMatRef = useRef<MeshStandardMaterial | null>(null);
  const bulbMatsRef = useRef<Array<MeshStandardMaterial | null>>([]);
  const wasNightRef = useRef(isNight);
  const staticGroupRef = useRef<Group>(null);

  const bulbs = useMemo(() => {
    // Single decorative band around the hill (warm lights) - reduced count
    const configs: Array<{ id: string; position: [number, number, number]; phase: number; color: string }> = [];
    const warm = ["#ffd6a5", "#ffbf66", "#ffe7c2", "#ffc981"];
    // Single band only - fewer bulbs for performance
    const band = { y: 4.2, r: 5.2, count: 10 };
    for (let i = 0; i < band.count; i++) {
      const a = (i / band.count) * Math.PI * 2;
      const x = Math.cos(a) * band.r;
      const z = Math.sin(a) * band.r;
      const c = warm[i % warm.length];
      configs.push({
        id: `bulb-${i}`,
        position: [x, band.y, z],
        phase: a * 2.2,
        color: c,
      });
    }
    return configs;
  }, []);

  useEffect(() => {
    if (!rockInstancesRef.current) return;
    rockMatrices.forEach((cfg, i) => {
      tmpMatrix.identity();
      tmpMatrix.makeRotationFromEuler(new Euler(cfg.r[0], cfg.r[1], cfg.r[2]));
      tmpMatrix.setPosition(cfg.p[0], cfg.p[1], cfg.p[2]);
      tmpMatrix.scale(new Vector3(cfg.s, cfg.s, cfg.s));
      rockInstancesRef.current!.setMatrixAt(i, tmpMatrix);
    });
    rockInstancesRef.current.instanceMatrix.needsUpdate = true;
  }, [rockMatrices, tmpMatrix]);

  useEffect(() => {
    rockMaterial.color.set(isNight ? "#0f172a" : "#94a3b8");
  }, [isNight, rockMaterial]);

  useEffect(() => {
    if (staticGroupRef.current) freezeGroup(staticGroupRef.current);
  }, []);

  const animAccum = useRef(0);
  
  useFrame((state, delta) => {
    // Day: static state, no per-frame updates
    if (!isNight) {
      if (wasNightRef.current) {
        wasNightRef.current = false;
        if (beaconRef.current) beaconRef.current.intensity = 0;
        if (stripMatRef.current) stripMatRef.current.emissiveIntensity = 0.08;
        for (let i = 0; i < bulbs.length; i++) {
          const mat = bulbMatsRef.current[i];
          if (mat) mat.emissiveIntensity = 0.15;
        }
      }
      return;
    }

    wasNightRef.current = true;
    
    // Throttle animation updates to ~10 FPS
    animAccum.current += delta;
    if (animAccum.current < 0.1) return;
    animAccum.current = 0;

    if (!beaconRef.current) return;
    const t = state.clock.elapsedTime;
    const on = Math.sin(t * 4) > 0.3;
    beaconRef.current.intensity = on ? 3.5 : 0.3;

    if (stripMatRef.current) {
      stripMatRef.current.emissiveIntensity = 1.6 + 0.2 * Math.sin(t * 1.5);
    }

    // Update all bulb emissives in one loop
    for (let i = 0; i < bulbs.length; i++) {
      const mat = bulbMatsRef.current[i];
      if (mat) {
        const twinkle = 0.5 + 0.5 * Math.sin(t * 3 + bulbs[i].phase);
        mat.emissiveIntensity = 1.0 + twinkle;
      }
    }
  });

  return (
    <group ref={staticGroupRef}>
      {/* Hill base pad (helps grounding + readability) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
        <ringGeometry args={[8.6, 9.4, 32]} />
        <meshStandardMaterial color={isNight ? "#0b1224" : "#e2e8f0"} roughness={0.92} metalness={0.03} />
      </mesh>

      <mesh position={[0, 3, 0]} receiveShadow rotation={[0, Math.PI / 12, 0]} geometry={coneGeometry}>
        <meshStandardMaterial ref={hillMat} color={palette.hillDay} roughness={0.85} flatShading />
      </mesh>

      {/* ═══ GARDEN GROUND SYSTEM ═══ */}
      {/* Main grass base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial ref={groundMat} color={palette.groundDay} roughness={0.88} />
      </mesh>

      {/* Outer grass ring - darker shade for depth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
        <ringGeometry args={[22, 48, 48]} />
        <meshStandardMaterial color={isNight ? "#0a1628" : "#16a34a"} roughness={0.92} />
      </mesh>

      {/* Garden pathway rings - stone paths */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[19, 19.8, 48]} />
        <meshStandardMaterial color={isNight ? "#1a2540" : "#d4d4d8"} roughness={0.94} />
      </mesh>

      {/* Simplified flower beds - 4 instead of 8, single center flower each */}
      {[
        { pos: [16, 0.02, 12], scale: 2.8, color: isNight ? "#7c3aed" : "#f472b6" },
        { pos: [-16, 0.02, 13], scale: 2.5, color: isNight ? "#ea580c" : "#fb923c" },
        { pos: [17, 0.02, -11], scale: 2.3, color: isNight ? "#0ea5e9" : "#60a5fa" },
        { pos: [-17, 0.02, -12], scale: 2.6, color: isNight ? "#22c55e" : "#4ade80" },
      ].map((bed, i) => (
        <group key={`flower-bed-${i}`} position={bed.pos as [number, number, number]}>
          {/* Flower bed base */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[bed.scale, 12]} />
            <meshStandardMaterial color={isNight ? "#0f1f30" : "#15803d"} roughness={0.95} />
          </mesh>
          {/* Single glowing center flower */}
          <mesh position={[0, 0.15, 0]}>
            <sphereGeometry args={[0.35, 10, 10]} />
            <meshStandardMaterial 
              color={bed.color} 
              emissive={bed.color}
              emissiveIntensity={isNight ? 1.2 : 0.2}
              roughness={0.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Simplified bushes - 4 larger ones instead of 8 small */}
      {[
        [18, 0.25, 18], [-17, 0.25, 17], [19, 0.25, -8], [-18, 0.25, -9],
      ].map((pos, i) => (
        <mesh key={`bush-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.9, 10, 10]} />
          <meshStandardMaterial color={isNight ? "#1e3a2f" : "#16a34a"} roughness={0.88} />
        </mesh>
      ))}

      {/* Garden path lights - 4 instead of 8, emissive only (no point lights) */}
      {isNight && [
        [16, 12], [-15, 14], [17, -10], [-16, -11],
      ].map(([x, z], i) => (
        <group key={`garden-light-${i}`} position={[x, 0.4, z]}>
          <mesh>
            <cylinderGeometry args={[0.05, 0.06, 0.8, 6]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.14, 8, 8]} />
            <meshStandardMaterial 
              color="#fef3c7" 
              emissive="#fbbf24" 
              emissiveIntensity={2.2}
              toneMapped={false}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}

      {/* ═══ SIMPLIFIED POND ═══ */}
      <group position={[0, 0.01, 26]}>
        {/* Pond basin */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[3.2, 20]} />
          <meshStandardMaterial 
            color={isNight ? "#0c4a6e" : "#0ea5e9"} 
            roughness={0.2}
            metalness={0.25}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Pond rim */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[3.0, 3.6, 20]} />
          <meshStandardMaterial color={isNight ? "#374151" : "#9ca3af"} roughness={0.9} />
        </mesh>
        {/* Two lily pads with flowers */}
        {[
          [-1.0, 0.03, 0.6], [1.2, 0.03, -0.4],
        ].map((pos, i) => (
          <group key={`lily-${i}`} position={pos as [number, number, number]}>
            <mesh rotation={[-Math.PI / 2, i * 0.8, 0]}>
              <circleGeometry args={[0.35, 8]} />
              <meshStandardMaterial color={isNight ? "#14532d" : "#22c55e"} roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <sphereGeometry args={[0.12, 6, 6]} />
              <meshStandardMaterial 
                color={isNight ? "#ec4899" : "#f9a8d4"} 
                emissive={isNight ? "#ec4899" : "#f9a8d4"}
                emissiveIntensity={isNight ? 0.8 : 0.15}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══ TREES ON HILL (reduced from 5 to 3) ═══ */}
      <group>
        <LowPolyTree position={[2, 4.5, 2]} scale={0.85} isNight={isNight} />
        <LowPolyTree position={[-2.5, 5, 0]} scale={0.95} isNight={isNight} />
        <LowPolyTree position={[0, 6, -2]} scale={0.75} isNight={isNight} />
        {/* Single warm accent at night */}
        {isNight && (
          <pointLight position={[0, 4.5, 0]} intensity={1.8} distance={10} color="#ffd6a5" decay={1.6} />
        )}
      </group>

      {/* Stone clusters */}
      <instancedMesh ref={rockInstancesRef} args={[rockGeometry, rockMaterial, rockMatrices.length]} />

      {/* Decorative light strip ring */}
      <mesh position={[0, 2.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7.1, 0.08, 6, 32]} />
        <meshStandardMaterial
          ref={stripMatRef}
          emissive="#ffbf66"
          emissiveIntensity={isNight ? 1.6 : 0.08}
          color="#111827"
          toneMapped={false}
          roughness={0.4}
        />
      </mesh>

      {/* Mini warm bulbs on the hill - emissive only, no point lights */}
      <group>
        {bulbs.map((b, i) => (
          <mesh key={b.id} position={b.position}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial
              ref={(m) => { bulbMatsRef.current[i] = m; }}
              emissive={b.color}
              emissiveIntensity={isNight ? 1.5 : 0.15}
              color={b.color}
              toneMapped={false}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Hero landmark tower */}
      <group position={[0, 7.2, -1]}>
        {/* Tower base */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[1.3, 1.5, 0.5, 12]} />
          <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[0.9, 1.0, 0.22, 12]} />
          <meshStandardMaterial color={isNight ? "#0b1224" : "#cbd5e1"} roughness={0.88} />
        </mesh>

        <mesh>
          <cylinderGeometry args={[0.42, 0.6, 6.5, 8]} />
          <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} metalness={0.2} roughness={0.65} />
        </mesh>
        <mesh position={[0, 3.6, 0]}>
          <coneGeometry args={[0.85, 1.5, 8]} />
          <meshStandardMaterial color={isNight ? "#1e293b" : "#94a3b8"} roughness={0.6} />
        </mesh>
        {/* Mid-band */}
        <mesh position={[0, 1.8, 0]}>
          <torusGeometry args={[0.68, 0.05, 10, 24]} />
          <meshStandardMaterial emissive="#22d3ee" emissiveIntensity={isNight ? 0.9 : 0.08} color="#111827" toneMapped={false} roughness={0.6} metalness={0.0} />
        </mesh>
        <mesh position={[0, 3.25, 0.5]}>
          <boxGeometry args={[0.12, 0.9, 0.08]} />
          <meshStandardMaterial emissive={isNight ? "#22d3ee" : "#60a5fa"} emissiveIntensity={isNight ? 1.3 : 0.25} color="#0b1224" toneMapped={false} />
        </mesh>
        <mesh position={[0, 3.25, -0.5]}>
          <boxGeometry args={[0.12, 0.9, 0.08]} />
          <meshStandardMaterial emissive={isNight ? "#a855f7" : "#f59e0b"} emissiveIntensity={isNight ? 1.2 : 0.25} color="#0b1224" toneMapped={false} />
        </mesh>
        <pointLight ref={beaconRef} position={[0, 4.6, 0]} intensity={0} distance={16} color="#ef4444" decay={2} />
      </group>
    </group>
  );
}
