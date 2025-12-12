import React, { useMemo } from "react";
import { Billboard, Html } from "@react-three/drei";
import * as THREE from "three";
import { StopCard } from "@/components/ui/StopCard";

export type StoryStopData = {
  id: string;
  title: string;
  body: string;
  position: THREE.Vector3;
  dialogOffset?: [number, number, number];
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

  return (
    <group
      position={[stop.position.x, stop.position.y, stop.position.z]}
      rotation={[0, Math.atan2(stop.position.z, stop.position.x) + Math.PI / 2, 0]}
      onPointerEnter={() => onHover(stop.id)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onSelect(stop.id)}
    >
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>        
        <ringGeometry args={[1.0, 1.6, 48]} />
        <meshStandardMaterial
          color={isNight ? "#312e81" : "#dbeafe"}
          emissive={ringEmissive}
          emissiveIntensity={active || hovered ? 1.4 : isNight ? 0.6 : 0.3}
          roughness={0.6}
        />
      </mesh>
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 2.2, 16]} />
        <meshStandardMaterial color={isNight ? "#111827" : "#e2e8f0"} metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial color={isNight ? "#a855f7" : "#f59e0b"} emissive={isNight ? "#a855f7" : "#fbbf24"} emissiveIntensity={isNight ? 1.6 : 0.5} />
      </mesh>
      <Billboard position={stop.dialogOffset ?? [0, 3.4, 1.1]} follow lockX lockZ>
        <Html transform distanceFactor={7.5} className="pointer-events-none">
          <StopCard title={stop.title} body={stop.body} link={stop.link} onPrimary={() => onSelect(stop.id)} />
        </Html>
      </Billboard>
    </group>
  );
}
