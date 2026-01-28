"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { CityCoronas } from "./CityCoronas";
import { Clouds } from "./Clouds";
import { Particles } from "./Particles";
import { Hill } from "./World/Hill";
import { RoadRing } from "./World/RoadRing";
import { OuterRing, RingItem } from "./World/OuterRing";
import { NeonStreetProps } from "./World/NeonStreetProps";
import { DowntownCluster } from "./World/DowntownCluster";
import { NeonCocktailBar } from "./World/NeonCocktailBar";
import { Stops, StoryStopData } from "./World/Stops";
import { Cyclist } from "./World/Cyclist";
import { Skybox } from "./World/Skybox";
import { ControlsManager } from "./World/ControlsManager";
import { useCameraTransition } from "@/hooks/useCameraTransition";
import type { WorldQuality } from "./Scene";
import type { QualityTier } from "@/lib/three/performance";

interface RuchinWorldProps {
  onNodeClick?: (id: any) => void;
  scrollProgress?: number;
  quality?: WorldQuality;
  renderEnabled?: boolean;
}

/** Maps WorldQuality to QualityTier for performance system */
function toQualityTier(quality: WorldQuality): QualityTier {
  if (quality === "high") return "high";
  if (quality === "medium") return "medium";
  return "low";
}

export function RuchinWorld({ onNodeClick, scrollProgress = 0, quality = "high", renderEnabled = true }: RuchinWorldProps) {
  const { resolvedTheme } = useTheme();
  const { size, gl, camera, invalidate } = useThree();
  const isMobile = size.width < 768;
  const isLowQuality = quality === "low";
  const isMediumOrLow = quality === "medium" || quality === "low";
  const qualityTier = toQualityTier(quality);

  const fogRef = useRef<THREE.Fog>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const fillDirRef = useRef<THREE.DirectionalLight>(null);
  const groundMat = useRef<THREE.MeshStandardMaterial>(null);
  const roadMat = useRef<THREE.MeshStandardMaterial>(null);
  const hillMat = useRef<THREE.MeshStandardMaterial>(null);
  const coronasMat = useRef<THREE.PointsMaterial>(null);
  const cyclistRef = useRef<THREE.Group>(null);
  const cyclistAngleRef = useRef(0);

  const [activeStop, setActiveStop] = useState<string | null>(null);
  const [hoveredStop, setHoveredStop] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [introRunning, setIntroRunning] = useState(true);
  const [deferredReady, setDeferredReady] = useState(false);
  const [mobileOrbitEnabled, setMobileOrbitEnabled] = useState(false);
  const introPlayedRef = useRef(false);
  const introTimeoutRef = useRef<number | null>(null);

  const blendRef = useRef(0);
  const proximityAccumulator = useRef(0);
  const activeStopRef = useRef<string | null>(null);
  const userPinned = useRef(false);
  const pinTimer = useRef<NodeJS.Timeout | null>(null);
  const scrollProgressRef = useRef(0);

  const { startTransition, cancelTransition, isTransitioning } = useCameraTransition();

  const tmpBgColor = useMemo(() => new THREE.Color(), []);
  const tmpRight = useMemo(() => new THREE.Vector3(), []);
  const tmpOutward = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => setMounted(true), []);

  // Defer heavier scene subtrees until the browser is idle to reduce initial stutter.
  useEffect(() => {
    if (!mounted) return;
    let cancelled = false;
    const w = window as any;
    const handle = typeof w.requestIdleCallback === "function"
      ? w.requestIdleCallback(() => {
        if (!cancelled) setDeferredReady(true);
      }, { timeout: 3000 })
      : window.setTimeout(() => {
        if (!cancelled) setDeferredReady(true);
      }, 1500);

    return () => {
      cancelled = true;
      if (typeof w.cancelIdleCallback === "function" && typeof handle === "number") {
        w.cancelIdleCallback(handle);
      } else if (typeof handle === "number") {
        window.clearTimeout(handle);
      }
    };
  }, [mounted]);

  // Mobile UX: Enable orbit immediately with 1 finger for responsiveness
  // The page scroll is handled via the "View Portfolio" button, not swipe
  useEffect(() => {
    if (!mounted || !isMobile) return;
    // Enable orbit controls immediately on mobile
    setMobileOrbitEnabled(true);
  }, [isMobile, mounted]);

  useEffect(() => {
    scrollProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Interaction-aware rendering: full FPS while the user is actively controlling the camera,
  // lower FPS when idle to reduce load on iGPU machines.
  const userControllingRef = useRef(false);
  const lastUserControlAtRef = useRef(0);

  // Demand-render driver: keeps animation smooth while avoiding unnecessary renders.
  // Also stops rendering when the tab is hidden.
  useEffect(() => {
    if (!renderEnabled) return;

    let raf = 0;
    let alive = true;
    let last = performance.now();
    let startTime = performance.now();

    const loop = (now: number) => {
      if (!alive) return;
      raf = window.requestAnimationFrame(loop);
      if (document.hidden) return;

      // Wait 200ms after mount before rendering (reduced from 300)
      if (now - startTime < 200) return;

      const idleForMs = now - lastUserControlAtRef.current;
      const isActive = userControllingRef.current || idleForMs < 1200;

      // Mobile: target 45 FPS when active (smoother than 30, lighter than 60)
      // Desktop: 60 FPS active, very low idle
      const targetFps = isActive
        ? (isMobile ? 45 : (isLowQuality ? 45 : 60))
        : (isMobile ? 10 : (isLowQuality ? 8 : 12));
      const frameInterval = 1000 / targetFps;

      if (now - last < frameInterval) return;
      last = now;
      invalidate();
    };

    raf = window.requestAnimationFrame(loop);
    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
    };
  }, [invalidate, isLowQuality, isMobile, renderEnabled]);

  const stops = useMemo<StoryStopData[]>(
    () => [
      {
        id: "boot-sequence",
        title: "Boot Sequence",
        lines: ["Origin Point", "Curiosity Sparks"],
        body: "PC enthusiast discovers tech. Tinkering with hardware, breaking things, learning fast.",
        position: new THREE.Vector3(0, 0, 13.0),
        cardPosition: new THREE.Vector3(0, 4.5, 16.0),
        link: "#about",
      },
      {
        id: "midnight-build",
        title: "Midnight Build",
        lines: ["Neon Café", "Self-Taught Era"],
        body: "Late nights with Python & APIs. Coffee-fueled coding sessions turn curiosity into skill.",
        position: new THREE.Vector3(9.2, 0, 9.2),
        cardPosition: new THREE.Vector3(11, 4.5, 11),
        link: "#projects",
      },
      {
        id: "compute-floor",
        title: "Cloud Lab",
        lines: ["AWS Certified", "Systems Mastery"],
        body: "AWS Cloud Practitioner earned. Infrastructure-as-code, DevOps pipelines, cloud-native thinking.",
        position: new THREE.Vector3(13.0, 0, 0.0),
        cardPosition: new THREE.Vector3(16, 4.5, 0),
        link: "#skills",
      },
      {
        id: "signal-scale",
        title: "Signal & Scale",
        lines: ["Cloud Club Lead", "Community Builder"],
        body: "Founded AWS Cloud Club at JECRC. Workshops, hackathons, growing the next wave of builders.",
        position: new THREE.Vector3(9.2, 0, -9.2),
        cardPosition: new THREE.Vector3(11, 4.5, -11),
        link: "#achievements",
      },
      {
        id: "oppo-aicte",
        title: "OPPO × AICTE",
        lines: ["Internship", "50K+ Reach"],
        body: "AICTE × OPPO × 1M1B campaign reached 50,000+ students. Real impact, proven at scale.",
        position: new THREE.Vector3(0.0, 0, -13.0),
        cardPosition: new THREE.Vector3(0, 4.5, -16),
        link: "#achievements",
      },
      {
        id: "independent-stack",
        title: "Ruchin's Rig",
        lines: ["Builder's Den", "Independence"],
        body: "i7-12700K Lian Li build. Dropshipping, PC community — value created without permission.",
        position: new THREE.Vector3(-9.2, 0, -9.2),
        cardPosition: new THREE.Vector3(-11, 4.5, -11),
        link: "#projects",
      },
      {
        id: "next-system",
        title: "Next System",
        lines: ["Horizon Deck", "What's Next"],
        body: "Dev tools, automation, scalable systems. The journey continues upward.",
        position: new THREE.Vector3(-13.0, 0, 0.0),
        cardPosition: new THREE.Vector3(-16.0, 4.2, 11.0),
        link: "#contact",
      },
    ],
    []
  );

  const palette = useMemo(
    () => ({
      // Day look: lush grass + sunny sky.
      groundDay: new THREE.Color("#2dd36f"),
      groundNight: new THREE.Color("#0d1830"),
      roadDay: new THREE.Color("#6b7a9a"),
      roadNight: new THREE.Color("#26375c"),
      hillDay: new THREE.Color("#22c55e"),
      hillNight: new THREE.Color("#1f2c52"),
      fogDay: new THREE.Color("#d7f8ff"),
      fogNight: new THREE.Color("#0a1230"),
      ambientDay: new THREE.Color("#fff7e6"),
      ambientNight: new THREE.Color("#3a2b6f"),
      dirDay: new THREE.Color("#fff1d6"),
      dirNight: new THREE.Color("#b4c8ff"),
      backgroundDay: new THREE.Color("#a8dcff"),
      backgroundNight: new THREE.Color("#0a1230"),
    }),
    []
  );

  const ringLayout = useMemo<RingItem[]>(
    () => [
      // SIMPLIFIED LAYOUT: 10 key assets instead of 15+
      // Boot Sequence (north)
      { id: "boot-cafe", kind: "cloudCafe", position: [4, 0, 17], rotationY: Math.atan2(4, 17) },

      // Midnight Build (north-east)
      { id: "midnight-bar", kind: "bar", position: [12, 0, 12], rotationY: Math.atan2(12, 12), scale: 1.2 },

      // Compute Floor (east)
      { id: "compute-cyber", kind: "cyberHub", position: [17, 0, 2], rotationY: Math.atan2(17, 2) },

      // Signal & Scale (south-east)
      { id: "signal-diner", kind: "diner", position: [15, 0, -8], rotationY: Math.atan2(15, -8) },

      // OPPO × AICTE (south)
      { id: "oppo-stage", kind: "stage", position: [0, 0, -17], rotationY: Math.atan2(0, -17) },

      // Independent Stack (south-west)
      { id: "independent-garage", kind: "garage", position: [-15, 0, -10], rotationY: Math.atan2(-15, -10) },

      // Next System (west)
      { id: "next-tower", kind: "building", position: [-16, 0, 0], scale: [1.6, 3.2, 1.6], rotationY: Math.atan2(-16, 0) },

      // Trees for silhouette balance (3 instead of 5)
      { id: "tree-nw", kind: "tree", position: [-10, 0, 14], scale: 1.1 },
      { id: "tree-ne", kind: "tree", position: [8, 0, 15], scale: 0.95 },
      { id: "tree-s", kind: "tree", position: [-5, 0, -16], scale: 1.0 },
    ],
    []
  );

  // IMPORTANT: never change buffer sizes at runtime (Three can't resize GPU attributes).
  // PERFORMANCE-OPTIMIZED: Significantly reduced counts for smooth FPS
  const qualityScale = quality === "high" ? 1.0 : quality === "medium" ? 0.4 : 0.15;

  // Coronas: city glow - halved for performance
  const coronasMax = isMobile ? 80 : 200;
  const coronasVisible = deferredReady
    ? Math.floor((isMobile ? 50 : 150) * qualityScale)
    : Math.floor((isMobile ? 20 : 40) * qualityScale);

  // Stars: fewer but larger
  const starsCount = deferredReady
    ? Math.floor((isMobile ? 60 : 150) * qualityScale)
    : Math.floor((isMobile ? 20 : 50) * qualityScale);
  const starsKey = `stars-${quality}-${deferredReady}`;

  // Default to night mode to prevent flash (matches defaultTheme="dark")
  const isNight = mounted ? resolvedTheme === "dark" : true;

  const focusStop = useCallback(
    (stopId: string) => {
      const stop = stops.find((s) => s.id === stopId);
      if (!stop) return;

      tmpOutward.copy(stop.position).setY(0);
      if (tmpOutward.lengthSq() < 0.0001) tmpOutward.set(0, 0, 1);
      tmpOutward.normalize();
      tmpRight.set(tmpOutward.z, 0, -tmpOutward.x);

      // Over-shoulder framing tuned per device
      const dist = isMobile ? 10.5 : 8.8;
      const side = isMobile ? 3.8 : 2.6;
      const height = isMobile ? 7.0 : 5.2;

      const targetPos = stop.position
        .clone()
        .add(tmpOutward.multiplyScalar(dist))
        .add(tmpRight.multiplyScalar(side))
        .add(new THREE.Vector3(0, height, 0));

      const lookAt = stop.position.clone().add(new THREE.Vector3(0, 1.8, 0));
      startTransition({ targetPos, targetLookAt: lookAt, duration: 1.15 });
    },
    [isMobile, startTransition, stops, tmpOutward, tmpRight]
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

  // Initial camera: start wide and keep controls responsive (no intro transition).
  useEffect(() => {
    if (!mounted) return;

    // In dev (React Strict Mode), effects can run twice; also avoid retriggering on resize.
    if (introPlayedRef.current) return;
    introPlayedRef.current = true;

    cancelTransition();
    setIntroRunning(false);
    // Start closer for a stronger intro.
    const startPos = new THREE.Vector3(0, isMobile ? 13.2 : 10.2, isMobile ? 42.0 : 34.0);
    camera.position.copy(startPos);
    camera.lookAt(0, 0.8, 0);
    camera.updateProjectionMatrix();

    return () => {
      if (introTimeoutRef.current) window.clearTimeout(introTimeoutRef.current);
      introTimeoutRef.current = null;
    };
  }, [camera, cancelTransition, isMobile, mounted]);

  useFrame((state, delta) => {
    if (!renderEnabled) return;

    const target = isNight ? 1 : 0;
    blendRef.current = THREE.MathUtils.lerp(blendRef.current, target, 1 - Math.exp(-delta * 5));
    const b = blendRef.current;

    // Smooth color transitions every frame
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.85, 0.45, b);
      ambientRef.current.color.lerpColors(palette.ambientDay, palette.ambientNight, b);
    }
    if (dirRef.current) {
      dirRef.current.intensity = THREE.MathUtils.lerp(1.8, 0.6, b);
      dirRef.current.color.lerpColors(palette.dirDay, palette.dirNight, b);
    }
    if (fillDirRef.current) fillDirRef.current.intensity = THREE.MathUtils.lerp(1.0, 0.25, b);
    if (groundMat.current) groundMat.current.color.lerpColors(palette.groundDay, palette.groundNight, b);
    if (roadMat.current) roadMat.current.color.lerpColors(palette.roadDay, palette.roadNight, b);
    if (hillMat.current) hillMat.current.color.lerpColors(palette.hillDay, palette.hillNight, b);
    if (coronasMat.current) coronasMat.current.opacity = Math.min(1.2 * b, 1);
    if (fogRef.current) {
      fogRef.current.color.lerpColors(palette.fogDay, palette.fogNight, b);
      fogRef.current.near = THREE.MathUtils.lerp(26, 18, b);
      fogRef.current.far = THREE.MathUtils.lerp(100, 70, b);
    }
    tmpBgColor.copy(palette.backgroundDay).lerp(palette.backgroundNight, b);
    gl.setClearColor(tmpBgColor);
    gl.toneMappingExposure = THREE.MathUtils.lerp(1.1, 1.18, b);

    if (cyclistRef.current) {
      const scrollValue = scrollProgressRef.current;
      const fallbackAngle = state.clock.elapsedTime * 0.10;
      const targetAngle = scrollValue > 0.001 ? scrollValue * Math.PI * 2 : fallbackAngle;
      cyclistAngleRef.current = THREE.MathUtils.lerp(cyclistAngleRef.current, targetAngle, 1 - Math.exp(-delta * 5));
      const angle = cyclistAngleRef.current;
      const radius = 11.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Simple bob, skip expensive lean calculation
      const bob = 0.04 * Math.sin(state.clock.elapsedTime * 8);
      cyclistRef.current.position.set(x, 0.22 + bob, z);
      cyclistRef.current.rotation.y = -angle + Math.PI / 2;
    }

    proximityAccumulator.current += delta;
    if (proximityAccumulator.current > 0.5 && cyclistRef.current && !userPinned.current && !isTransitioning) {
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
      const openThreshold = 3.25;
      const closeThreshold = 4.1;
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
      <ControlsManager
        isMobile={isMobile}
        locked={isMobile ? !mobileOrbitEnabled : false}
        onUserControlStart={() => {
          userControllingRef.current = true;
          lastUserControlAtRef.current = performance.now();
          cancelTransition();
          setIntroRunning(false);
          if (!deferredReady) setDeferredReady(true);
        }}
        onUserControlEnd={() => {
          userControllingRef.current = false;
          lastUserControlAtRef.current = performance.now();
        }}
      />

      <ambientLight ref={ambientRef} intensity={isNight ? 0.6 : 0.95} color={isNight ? "#8b7fd8" : "#ffffff"} />
      <hemisphereLight args={[isNight ? "#8090e0" : "#dbeafe", isNight ? "#1a1f38" : "#f0fdf4", isNight ? 0.65 : 0.3]} />
      <directionalLight
        ref={dirRef}
        position={[12, 22, 12]}
        intensity={isNight ? 0.5 : 1.9}
        // Shadows: desktop high quality day only
        castShadow={!isNight && !isMobile && quality === "high"}
        shadow-mapSize={[512, 512]}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
        shadow-radius={2}
      >
        <orthographicCamera attach="shadow-camera" args={[-18, 18, 18, -18]} />
      </directionalLight>

      {/* Single fill light for form - no rim */}
      <directionalLight ref={fillDirRef} position={[-15, 12, 10]} intensity={isNight ? 0.2 : 0.9} color={isNight ? "#60a5fa" : "#ffffff"} />

      <fog ref={fogRef} attach="fog" args={[palette.fogDay, 24, 95]} />
      <Skybox isNight={isNight} />
      {isNight && <Stars key={starsKey} radius={150} depth={50} count={starsCount} factor={8} saturation={0.15} fade speed={0.6} />}
      {/* Environment: only for high quality desktop - adds nice reflections */}
      {deferredReady && isNight && quality === "high" && !isMobile && <Environment preset="night" background={false} blur={0.5} />}

      {/* Night accent lights removed for performance - emissive materials provide similar effect */}
      {!isNight && <Clouds count={2} isNight={false} />}
      <CityCoronas count={coronasMax} visibleCount={isNight ? coronasVisible : 0} materialRef={coronasMat} />

      <group position={[0, -2, 0]} scale={isMobile ? 0.8 : 1}>
        <Hill palette={palette} hillMat={hillMat} groundMat={groundMat} isNight={isNight} />
        <RoadRing roadMat={roadMat} isNight={isNight} />
        <OuterRing ringLayout={ringLayout} isNight={isNight} quality={quality} />
        <NeonStreetProps isNight={isNight} quality={qualityTier} />
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

    </>
  );
}
