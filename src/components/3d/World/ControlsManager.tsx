import React, { useEffect, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ControlsManagerProps {
  isMobile: boolean;
  locked?: boolean;
}

export function ControlsManager({ isMobile, locked = false }: ControlsManagerProps) {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    if (locked) return;
    const speed = isMobile ? 3 : 5;
    const dir = new THREE.Vector3();
    if (keys.current["w"] || keys.current["arrowup"]) dir.z -= 1;
    if (keys.current["s"] || keys.current["arrowdown"]) dir.z += 1;
    if (keys.current["a"] || keys.current["arrowleft"]) dir.x -= 1;
    if (keys.current["d"] || keys.current["arrowright"]) dir.x += 1;

    if (dir.lengthSq() > 0) {
      dir.normalize().multiplyScalar(speed * delta);
      velocity.current.lerp(dir, 0.5);
      camera.position.add(velocity.current);
    } else {
      velocity.current.lerp(new THREE.Vector3(), 0.2);
    }
  });

  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableZoom
      minDistance={isMobile ? 24 : 18}
      maxDistance={isMobile ? 54 : 44}
      maxPolarAngle={Math.PI / 2.1}
      minPolarAngle={Math.PI / 4}
      rotateSpeed={0.5}
    />
  );
}
