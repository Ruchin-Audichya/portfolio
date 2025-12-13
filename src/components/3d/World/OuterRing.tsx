import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { LowPolyTree, NeonFoodTruck, NeonDiner, NeonGarage, CityBuilding, CloudCafe, CyberHub, Stage } from "../LowPolyAssets";
import { DowntownCluster } from "./DowntownCluster";
import { NeonCocktailBar } from "./NeonCocktailBar";
import type { WorldQuality } from "../Scene";
import type { QualityTier } from "@/lib/three/performance";
import { LightBudget } from "@/lib/three/performance";
import { freezeGroup } from "@/lib/three/performance";

export type RingItem = {
  id: string;
  kind: "tree" | "building" | "foodTruck" | "diner" | "garage" | "cloudCafe" | "cyberHub" | "stage" | "downtown" | "bar";
  position: [number, number, number];
  scale?: [number, number, number] | number;
  rotationY?: number;
};

interface OuterRingProps {
  ringLayout: RingItem[];
  isNight: boolean;
  quality?: WorldQuality;
}

/**
 * Maps WorldQuality to QualityTier for components that use the new performance system.
 * This provides a bridge during migration.
 */
function toQualityTier(quality: WorldQuality): QualityTier {
  if (quality === "high") return "high";
  if (quality === "medium") return "medium";
  return "low";
}

export function OuterRing({ ringLayout, isNight, quality = "high" }: OuterRingProps) {
  const qualityTier = toQualityTier(quality);
  const lightBudget = useMemo(() => new LightBudget(quality === "high" ? 4 : quality === "medium" ? 2 : 0), [quality]);
  lightBudget.reset();
  const enableLights = isNight && quality !== "low";
  const ringRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (ringRef.current) freezeGroup(ringRef.current);
  }, []);
  return (
    <group ref={ringRef}>
      {ringLayout.map((item) => {
        if (item.kind === "tree") {
          return <LowPolyTree key={item.id} position={item.position} scale={(item.scale as number) ?? 1} isNight={isNight} />;
        }
        if (item.kind === "building") {
          return (
            <CityBuilding
              key={item.id}
              position={item.position}
              scale={(item.scale as [number, number, number]) ?? [1, 1, 1]}
              rotationY={item.rotationY}
              isNight={isNight}
            />
          );
        }
        if (item.kind === "foodTruck") {
          const allowLight = enableLights && lightBudget.canAddLight();
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <NeonFoodTruck position={[0, 0, 0]} isNight={isNight} />
              {allowLight && <pointLight position={[0, 2, 0]} intensity={2.0} distance={8} color="#f97316" />}
            </group>
          );
        }
        if (item.kind === "diner") {
          const allowLight = enableLights && lightBudget.canAddLight();
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <NeonDiner position={[0, 0, 0]} isNight={isNight} />
              {allowLight && <pointLight position={[0, 2.7, 1]} intensity={1.5} distance={8} color="#ff2d55" />}
            </group>
          );
        }
        if (item.kind === "garage") {
          const allowLight = enableLights && lightBudget.canAddLight();
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <NeonGarage position={[0, 0, 0]} isNight={isNight} />
              {allowLight && <pointLight position={[0, 2.2, 0]} intensity={2.0} distance={9} color="#3b82f6" />}
            </group>
          );
        }
        if (item.kind === "cloudCafe") {
          return <CloudCafe key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]} isNight={isNight} />;
        }
        if (item.kind === "cyberHub") {
          return <CyberHub key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]} isNight={isNight} />;
        }
        if (item.kind === "stage") {
          const allowLight = enableLights && lightBudget.canAddLight();
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <Stage position={[0, 0, 0]} rotation={[0, 0, 0]} isNight={isNight} />
              {allowLight && <pointLight position={[0, 4, 0]} intensity={2.1} distance={10} color="#a855f7" />}
            </group>
          );
        }
        if (item.kind === "downtown") {
          return <DowntownCluster key={item.id} isNight={isNight} position={item.position} rotationY={item.rotationY ?? 0} scale={(item.scale as number) ?? 1} quality={qualityTier} />;
        }
        if (item.kind === "bar") {
          return <NeonCocktailBar key={item.id} isNight={isNight} position={item.position} rotationY={item.rotationY ?? 0} scale={(item.scale as number) ?? 1} />;
        }
        return null;
      })}
    </group>
  );
}
