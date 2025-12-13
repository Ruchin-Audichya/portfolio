import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshStandardMaterial, InstancedMesh, Matrix4, Quaternion, Euler, Vector3 } from "three";
import { freezeGroup } from "@/lib/three/performance";

interface RoadRingProps {
  roadMat: React.MutableRefObject<MeshStandardMaterial | null>;
  isNight: boolean;
}

export function RoadRing({ roadMat, isNight }: RoadRingProps) {
  const staticRingRef = useRef<THREE.Group>(null);
  const accentRef = useRef<THREE.Group>(null);
  const laneLightRef = useRef<THREE.Group>(null);
  const lanePadRef = useRef<InstancedMesh>(null);
  const laneStripeRef = useRef<InstancedMesh>(null);

  const laneTransforms = useMemo(
    () => [
      { position: new Vector3(0, 0.05, 14), rotationY: 0 },
      { position: new Vector3(0, 0.05, -14), rotationY: 0 },
      { position: new Vector3(14, 0.05, 0), rotationY: Math.PI / 2 },
      { position: new Vector3(-14, 0.05, 0), rotationY: Math.PI / 2 },
    ],
    []
  );

  const tmpMatrix = useMemo(() => new Matrix4(), []);
  const tmpQuat = useMemo(() => new Quaternion(), []);
  const tmpEuler = useMemo(() => new Euler(), []);

  useEffect(() => {
    if (staticRingRef.current) freezeGroup(staticRingRef.current);
    if (accentRef.current) freezeGroup(accentRef.current);
  }, []);

  useEffect(() => {
    if (!lanePadRef.current || !laneStripeRef.current) return;
    laneTransforms.forEach((t, i) => {
      tmpEuler.set(-Math.PI / 2, t.rotationY, 0);
      tmpQuat.setFromEuler(tmpEuler);
      tmpMatrix.compose(t.position, tmpQuat, new Vector3(1, 1, 1));
      lanePadRef.current!.setMatrixAt(i, tmpMatrix);

      const stripePos = t.position.clone();
      stripePos.y = 0.06;
      tmpMatrix.compose(stripePos, tmpQuat, new Vector3(1, 1, 1));
      laneStripeRef.current!.setMatrixAt(i, tmpMatrix);
    });
    lanePadRef.current.instanceMatrix.needsUpdate = true;
    laneStripeRef.current.instanceMatrix.needsUpdate = true;
  }, [laneTransforms, tmpEuler, tmpMatrix, tmpQuat]);

  useEffect(() => {
    if (laneLightRef.current) freezeGroup(laneLightRef.current);
  }, []);

  return (
    <>
      <group ref={staticRingRef}>
        {/* Outer curb */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.095, 0]} receiveShadow>
          <ringGeometry args={[13.95, 14.25, 32]} />
          <meshStandardMaterial color={isNight ? "#0b1224" : "#e2e8f0"} roughness={0.95} metalness={0.02} />
        </mesh>

        {/* Inner curb */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.095, 0]} receiveShadow>
          <ringGeometry args={[10.75, 11.05, 32]} />
          <meshStandardMaterial color={isNight ? "#111827" : "#cbd5e1"} roughness={0.95} metalness={0.02} />
        </mesh>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
          <ringGeometry args={[11, 14, 32]} />
          <meshStandardMaterial
            ref={roadMat}
            color={isNight ? "#111827" : "#475569"}
            roughness={0.75}
            metalness={0.06}
          />
        </mesh>

        {/* Center lane guide line (subtle; no extra lights) */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.102, 0]} receiveShadow>
          <ringGeometry args={[12.35, 12.42, 32]} />
          <meshStandardMaterial color={isNight ? "#1f2937" : "#e5e7eb"} roughness={0.95} metalness={0.02} />
        </mesh>
      </group>

      <instancedMesh ref={lanePadRef} args={[undefined as any, undefined as any, laneTransforms.length]}>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial color="#111827" metalness={0.2} roughness={0.7} />
      </instancedMesh>
      <instancedMesh ref={laneStripeRef} args={[undefined as any, undefined as any, laneTransforms.length]}>
        <planeGeometry args={[3.6, 0.4]} />
        <meshStandardMaterial
          emissive={isNight ? "#f97316" : "#22c55e"}
          emissiveIntensity={isNight ? 2.4 : 0.35}
          color={isNight ? "#f97316" : "#22c55e"}
          toneMapped={false}
          roughness={0.55}
          metalness={0.0}
        />
      </instancedMesh>

      <group ref={laneLightRef}>
        {laneTransforms.map((t, idx) => (
          <group key={idx} position={[t.position.x, 0, t.position.z]} rotation={[0, t.rotationY, 0]}>
            {isNight && <pointLight position={[0, 0.7, 0]} intensity={3.0} distance={9} color="#f97316" decay={1.8} />}
          </group>
        ))}
      </group>

      <group ref={accentRef}>
        {isNight &&
          Array.from({ length: 12 }).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const r = 12.5;
            const x = Math.cos(angle) * r;
            const z = Math.sin(angle) * r;
            const color = i % 3 === 0 ? "#22d3ee" : i % 3 === 1 ? "#f472b6" : "#fbbf24";
            return <pointLight key={i} position={[x, 0.4, z]} intensity={2.6} distance={7} color={color} decay={1.8} />;
          })}
      </group>

      <TrafficCars isNight={isNight} />
    </>
  );
}

function TrafficCars({ isNight }: { isNight: boolean }) {
  const carCount = 4;
  const baseRadius = 12.6;
  const meshes = useRef<THREE.Group[]>([]);

  const seeds = useMemo(
    () =>
      Array.from({ length: carCount }).map((_, i) => ({
        phase: (i / carCount) * Math.PI * 2,
        lane: i % 2 === 0 ? 0.6 : -0.6,
        color: i % 2 === 0 ? "#0f172a" : "#334155",
      })),
    []
  );

  const cars = useRef(
    seeds.map((s, i) => ({
      s: s.phase,
      speed: 0.18 + i * 0.02,
      targetSpeed: 0.2 + i * 0.02,
      laneBase: s.lane,
    }))
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const list = cars.current;

    // Slow down if too close to the car ahead (simple spacing).
    const order = list
      .map((c, idx) => ({ idx, s: c.s }))
      .sort((a, b) => a.s - b.s);
    const minGap = 0.75; // radians

    for (let k = 0; k < order.length; k++) {
      const cur = list[order[k].idx];
      const ahead = list[order[(k + 1) % order.length].idx];
      let gap = ahead.s - cur.s;
      if (k === order.length - 1) gap = ahead.s + Math.PI * 2 - cur.s;
      const baseTarget = 0.22 + (order[k].idx * 0.02);
      const spacingFactor = THREE.MathUtils.clamp((gap - minGap) / 0.65, 0, 1);
      cur.targetSpeed = THREE.MathUtils.lerp(0.08, baseTarget, spacingFactor);
      // tiny drift so they don't lock into perfect formation
      cur.targetSpeed += 0.01 * Math.sin(t * 0.35 + order[k].idx * 2.1);
      cur.speed = THREE.MathUtils.lerp(cur.speed, cur.targetSpeed, 1 - Math.exp(-delta * 2.8));
      cur.s = (cur.s + cur.speed * delta) % (Math.PI * 2);
    }

    for (let i = 0; i < list.length; i++) {
      const g = meshes.current[i];
      if (!g) continue;
      const a = list[i].s;
      const laneWobble = 0.12 * Math.sin(t * 0.55 + i * 1.7);
      const r = baseRadius + list[i].laneBase + laneWobble;
      const x = Math.cos(a) * r;
      const z = Math.sin(a) * r;

      const bob = 0.02 * Math.sin(t * (8 + i) + i * 2.3);
      g.position.set(x, 0.22 + bob, z);
      g.rotation.y = -a + Math.PI / 2;
      // lean slightly into turns based on speed
      g.rotation.z = THREE.MathUtils.clamp(list[i].speed * 0.45, 0.05, 0.14);
    }
  });

  return (
    <group>
      {seeds.map((_, i) => (
        <group
          ref={(el) => {
            if (el) meshes.current[i] = el;
          }}
          key={i}
        >
          {/* Body */}
          <mesh castShadow>
            <boxGeometry args={[0.95, 0.28, 1.75]} />
            <meshStandardMaterial color={seeds[i].color} metalness={0.18} roughness={0.72} />
          </mesh>

          {/* Hood + cabin */}
          <mesh position={[0, 0.18, 0.35]} castShadow>
            <boxGeometry args={[0.86, 0.22, 0.62]} />
            <meshStandardMaterial color={seeds[i].color} metalness={0.18} roughness={0.72} />
          </mesh>
          <mesh position={[0, 0.24, -0.15]} castShadow>
            <boxGeometry args={[0.78, 0.26, 0.85]} />
            <meshStandardMaterial color="#1e293b" metalness={0.12} roughness={0.62} />
          </mesh>

          {/* Windows */}
          <mesh position={[0, 0.32, -0.15]}>
            <boxGeometry args={[0.72, 0.18, 0.55]} />
            <meshStandardMaterial color={isNight ? "#0b1224" : "#cbd5e1"} roughness={0.25} metalness={0.05} opacity={0.85} transparent />
          </mesh>

          {/* Wheels */}
          {[
            [-0.42, 0.08, 0.62],
            [0.42, 0.08, 0.62],
            [-0.42, 0.08, -0.62],
            [0.42, 0.08, -0.62],
          ].map((p, wi) => (
            <mesh key={`w-${i}-${wi}`} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.1, 10]} />
              <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
            </mesh>
          ))}

          {/* Headlights (front) */}
          <mesh position={[0.22, 0.14, 0.9]}>
            <boxGeometry args={[0.14, 0.08, 0.06]} />
            <meshStandardMaterial emissive={"#dbeafe"} emissiveIntensity={isNight ? 1.9 : 0.0} color="#dbeafe" toneMapped={false} />
          </mesh>
          <mesh position={[-0.22, 0.14, 0.9]}>
            <boxGeometry args={[0.14, 0.08, 0.06]} />
            <meshStandardMaterial emissive={"#dbeafe"} emissiveIntensity={isNight ? 1.9 : 0.0} color="#dbeafe" toneMapped={false} />
          </mesh>

          {/* Tail lights (rear) */}
          <mesh position={[0.26, 0.12, -0.9]}>
            <boxGeometry args={[0.14, 0.08, 0.06]} />
            <meshStandardMaterial emissive="#ef4444" emissiveIntensity={isNight ? 1.6 : 0.0} color="#ef4444" toneMapped={false} />
          </mesh>
          <mesh position={[-0.26, 0.12, -0.9]}>
            <boxGeometry args={[0.14, 0.08, 0.06]} />
            <meshStandardMaterial emissive="#ef4444" emissiveIntensity={isNight ? 1.6 : 0.0} color="#ef4444" toneMapped={false} />
          </mesh>

          {isNight && (
            <>
              <pointLight position={[0.22, 0.15, 0.95]} intensity={0.9} distance={5} color="#dbeafe" decay={2} />
              <pointLight position={[-0.22, 0.15, 0.95]} intensity={0.9} distance={5} color="#dbeafe" decay={2} />
            </>
          )}
        </group>
      ))}
    </group>
  );
}
