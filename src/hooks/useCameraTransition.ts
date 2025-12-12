import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

export type CameraTransitionOptions = {
  targetPos: THREE.Vector3;
  targetLookAt?: THREE.Vector3;
  duration?: number;
  easing?: (t: number) => number;
};

const easeInOut = (t: number) => 0.5 * (1 - Math.cos(Math.PI * t));

export function useCameraTransition() {
  const { camera } = useThree();
  const [isTransitioning, setTransitioning] = useState(false);
  const transitionRef = useRef<{
    fromPos: THREE.Vector3;
    toPos: THREE.Vector3;
    fromQuat: THREE.Quaternion;
    toQuat: THREE.Quaternion;
    start: number;
    duration: number;
    easing: (t: number) => number;
  } | null>(null);

  const startTransition = ({ targetPos, targetLookAt, duration = 1.0, easing = easeInOut }: CameraTransitionOptions) => {
    const fromPos = camera.position.clone();
    const toPos = targetPos.clone();
    const fromQuat = camera.quaternion.clone();
    const lookAt = targetLookAt ? targetLookAt.clone() : new THREE.Vector3();
    const m = new THREE.Matrix4().lookAt(toPos, lookAt, new THREE.Vector3(0, 1, 0));
    const toQuat = new THREE.Quaternion().setFromRotationMatrix(m);

    transitionRef.current = { fromPos, toPos, fromQuat, toQuat, start: performance.now(), duration: duration * 1000, easing };
    setTransitioning(true);
  };

  useFrame(() => {
    if (!transitionRef.current) return;
    const { fromPos, toPos, fromQuat, toQuat, start, duration, easing } = transitionRef.current;
    const t = Math.min(1, (performance.now() - start) / duration);
    const k = easing(t);

    camera.position.lerpVectors(fromPos, toPos, k);
    camera.quaternion.slerpQuaternions(fromQuat, toQuat, k);
    camera.updateProjectionMatrix();

    if (t >= 1) {
      transitionRef.current = null;
      setTransitioning(false);
    }
  });

  return { startTransition, isTransitioning } as const;
}
