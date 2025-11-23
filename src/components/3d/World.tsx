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

    // Handle touch action for mobile scrolling
    useEffect(() => {
        if (gl.domElement) {
            // 'none' prevents browser scrolling (allows 3D interaction)
            // 'auto' allows browser scrolling (passes through clicks)
            gl.domElement.style.touchAction = isInteracting ? 'none' : 'auto';
        }
    }, [isInteracting, gl.domElement]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            // Continuous slow rotation if not interacting
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

            {/* UI Controls - Mobile Friendly */}
            <Html position={[0, 0, 0]} fullscreen style={{ pointerEvents: 'none' }} zIndexRange={[100, 0]}>
                <div className="absolute bottom-6 right-6 pointer-events-auto z-50 flex flex-col gap-4">
                    {/* Interaction Toggle (Mobile Optimization) */}
                    <button
                        onClick={toggleInteraction}
                        className={`p-3 rounded-full backdrop-blur-md border shadow-lg transition-all active:scale-95 ${isInteracting
                            ? "bg-blue-500/80 border-blue-400 text-white"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                            }`}
                        aria-label={isInteracting ? "Disable 3D Interaction" : "Enable 3D Interaction"}
                    >
                        <Hand className="w-6 h-6" />
                    </button>
                </div>
            </Html>

            {/* Controls - Only enabled when interacting */}
            <SafeOrbitControls
                enabled={isInteracting}
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={20}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
                enableDamping={true}
                dampingFactor={0.05}
                rotateSpeed={0.6}
                zoomSpeed={0.8}
                touches={{
                    ONE: 2, // TOUCH_ROTATE
                    TWO: 1  // TOUCH_DOLLY_PAN
                }}
                makeDefault
            />

            {/* Brighter lighting for night mode */}
            <ambientLight intensity={isNight ? 0.5 : 0.6} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={isNight ? 0.8 : 1.5}
                color={isNight ? "#9DB4D3" : "#FFF4E6"}
                castShadow
            />
            {isNight && <pointLight position={[0, 8, 0]} intensity={2} color="#B8CFEA" distance={20} />}

            {/* The Rotating World */}
            <group ref={groupRef} position={[0, -2, 0]}>
                {/* Ground - Natural colors */}
                <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[10, 64]} />
                    <meshStandardMaterial color={isNight ? "#1a2332" : "#4A7C59"} />
                </mesh>

                {/* Elements */}
                <Trees count={20} radius={9} isNight={isNight} />
                <SceneElements isNight={isNight} />

                {/* GTA 2DFX Light Manager */}
                <LightManager isNight={isNight} />

                {/* Navigation Gems */}
                <NavigationGems />
            </group>

            {/* Background Color - Realistic sky */}
            <color attach="background" args={[isNight ? "#0B1026" : "#87CEEB"]} />

            {/* Fog for depth */}
            <fog attach="fog" args={[isNight ? "#0B1026" : "#B0D4F1", 10, 30]} />

            {/* More visible stars at night */}
            <Particles count={isNight ? 150 : 0} isNight={isNight} />

            {/* Day Clouds */}
            <Clouds count={8} isNight={isNight} />

            {/* Day Birds */}
            <Birds count={5} isNight={isNight} />
        </>
    );
}
