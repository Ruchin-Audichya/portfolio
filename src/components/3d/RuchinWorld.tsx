"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Stars, Environment, Html } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { CityCoronas } from "./CityCoronas";
import { Clouds } from "./Clouds";
import { SnowParticles } from "./SnowParticles";
import { Hill } from "./World/Hill";
import { RoadRing } from "./World/RoadRing";
import { OuterRing, RingItem } from "./World/OuterRing";
import { Stops, StoryStopData } from "./World/Stops";
import { Cyclist } from "./World/Cyclist";
import { Skybox } from "./World/Skybox";
import { ControlsManager } from "./World/ControlsManager";
import { useCameraTransition } from "@/hooks/useCameraTransition";
import { LoadingProgress } from "@/components/ui/LoadingProgress";

interface RuchinWorldProps {
  onNodeClick?: (id: any) => void;
  scrollProgress?: number;
}

export function RuchinWorld({ onNodeClick, scrollProgress = 0 }: RuchinWorldProps) {
  const { resolvedTheme } = useTheme();
  const { size, gl } = useThree();
  const isMobile = size.width < 768;

  const fogRef = useRef<THREE.Fog>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const groundMat = useRef<THREE.MeshStandardMaterial>(null);
  const roadMat = useRef<THREE.MeshStandardMaterial>(null);
  const hillMat = useRef<THREE.MeshStandardMaterial>(null);
  const coronasMat = useRef<THREE.PointsMaterial>(null);
  const cyclistRef = useRef<THREE.Group>(null);
  const cyclistAngleRef = useRef(0);

  const [activeStop, setActiveStop] = useState<string | null>(null);
  const [hoveredStop, setHoveredStop] = useState<string | null>(null);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourRunning, setTourRunning] = useState(false);
  const [mounted, setMounted] = useState(false);

  const blendRef = useRef(0);
  const proximityAccumulator = useRef(0);
  const activeStopRef = useRef<string | null>(null);
  const userPinned = useRef(false);
  const pinTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollProgressRef = useRef(0);

  const { startTransition, isTransitioning } = useCameraTransition();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  const stops = useMemo<StoryStopData[]>(
    () => [
      { id: "origin", title: "2019 — First Hustle", body: "Licenses, PC fixes, dropshipping. A teen runs a tiny economy.", position: new THREE.Vector3(0, 0, 13), dialogOffset: [0, 3.5, 1.2], link: "#projects" },
      { id: "cloud", title: "Cloud Path", body: "JECRC + AWS. Python, APIs, GitHub, 5+ cloud badges. Real systems, not theory.", position: new THREE.Vector3(-11.5, 0, 8.5), dialogOffset: [0, 3.5, 1.2], link: "#skills" },
      { id: "club", title: "AWS Cloud Club", body: "Content & graphics head. Worked with an AWS exec to shape events and voice.", position: new THREE.Vector3(12.5, 0, 7), dialogOffset: [0, 3.5, 1.2], link: "#about" },
      { id: "campaign", title: "50,000 Students", body: "AICTE x OPPO x 1M1B. Stages, classrooms, online — energizing a movement.", position: new THREE.Vector3(-14, 0, -4), dialogOffset: [0, 3.8, 1.3], link: "#achievements" },
      { id: "internships", title: "Field Roles", body: "AICTE intern, JECRC ambassador, AWS clubs member. Coordination and delivery.", position: new THREE.Vector3(4, 0, -13), dialogOffset: [0, 3.5, 1.2], link: "#about" },
      { id: "today", title: "Now", body: "Automation, dev tools, scalable systems. This 3D city is the proof.", position: new THREE.Vector3(15, 0, -8), dialogOffset: [0, 3.6, 1.25], link: "#contact" },
    ],
    []
  );

  const palette = useMemo(
    () => ({
      groundDay: new THREE.Color("#d9c28a"),
      groundNight: new THREE.Color("#12203a"),
      roadDay: new THREE.Color("#4a5568"),
      roadNight: new THREE.Color("#26375c"),
      hillDay: new THREE.Color("#9fcf85"),
      hillNight: new THREE.Color("#1f2c52"),
      fogDay: new THREE.Color("#f3d9b6"),
      fogNight: new THREE.Color("#0d1836"),
      ambientDay: new THREE.Color("#ffe8c9"),
      ambientNight: new THREE.Color("#3a2b6f"),
      dirDay: new THREE.Color("#ffc277"),
      dirNight: new THREE.Color("#b4c8ff"),
      backgroundDay: new THREE.Color("#9fd3ff"),
      backgroundNight: new THREE.Color("#0a1230"),
    }),
    []
  );

  const ringLayout = useMemo<RingItem[]>(
    () => [
      { id: "cyber-east", kind: "cyberHub", position: [17, 0, 3], rotationY: Math.PI / 1.6 },
      { id: "tree-e1", kind: "tree", position: [15, 0, 10], scale: 1 },
      { id: "cafe-north", kind: "cloudCafe", position: [4, 0, 18], rotationY: -Math.PI / 2 },
      { id: "tree-n1", kind: "tree", position: [-4, 0, 18], scale: 1.1 },
      { id: "stage-west", kind: "stage", position: [-17, 0, 4], rotationY: Math.PI / 2 },
      { id: "tree-w1", kind: "tree", position: [-15, 0, -4], scale: 1 },
      { id: "truck-south", kind: "foodTruck", position: [-4, 0, -18], rotationY: Math.PI / 2 },
      { id: "tree-s1", kind: "tree", position: [4, 0, -18], scale: 1 },
      { id: "diner-se", kind: "diner", position: [16, 0, -8], rotationY: Math.PI / 3 },
      { id: "garage-nw", kind: "garage", position: [-16, 0, 11], rotationY: -Math.PI / 3 },
      { id: "tower-se", kind: "building", position: [12, 0, -14], scale: [1.6, 3.2, 1.6], rotationY: Math.PI / 1.1 },
      { id: "tower-nw", kind: "building", position: [-12, 0, 14], scale: [1.6, 3.2, 1.6], rotationY: -Math.PI / 1.1 },
      { id: "tree-buffer-e", kind: "tree", position: [10, 0, 14], scale: 0.9 },
      { id: "tree-buffer-w", kind: "tree", position: [-10, 0, 10], scale: 0.9 },
    ],
    []
  );

  const isNight = mounted ? resolvedTheme === "dark" : false;

  const focusStop = useCallback(
    (stopId: string) => {
      const stop = stops.find((s) => s.id === stopId);
      if (!stop) return;
      const offset = new THREE.Vector3(stop.position.x, stop.position.y + 4.5, stop.position.z + 6.5);
      const lookAt = stop.position.clone();
      startTransition({ targetPos: offset, targetLookAt: lookAt, duration: 1.2 });
    },
    [startTransition, stops]
  );

  const handleStopClick = (id: string) => {
    userPinned.current = true;
    activeStopRef.current = id;
    setActiveStop(id);
    focusStop(id);
    if (pinTimer.current) clearTimeout(pinTimer.current);
    pinTimer.current = setTimeout(() => {
      userPinned.current = false;
    }, 8000);
    if (onNodeClick) onNodeClick(id);
  };

  const handleHover = (id: string | null) => setHoveredStop(id);

  const handleTourAdvance = useCallback(
    (direction: 1 | -1) => {
      const nextIndex = (tourIndex + direction + stops.length) % stops.length;
      setTourIndex(nextIndex);
      const nextId = stops[nextIndex].id;
      setActiveStop(nextId);
      activeStopRef.current = nextId;
      userPinned.current = true;
      focusStop(nextId);
      if (pinTimer.current) clearTimeout(pinTimer.current);
      pinTimer.current = setTimeout(() => {
        userPinned.current = false;
      }, 8000);
    },
    [focusStop, stops, tourIndex]
  );

  // Disable auto-tour to prevent disorienting jumps; manual Prev/Next only
  useEffect(() => {}, [tourRunning, tourIndex, handleTourAdvance]);

  useFrame((state, delta) => {
    const target = isNight ? 1 : 0;
    blendRef.current = THREE.MathUtils.lerp(blendRef.current, target, 1 - Math.exp(-delta * 5));
    const b = blendRef.current;

    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(1.0, 0.5, b);
      ambientRef.current.color.lerpColors(palette.ambientDay, palette.ambientNight, b);
    }
    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(1.35, 0.85, b);
      dirRef.current.color.lerpColors(palette.dirDay, palette.dirNight, b);
    }
    if (groundMat.current) groundMat.current.color.lerpColors(palette.groundDay, palette.groundNight, b);
    if (roadMat.current) roadMat.current.color.lerpColors(palette.roadDay, palette.roadNight, b);
    if (hillMat.current) hillMat.current.color.lerpColors(palette.hillDay, palette.hillNight, b);
    if (coronasMat.current) {
      coronasMat.current.opacity = Math.min(1.2 * b, 1);
      coronasMat.current.transparent = true;
      coronasMat.current.needsUpdate = true;
    }
    if (fogRef.current) {
      fogRef.current.color.lerpColors(palette.fogDay, palette.fogNight, b);
      fogRef.current.near = THREE.MathUtils.lerp(14, 11, b);
      fogRef.current.far = THREE.MathUtils.lerp(70, 62, b);
    }
    gl.setClearColor(palette.backgroundDay.clone().lerp(palette.backgroundNight, b));

    if (cyclistRef.current) {
      const scrollValue = scrollProgressRef.current;
      const fallbackAngle = state.clock.elapsedTime * 0.12;
      const targetAngle = scrollValue > 0.001 ? scrollValue * Math.PI * 2 : fallbackAngle;
      cyclistAngleRef.current = THREE.MathUtils.lerp(cyclistAngleRef.current, targetAngle, 1 - Math.exp(-delta * 6));
      const angle = cyclistAngleRef.current;
      const radius = 12;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      cyclistRef.current.position.set(x, 0.2, z);
      cyclistRef.current.rotation.y = -angle + Math.PI / 2;
    }

    proximityAccumulator.current += delta;
    if (proximityAccumulator.current > 0.3 && cyclistRef.current && !userPinned.current && !isTransitioning && !tourRunning) {
      proximityAccumulator.current = 0;
      let nearest: string | null = null;
      let minDist = Infinity;
      const cpos = cyclistRef.current.position;
      stops.forEach((stop) => {
        const d = cpos.distanceTo(stop.position);
        if (d < minDist) {
          minDist = d;
          nearest = stop.id;
        }
      });
      const openThreshold = 3.6;
      const closeThreshold = 4.6;
      const within = minDist < openThreshold ? nearest : null;
      const shouldClose = minDist > closeThreshold;
      const nextActive = within || (!within && shouldClose ? null : activeStopRef.current);
      if (nextActive !== activeStopRef.current) {
        activeStopRef.current = nextActive;
        setActiveStop(nextActive);
      }
    }
  });

  return (
    <>
      <LoadingProgress />
      <ControlsManager isMobile={isMobile} locked={isTransitioning} />

      <ambientLight ref={ambientRef} intensity={isNight ? 0.5 : 1.15} color={isNight ? "#5b3aa7" : "#ffe2b8"} />
      <hemisphereLight args={[isNight ? "#4f6ac8" : "#f6d6a0", isNight ? "#1a1f38" : "#f7f0dc", isNight ? 0.6 : 0.45]} />
      <directionalLight
        ref={dirRef}
        position={[10, 20, 10]}
        intensity={isNight ? 0.9 : 1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
      >
        <orthographicCamera attach="shadow-camera" args={[-30, 30, 30, -30]} />
      </directionalLight>

      <fog ref={fogRef} attach="fog" args={[palette.fogDay, 14, 70]} />
      <Skybox isNight={isNight} />
      {isNight && <Stars radius={140} depth={60} count={1800} factor={6} saturation={0.1} fade speed={0.8} />}
      <Environment preset={isNight ? "night" : "sunset"} background={isNight} blur={isNight ? 0.6 : 0.25} />

      {isNight && (
        <group>
          <pointLight position={[0, 6, 0]} intensity={2.4} distance={18} color="#ffbf66" decay={1.6} />
          <pointLight position={[8, 4, -6]} intensity={1.9} distance={14} color="#ff66c4" decay={1.8} />
          <pointLight position={[-10, 5, 6]} intensity={1.6} distance={14} color="#7dd3fc" decay={1.8} />
        </group>
      )}

      {isNight && <SnowParticles count={isMobile ? 500 : 1000} />}
      {!isNight && <Clouds count={8} isNight={false} />}
      <CityCoronas count={isMobile ? 1400 : 2200} materialRef={coronasMat} />

      <group position={[0, -2, 0]} scale={isMobile ? 0.8 : 1}>
        <Hill palette={palette} hillMat={hillMat} groundMat={groundMat} isNight={isNight} />
        <RoadRing roadMat={roadMat} isNight={isNight} />
        <OuterRing ringLayout={ringLayout} isNight={isNight} />
        <Stops
          stops={stops}
          activeStop={activeStop}
          hoveredStop={hoveredStop}
          onHover={handleHover}
          onSelect={handleStopClick}
          isNight={isNight}
        />
        <Cyclist ref={cyclistRef} isNight={isNight} />
      </group>

      <Html fullscreen className="pointer-events-none select-none">
        <div className="fixed top-6 right-6 flex flex-col gap-3 pointer-events-auto max-w-sm items-end">
          <div className="rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl shadow-2xl p-4 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">Minimap</div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Guided tour
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {stops.map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => handleStopClick(stop.id)}
                  className={`px-3 py-2 rounded-xl text-[12px] font-semibold transition shadow-sm ${activeStop === stop.id ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"}`}
                >
                  {stop.title.split(" ")[0]}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20" onClick={() => handleTourAdvance(-1)}>Prev</button>
              <button className="px-3 py-2 rounded-lg bg-white text-black text-xs font-semibold" onClick={() => setTourRunning((v) => !v)}>
                {tourRunning ? "Pause" : "Play"}
              </button>
              <button className="px-3 py-2 rounded-lg bg-white/10 text-white text-xs hover:bg-white/20" onClick={() => handleTourAdvance(1)}>Next</button>
            </div>
          </div>
        </div>
      </Html>
    </>
  );
}
