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
  const bulbLightsRef = useRef<Array<PointLight | null>>([]);
  const wasNightRef = useRef(isNight);
  const staticGroupRef = useRef<Group>(null);

  const bulbs = useMemo(() => {
    // Two decorative bands around the hill (warm lights).
    const configs: Array<{ id: string; position: [number, number, number]; phase: number; color: string }> = [];
    const warm = ["#ffd6a5", "#ffbf66", "#ffe7c2", "#ffc981"];
    const bands = [
      { y: 4.9, r: 4.4, count: 8 },
      { y: 3.4, r: 6.2, count: 10 },
    ];
    let idx = 0;
    for (const band of bands) {
      for (let i = 0; i < band.count; i++) {
        const a = (i / band.count) * Math.PI * 2 + (band.y * 0.17);
        const x = Math.cos(a) * band.r;
        const z = Math.sin(a) * band.r;
        const c = warm[(i + (band.count % 4)) % warm.length];
        configs.push({
          id: `bulb-${idx++}`,
          position: [x, band.y + 0.05 * Math.sin(a * 3.1), z],
          phase: a * 2.2,
          color: c,
        });
      }
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

  useFrame((state) => {
    // Day: keep all decorative bulbs off; avoid per-frame loops.
    if (!isNight) {
      if (wasNightRef.current) {
        wasNightRef.current = false;
        if (beaconRef.current) beaconRef.current.intensity = 0;
        if (stripMatRef.current) stripMatRef.current.emissiveIntensity = 0.05;
        for (let i = 0; i < bulbs.length; i++) {
          const mat = bulbMatsRef.current[i];
          const light = bulbLightsRef.current[i];
          if (mat) mat.emissiveIntensity = 0.12;
          if (light) light.intensity = 0;
        }
      }
      return;
    }

    wasNightRef.current = true;

    if (!beaconRef.current) return;
    const t = state.clock.elapsedTime;
    const on = Math.sin(t * 4.2) > 0.4;
    beaconRef.current.intensity = on ? 3.2 : 0.2;

    if (stripMatRef.current) {
      const base = 0.08 + 1.55;
      const shimmer = 0.18 * (0.5 + 0.5 * Math.sin(t * 1.7));
      stripMatRef.current.emissiveIntensity = base + shimmer;
    }

    for (let i = 0; i < bulbs.length; i++) {
      const mat = bulbMatsRef.current[i];
      const light = bulbLightsRef.current[i];
      const twinkle = 0.55 + 0.45 * Math.max(0, Math.sin(t * 3.6 + bulbs[i].phase));
      const emissive = 0.12 + (1.25 + 0.6 * twinkle);
      if (mat) mat.emissiveIntensity = emissive;
      if (light) light.intensity = 0.55 + 0.95 * twinkle;
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
        <meshStandardMaterial color={isNight ? "#1e293b" : "#d4d4d8"} roughness={0.95} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <ringGeometry args={[24, 24.6, 48]} />
        <meshStandardMaterial color={isNight ? "#1e293b" : "#d4d4d8"} roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Decorative flower beds - circular patches around the world */}
      {[
        { pos: [16, 0.02, 12], scale: 2.5, color: isNight ? "#581c87" : "#f472b6" },
        { pos: [-15, 0.02, 14], scale: 2.2, color: isNight ? "#7c2d12" : "#fb923c" },
        { pos: [18, 0.02, -10], scale: 2.0, color: isNight ? "#1e3a5f" : "#60a5fa" },
        { pos: [-17, 0.02, -12], scale: 2.3, color: isNight ? "#14532d" : "#4ade80" },
        { pos: [8, 0.02, 20], scale: 1.8, color: isNight ? "#4c1d95" : "#a78bfa" },
        { pos: [-8, 0.02, 21], scale: 2.1, color: isNight ? "#831843" : "#f9a8d4" },
        { pos: [20, 0.02, 4], scale: 1.6, color: isNight ? "#713f12" : "#fbbf24" },
        { pos: [-20, 0.02, 5], scale: 1.9, color: isNight ? "#164e63" : "#22d3ee" },
      ].map((bed, i) => (
        <group key={`flower-bed-${i}`} position={bed.pos as [number, number, number]}>
          {/* Flower bed base */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[bed.scale, 16]} />
            <meshStandardMaterial 
              color={isNight ? "#0d1830" : "#15803d"} 
              roughness={0.95} 
            />
          </mesh>
          {/* Flower dots */}
          {Array.from({ length: 8 }).map((_, j) => {
            const angle = (j / 8) * Math.PI * 2 + i * 0.5;
            const r = bed.scale * 0.6;
            return (
              <mesh 
                key={j} 
                position={[Math.cos(angle) * r, 0.08, Math.sin(angle) * r]}
              >
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshStandardMaterial 
                  color={bed.color} 
                  emissive={bed.color}
                  emissiveIntensity={isNight ? 0.6 : 0.1}
                  roughness={0.6}
                  toneMapped={false}
                />
              </mesh>
            );
          })}
          {/* Center flower - larger */}
          <mesh position={[0, 0.12, 0]}>
            <sphereGeometry args={[0.25, 12, 12]} />
            <meshStandardMaterial 
              color={bed.color} 
              emissive={bed.color}
              emissiveIntensity={isNight ? 0.8 : 0.15}
              roughness={0.5}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}

      {/* Grass tufts - scattered around for texture */}
      {[
        [12, 0.1, 8], [-10, 0.1, 10], [14, 0.1, -6], [-12, 0.1, -8],
        [6, 0.1, 16], [-5, 0.1, 18], [22, 0.1, 0], [-22, 0.1, 2],
        [10, 0.1, -15], [-8, 0.1, -16], [0, 0.1, 22], [4, 0.1, -20],
      ].map((pos, i) => (
        <group key={`tuft-${i}`} position={pos as [number, number, number]}>
          {/* Grass blades */}
          {[-0.1, 0, 0.1].map((x, j) => (
            <mesh key={j} position={[x, 0.2, 0]} rotation={[0, i * 0.5, (j - 1) * 0.15]}>
              <coneGeometry args={[0.04, 0.45, 4]} />
              <meshStandardMaterial 
                color={isNight ? "#1e3a5f" : "#22c55e"} 
                roughness={0.85}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Small bushes scattered around */}
      {[
        [15, 0.2, 16], [-14, 0.2, 17], [19, 0.2, -5], [-18, 0.2, -7],
        [5, 0.2, 19], [-6, 0.2, -19], [21, 0.2, 8], [-21, 0.2, -4],
      ].map((pos, i) => (
        <mesh key={`bush-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.6 + (i % 3) * 0.15, 12, 12]} />
          <meshStandardMaterial 
            color={isNight ? "#14532d" : "#16a34a"} 
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Garden edge stones - border detail */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 21;
        return (
          <mesh 
            key={`stone-${i}`} 
            position={[Math.cos(angle) * r, 0.08, Math.sin(angle) * r]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.8, 0.16, 0.5]} />
            <meshStandardMaterial 
              color={isNight ? "#374151" : "#9ca3af"} 
              roughness={0.95}
              metalness={0.02}
            />
          </mesh>
        );
      })}

      {/* Garden path lights - warm glow at night */}
      {isNight && [
        [16, 12], [-15, 14], [18, -10], [-17, -12],
        [8, 20], [-8, 21], [20, 4], [-20, 5],
      ].map(([x, z], i) => (
        <group key={`garden-light-${i}`} position={[x, 0.4, z]}>
          {/* Light post */}
          <mesh>
            <cylinderGeometry args={[0.05, 0.06, 0.8, 8]} />
            <meshStandardMaterial color={isNight ? "#1e293b" : "#e2e8f0"} roughness={0.8} />
          </mesh>
          {/* Light head */}
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial 
              color="#fef3c7" 
              emissive="#fbbf24" 
              emissiveIntensity={1.8}
              toneMapped={false}
              roughness={0.3}
            />
          </mesh>
          <pointLight position={[0, 0.5, 0]} intensity={1.2} distance={6} color="#fbbf24" decay={2} />
        </group>
      ))}

      {/* ═══ DECORATIVE POND/WATER FEATURE ═══ */}
      <group position={[0, 0.01, 26]}>
        {/* Pond basin */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[3.5, 32]} />
          <meshStandardMaterial 
            color={isNight ? "#0c4a6e" : "#0ea5e9"} 
            roughness={0.15}
            metalness={0.3}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Pond rim - stone border */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]} receiveShadow>
          <ringGeometry args={[3.3, 4.0, 32]} />
          <meshStandardMaterial 
            color={isNight ? "#374151" : "#9ca3af"} 
            roughness={0.92}
            metalness={0.03}
          />
        </mesh>
        {/* Lily pads */}
        {[
          [-1.2, 0.02, 0.8], [1.5, 0.02, -0.5], [-0.3, 0.02, -1.2], [0.8, 0.02, 1.4],
        ].map((pos, i) => (
          <mesh key={`lily-${i}`} position={pos as [number, number, number]} rotation={[-Math.PI / 2, i * 0.8, 0]}>
            <circleGeometry args={[0.4, 12]} />
            <meshStandardMaterial color={isNight ? "#14532d" : "#22c55e"} roughness={0.7} />
          </mesh>
        ))}
        {/* Lily flowers */}
        {[
          [-1.2, 0.08, 0.8], [1.5, 0.08, -0.5],
        ].map((pos, i) => (
          <mesh key={`lily-flower-${i}`} position={pos as [number, number, number]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshStandardMaterial 
              color={isNight ? "#ec4899" : "#f9a8d4"} 
              emissive={isNight ? "#ec4899" : "#f9a8d4"}
              emissiveIntensity={isNight ? 0.6 : 0.1}
              toneMapped={false}
              roughness={0.5}
            />
          </mesh>
        ))}
        {/* Water shimmer reflection at night */}
        {isNight && (
          <pointLight position={[0, 0.5, 0]} intensity={0.8} distance={5} color="#38bdf8" decay={2} />
        )}
      </group>

      {/* ═══ GARDEN BENCHES ═══ */}
      {[
        { pos: [23, 0.35, 15], rot: -Math.PI / 3 },
        { pos: [-23, 0.35, 16], rot: Math.PI / 3 },
        { pos: [24, 0.35, -8], rot: Math.PI / 2.5 },
        { pos: [-24, 0.35, -9], rot: -Math.PI / 2.5 },
      ].map((bench, i) => (
        <group key={`bench-${i}`} position={bench.pos as [number, number, number]} rotation={[0, bench.rot, 0]}>
          {/* Seat */}
          <mesh>
            <boxGeometry args={[1.6, 0.1, 0.5]} />
            <meshStandardMaterial color={isNight ? "#78350f" : "#a16207"} roughness={0.85} />
          </mesh>
          {/* Back */}
          <mesh position={[0, 0.35, -0.2]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[1.6, 0.6, 0.08]} />
            <meshStandardMaterial color={isNight ? "#78350f" : "#a16207"} roughness={0.85} />
          </mesh>
          {/* Legs */}
          {[-0.65, 0.65].map((x, j) => (
            <mesh key={j} position={[x, -0.2, 0]}>
              <boxGeometry args={[0.1, 0.4, 0.4]} />
              <meshStandardMaterial color={isNight ? "#1e293b" : "#374151"} roughness={0.9} metalness={0.1} />
            </mesh>
          ))}
        </group>
      ))}

      <group>
        <LowPolyTree position={[2, 4, 2]} scale={0.8} isNight={isNight} />
        <LowPolyTree position={[-3, 5, 1]} scale={0.9} isNight={isNight} />
        <LowPolyTree position={[1, 6, -2]} scale={0.7} isNight={isNight} />
        <LowPolyTree position={[-2, 3, -3]} scale={1} isNight={isNight} />
        <LowPolyTree position={[4, 2, 0]} scale={0.8} isNight={isNight} />
        {/* Night-only warm accents to keep day GPU cost down */}
        {isNight && (
          <>
            <pointLight position={[2, 3.5, 2]} intensity={1.4} distance={8} color="#ffd6a5" decay={1.8} />
            <pointLight position={[-3, 4.5, 1]} intensity={1.3} distance={8} color="#ffbf66" decay={1.8} />
            <pointLight position={[1, 5.5, -2]} intensity={1.2} distance={8} color="#ffe7c2" decay={1.8} />
          </>
        )}
      </group>

      {/* Stone clusters (adds 'complete world' detail; no lights) */}
      <instancedMesh ref={rockInstancesRef} args={[rockGeometry, rockMaterial, rockMatrices.length]} castShadow receiveShadow />

      {/* Decorative light strip ring */}
      <mesh position={[0, 2.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7.1, 0.075, 6, 48]} />
        <meshStandardMaterial
          ref={stripMatRef}
          emissive="#ffbf66"
          emissiveIntensity={isNight ? 1.55 : 0.05}
          color="#111827"
          toneMapped={false}
          roughness={0.4}
          metalness={0.0}
        />
      </mesh>

      {/* Mini warm bulbs on the hill */}
      <group>
        {bulbs.map((b, i) => (
          <group key={b.id} position={b.position}>
            <mesh>
              <sphereGeometry args={[0.095, 10, 10]} />
              <meshStandardMaterial
                ref={(m) => {
                  bulbMatsRef.current[i] = m;
                }}
                emissive={b.color}
                emissiveIntensity={isNight ? 1.4 : 0.12}
                color={b.color}
                toneMapped={false}
                roughness={0.25}
                metalness={0.0}
              />
            </mesh>
            <pointLight
              ref={(l) => {
                bulbLightsRef.current[i] = l;
              }}
              intensity={isNight ? 1.0 : 0.0}
              distance={3.8}
              color={b.color}
              decay={2}
            />
          </group>
        ))}
      </group>

      {/* Hero landmark tower (readable in day/night) */}
      <group position={[0, 7.2, -1]}>
        {/* Tower base */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[1.35, 1.55, 0.55, 16]} />
          <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} roughness={0.92} metalness={0.03} />
        </mesh>
        <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.95, 1.05, 0.25, 16]} />
          <meshStandardMaterial color={isNight ? "#0b1224" : "#cbd5e1"} roughness={0.9} metalness={0.05} />
        </mesh>

        <mesh castShadow>
          <cylinderGeometry args={[0.45, 0.65, 6.5, 10]} />
          <meshStandardMaterial color={isNight ? "#0b1224" : "#334155"} metalness={0.25} roughness={0.65} />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <coneGeometry args={[0.9, 1.6, 10]} />
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
        <pointLight ref={beaconRef} position={[0, 4.6, 0]} intensity={0} distance={18} color="#ef4444" decay={2} />
      </group>

      <group>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          const r = 13.5;
          const x = Math.cos(angle) * r;
          const z = Math.sin(angle) * r;
          const colors = ["#6ee7ff", "#c084fc", "#fbbf24", "#22c55e", "#a855f7", "#38bdf8"];
          const color = colors[i % colors.length];
          return isNight ? <pointLight key={i} position={[x, 2.8, z]} intensity={2.8} distance={11} color={color} decay={1.8} /> : null;
        })}
      </group>
    </group>
  );
}
