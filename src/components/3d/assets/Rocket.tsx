import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function Rocket({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number], scale?: number }) {
    const ref = useRef<any>(null);

    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    return (
        <group position={position} scale={scale} ref={ref}>
            {/* Body */}
            <mesh position={[0, 1, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
                <meshStandardMaterial color="#e2e8f0" metalness={0.5} roughness={0.2} />
            </mesh>
            {/* Nose */}
            <mesh position={[0, 2.2, 0]} castShadow>
                <coneGeometry args={[0.2, 0.5, 8]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>
            {/* Fins */}
            <mesh position={[0, 0.2, 0]} castShadow>
                <boxGeometry args={[1, 0.4, 0.1]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>
            <mesh position={[0, 0.2, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[1, 0.4, 0.1]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>
            {/* Window */}
            <mesh position={[0, 1.5, 0.15]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
            </mesh>
        </group>
    );
}
