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
      dampingFactor={0.06}
      mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
      touches={
        isMobile
          ? {
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }
          : undefined
      }
      minDistance={isMobile ? 18 : 12}
      maxDistance={isMobile ? 60 : 52}
      // CRITICAL: Lock camera above horizon - never go under world
      maxPolarAngle={Math.PI / 2.15}
      minPolarAngle={0.2}
      // Smoother, more responsive controls
      rotateSpeed={isMobile ? 0.5 : 0.5}
      zoomSpeed={isMobile ? 0.6 : 0.8}
      // Touch-specific improvements
      enableRotate
      onStart={() => onUserControlStart?.()}
      onEnd={() => onUserControlEnd?.()}
    />
  );
}
