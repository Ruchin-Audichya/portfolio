import React, { useMemo, useRef } from "react";
import { Billboard, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { StopCard } from "@/components/ui/StopCard";

export type StoryStopData = {
  id: string;
  title: string;
  lines?: [string, string];
  body: string;
  position: THREE.Vector3;
  dialogOffset?: [number, number, number];
  cardPosition?: THREE.Vector3;
  link?: string;
};

interface StopsProps {
  stops: StoryStopData[];
  activeStop: string | null;
  hoveredStop: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  isNight: boolean;
}

export function Stops({ stops, activeStop, hoveredStop, onHover, onSelect, isNight }: StopsProps) {
  return (
    <group>
      {stops.map((stop) => (
        <StoryStop
          key={stop.id}
          stop={stop}
          isNight={isNight}
          active={activeStop === stop.id}
          hovered={hoveredStop === stop.id}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function StoryStop({ stop, isNight, active, hovered, onHover, onSelect }: { stop: StoryStopData; isNight: boolean; active: boolean; hovered: boolean; onHover: (id: string | null) => void; onSelect: (id: string) => void; }) {
  const ringEmissive = useMemo(() => (isNight ? "#7c3aed" : "#93c5fd"), [isNight]);
  // Always show card for storyboard visibility - opacity varies
  const showCard = true;
  const isHighlighted = active || hovered;
  const ringMat = useRef<THREE.MeshStandardMaterial>(null);
  const haloMat = useRef<THREE.MeshStandardMaterial>(null);
  const yaw = useMemo(() => Math.atan2(stop.position.z, stop.position.x) + Math.PI / 2, [stop.position.x, stop.position.z]);
  const cardLocalOffset = useMemo<[number, number, number]>(() => {
    if (stop.cardPosition) {
      const dx = stop.cardPosition.x - stop.position.x;
      const dy = stop.cardPosition.y - stop.position.y;
      const dz = stop.cardPosition.z - stop.position.z;
      return [dx, dy, dz];
    }
    return stop.dialogOffset ?? [0, 3.4, 1.1];
  }, [stop.cardPosition, stop.dialogOffset, stop.position.x, stop.position.y, stop.position.z]);

  // Track previous state to avoid unnecessary updates
  const prevActiveRef = useRef(active);
  const prevHoveredRef = useRef(hovered);

  useFrame((state) => {
    if (!ringMat.current) return;
    
    // Only compute pulse animation when active or hovered (or just changed state)
    const stateChanged = active !== prevActiveRef.current || hovered !== prevHoveredRef.current;
    prevActiveRef.current = active;
    prevHoveredRef.current = hovered;
    
    // Skip expensive computations if not active/hovered and state hasn't changed
    if (!active && !hovered && !stateChanged) return;

    const base = isNight ? 0.55 : 0.22;
    const hoverBoost = hovered ? (isNight ? 0.55 : 0.45) : 0;
    const pulse = active ? (0.45 + 0.30 * Math.sin(state.clock.elapsedTime * 3.2)) : 0;
    ringMat.current.emissiveIntensity = base + hoverBoost + pulse;

    if (haloMat.current) {
      const hBase = isNight ? 0.18 : 0.08;
      const hPulse = (active || hovered) ? (0.12 + 0.08 * Math.sin(state.clock.elapsedTime * 2.2)) : 0;
      haloMat.current.opacity = THREE.MathUtils.clamp(hBase + hPulse, 0.05, 0.42);
    }
  });

  return (
    <group
      position={[stop.position.x, stop.position.y, stop.position.z]}
      onPointerEnter={() => onHover(stop.id)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onSelect(stop.id)}
    >
      <group rotation={[0, yaw, 0]}>
        {/* Base plinth */}
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.72, 0.24, 18]} />
          <meshStandardMaterial color={isNight ? "#0b1224" : "#e2e8f0"} roughness={0.92} metalness={0.04} />
        </mesh>
        <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.42, 0.5, 0.12, 12]} />
          <meshStandardMaterial color={isNight ? "#111827" : "#cbd5e1"} roughness={0.9} metalness={0.06} />
        </mesh>

        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.6, 24]} />
          <meshStandardMaterial
            ref={ringMat}
            color={isNight ? "#312e81" : "#dbeafe"}
            emissive={ringEmissive}
            emissiveIntensity={isNight ? 0.55 : 0.22}
            roughness={0.6}
          />
        </mesh>

        {/* Secondary ring (adds depth) */}
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.76, 0.92, 24]} />
          <meshStandardMaterial
            color={isNight ? "#0b1224" : "#e2e8f0"}
            emissive={ringEmissive}
            emissiveIntensity={isNight ? 0.25 : 0.08}
            roughness={0.75}
            metalness={0.06}
            toneMapped={false}
          />
        </mesh>

        {/* Ground halo (transparent) */}
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.65, 2.25, 24]} />
          <meshStandardMaterial ref={haloMat} color={ringEmissive} emissive={ringEmissive} emissiveIntensity={isNight ? 0.55 : 0.18} toneMapped={false} transparent opacity={isNight ? 0.18 : 0.1} />
        </mesh>

        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 2.2, 10]} />
          <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} metalness={0.2} roughness={0.7} />
        </mesh>

        {/* Core cap */}
        <mesh position={[0, 2.35, 0]}>
          <sphereGeometry args={[0.24, 10, 10]} />
          <meshStandardMaterial color={isNight ? "#111827" : "#334155"} roughness={0.35} metalness={0.05} />
        </mesh>
        <mesh position={[0, 2.45, 0]}>
          <sphereGeometry args={[0.36, 12, 12]} />
          <meshStandardMaterial
            color={ringEmissive}
            emissive={ringEmissive}
            emissiveIntensity={isNight ? 1.55 : 0.45}
            toneMapped={false}
            roughness={0.25}
            metalness={0.0}
            transparent
            opacity={isNight ? 0.65 : 0.45}
          />
        </mesh>

        {(active || hovered) && (
          <pointLight position={[0, 2.2, 0]} intensity={isNight ? 1.6 : 0.8} distance={8} color={isNight ? "#c084fc" : "#60a5fa"} decay={2} />
        )}
      </group>
      {showCard && (
        <Billboard position={cardLocalOffset} follow lockX lockZ>
          <Html
            transform
            distanceFactor={isHighlighted ? 5.5 : 7}
            className="pointer-events-auto"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            style={{
              transition: "transform 0.3s ease, opacity 0.3s ease",
              transform: isHighlighted ? "scale(1)" : "scale(0.75)",
              opacity: isHighlighted ? 1 : 0.6,
            }}
          >
            <StopCard title={stop.title} lines={stop.lines} body={stop.body} link={stop.link} onPrimary={() => onSelect(stop.id)} isNight={isNight} />
          </Html>
        </Billboard>
      )}
    </group>
  );
}
