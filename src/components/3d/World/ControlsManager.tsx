import React from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface ControlsManagerProps {
  isMobile: boolean;
  locked?: boolean;
  onUserControlStart?: () => void;
  onUserControlEnd?: () => void;
}

export function ControlsManager({ isMobile, locked = false, onUserControlStart, onUserControlEnd }: ControlsManagerProps) {
  return (
    <OrbitControls
      makeDefault
      enabled={!locked}
      enablePan={false}
      enableZoom
      enableDamping
      dampingFactor={0.08}
      mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
      touches={
        isMobile
          ? {
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_ROTATE,
            }
          : undefined
      }
      minDistance={isMobile ? 20 : 14}
      maxDistance={isMobile ? 55 : 48}
      // CRITICAL: Lock camera above horizon - never go under world
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={0.25}
      rotateSpeed={isMobile ? 0.7 : 0.6}
      zoomSpeed={0.9}
      onStart={() => onUserControlStart?.()}
      onEnd={() => onUserControlEnd?.()}
    />
  );
}
