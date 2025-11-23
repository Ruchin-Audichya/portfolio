"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Hand } from "lucide-react";
import { useTheme } from "next-themes";
import { Trees, SceneElements } from "./Elements";
import { LoadingProgress } from "./LoadingProgress";
import { Particles } from "./Particles";
import { Clouds } from "./Clouds";
import { Birds } from "./Birds";
import { NavigationGems } from "./NavigationGems";
import { LightManager } from "./LightManager";
import { Neon999 } from "./Neon999";

interface WorldProps {
    onNodeClick?: (id: any) => void;
}

function SafeOrbitControls(props: any) {
    const { gl, camera } = useThree();
    if (!gl || !gl.domElement) return null;
    return <OrbitControls {...props} args={[camera, gl.domElement]} />;
}

export default function World({ onNodeClick }: WorldProps) {
    const groupRef = useRef<THREE.Group>(null);
    const { resolvedTheme } = useTheme();
    const isNight = resolvedTheme === 'dark';
    const [isInteracting, setIsInteracting] = useState(false);
    const { gl } = useThree();

    useEffect(() => {
        if (gl.domElement) {
            gl.domElement.style.touchAction = isInteracting ? 'none' : 'auto';
        }
    }, [isInteracting, gl.domElement]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            if (!isInteracting) {
                groupRef.current.rotation.y += delta * 0.05;
            }
        }
    });

    const toggleInteraction = () => {
        setIsInteracting((prev) => !prev);
    };

    return (
        <>
            <LoadingProgress />

            <Html position={[0, 0, 0]} fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
                <div className="absolute bottom-6 left-0 right-0 pointer-events-none z-50 flex flex-col items-center gap-4">
                    {!isInteracting && (
                        <div className="px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/20 text-white text-sm md:text-base animate-pulse">
                            👆 Tap the hand icon to rotate the world
                        </div>
                    )}

                    <button
                        onClick={toggleInteraction}
                        className={`pointer-events-auto p-4 rounded-full backdrop-blur-md border shadow-2xl transition-all duration-300 active:scale-95 ${isInteracting
                            ? "bg-gradient-to-br from-pink-500 to-purple-600 border-pink-400 text-white shadow-pink-500/50 animate-pulse"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                            }`}
                        aria-label={isInteracting ? "Disable 3D Interaction" : "Enable 3D Interaction"}
                    >
                        <Hand className="w-6 h-6 md:w-7 md:h-7" />
                    </button>

                    {isInteracting && (
                        <div className="px-6 py-3 rounded-2xl backdrop-blur-md bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-400/30 text-white text-xs md:text-sm text-center shadow-lg max-w-xs">
                            <p className="font-semibold mb-1">🎮 Touch Controls Active</p>
                            <p className="text-white/80">
                                1 finger: Rotate • 2 fingers: Zoom
                            </p>
                        </div>
                    )}
                </div>
            </Html>

            <SafeOrbitControls
                enabled={isInteracting}
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={25}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
                enableDamping={true}
                dampingFactor={0.08}
                rotateSpeed={1.2}
                zoomSpeed={1.0}
                touches={{
                    ONE: THREE.TOUCH.ROTATE,
                    TWO: THREE.TOUCH.DOLLY_PAN
                }}
                mouseButtons={{
                    LEFT: THREE.MOUSE.ROTATE,
                    MIDDLE: THREE.MOUSE.DOLLY,
                    RIGHT: THREE.MOUSE.PAN
                }}
                makeDefault
            />

            <ambientLight intensity={isNight ? 0.5 : 0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={isNight ? 0.8 : 1.5}
                color={isNight ? "#9DB4D3" : "#FFF4E6"}
                castShadow
            />
            {isNight && <pointLight position={[0, 8, 0]} intensity={2} color="#B8CFEA" distance={20} />}

            <group ref={groupRef} position={[0, -2, 0]}>
                {/* Ground - Simple for performance */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
                    <planeGeometry args={[40, 40]} />
                    <meshStandardMaterial
                        color={isNight ? "#1a2332" : "#8fbc8f"}
                        roughness={0.8}
                        metalness={0.2}
                    />
                </mesh>

                <Trees count={20} radius={9} isNight={isNight} />
                <SceneElements isNight={isNight} />
                <LightManager isNight={isNight} />
                <NavigationGems />
                <Neon999 />
            </group>

            <color attach="background" args={[isNight ? "#0B1026" : "#87CEEB"]} />
            <fog attach="fog" args={[isNight ? "#0B1026" : "#B0D4F1", 10, 30]} />

            <Particles count={isNight ? 150 : 0} isNight={isNight} />
            <Clouds count={8} isNight={isNight} />
            <Birds count={5} isNight={isNight} />
        </>
    );
}
