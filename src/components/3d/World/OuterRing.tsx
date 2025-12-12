import React from "react";
import { LowPolyTree, NeonFoodTruck, NeonDiner, NeonGarage, CityBuilding, CloudCafe, CyberHub, Stage } from "../LowPolyAssets";

export type RingItem = {
  id: string;
  kind: "tree" | "building" | "foodTruck" | "diner" | "garage" | "cloudCafe" | "cyberHub" | "stage";
  position: [number, number, number];
  scale?: [number, number, number] | number;
  rotationY?: number;
};

interface OuterRingProps {
  ringLayout: RingItem[];
  isNight: boolean;
}

export function OuterRing({ ringLayout, isNight }: OuterRingProps) {
  return (
    <group>
      {ringLayout.map((item) => {
        if (item.kind === "tree") {
          return <LowPolyTree key={item.id} position={item.position} scale={(item.scale as number) ?? 1} />;
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
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <NeonFoodTruck position={[0, 0, 0]} isNight={isNight} />
              <pointLight position={[0, 2, 0]} intensity={isNight ? 2.2 : 1.1} distance={8} color="#f97316" />
            </group>
          );
        }
        if (item.kind === "diner") {
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <NeonDiner position={[0, 0, 0]} isNight={isNight} />
              <pointLight position={[0, 3, 1]} intensity={isNight ? 1.8 : 0.8} distance={8} color="#ff00ff" />
            </group>
          );
        }
        if (item.kind === "garage") {
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <NeonGarage position={[0, 0, 0]} />
              <pointLight position={[0, 2.2, 0]} intensity={isNight ? 2.2 : 1.0} distance={9} color="#3b82f6" />
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
          return (
            <group key={item.id} position={item.position} rotation={[0, item.rotationY ?? 0, 0]}>
              <Stage position={[0, 0, 0]} rotation={[0, 0, 0]} isNight={isNight} />
              <pointLight position={[0, 4, 0]} intensity={isNight ? 2.4 : 1.0} distance={10} color="#a855f7" />
            </group>
          );
        }
        return null;
      })}
    </group>
  );
}
