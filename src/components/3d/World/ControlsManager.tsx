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
      // CRITICAL: Disable damping on mobile for instant response
      enableDamping={!isMobile}
      dampingFactor={0.05}
      mouseButtons={{ LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.ROTATE }}
      touches={
        isMobile
          ? {
              ONE: THREE.TOUCH.ROTATE,
              TWO: THREE.TOUCH.DOLLY_PAN,
            }
          : undefined
      }
      // Tighter zoom range for mobile
      minDistance={isMobile ? 22 : 12}
      maxDistance={isMobile ? 50 : 52}
      // CRITICAL: Lock camera above horizon - never go under world
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={0.3}
      // Faster rotation on mobile for snappy feel
      rotateSpeed={isMobile ? 0.8 : 0.5}
      zoomSpeed={isMobile ? 0.8 : 0.8}
      enableRotate
      onStart={() => onUserControlStart?.()}
      onEnd={() => onUserControlEnd?.()}
    />
  );
}
