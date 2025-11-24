export function Laptop({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number], scale?: number }) {
    return (
        <group position={position} scale={scale} rotation={[0, -0.5, 0]}>
            {/* Base */}
            <mesh position={[0, 0, 0]} castShadow>
                <boxGeometry args={[1.2, 0.05, 0.8]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Screen */}
            <group position={[0, 0.025, -0.4]} rotation={[-Math.PI / 6, 0, 0]}>
                <mesh position={[0, 0.4, 0]} castShadow>
                    <boxGeometry args={[1.2, 0.8, 0.05]} />
                    <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Display */}
                <mesh position={[0, 0.4, 0.03]}>
                    <planeGeometry args={[1.1, 0.7]} />
                    <meshStandardMaterial color="#000000" emissive="#3b82f6" emissiveIntensity={0.2} />
                </mesh>
            </group>
        </group>
    );
}
