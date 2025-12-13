"use client";

import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { CityCoronas } from "./CityCoronas";
import { Clouds } from "./Clouds";
import { SnowParticles } from "./SnowParticles";
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
  const rimDirRef = useRef<THREE.DirectionalLight>(null);
  const followSpotRef = useRef<THREE.SpotLight>(null);
  const followTarget = useMemo(() => new THREE.Object3D(), []);
  const groundMat = useRef<THREE.MeshStandardMaterial>(null);
  const roadMat = useRef<THREE.MeshStandardMaterial>(null);
  const hillMat = useRef<THREE.MeshStandardMaterial>(null);
  const coronasMat = useRef<THREE.PointsMaterial>(null);
  const cyclistRef = useRef<THREE.Group>(null);
  const cyclistAngleRef = useRef(0);
  const cyclistPrevAngleRef = useRef(0);
  const cyclistTurnVelRef = useRef(0);

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
  const tmpForward = useMemo(() => new THREE.Vector3(), []);
  const tmpTarget = useMemo(() => new THREE.Vector3(), []);
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
      // Boot Sequence (north/front) - assets face inward toward center (0,0,0)
      // For position [x, z], facing center means rotationY = atan2(x, z)
      { id: "boot-tree-n", kind: "tree", position: [0, 0, 18], scale: 1.1 },
      { id: "boot-cafe", kind: "cloudCafe", position: [4.5, 0, 17.5], rotationY: Math.atan2(4.5, 17.5) },

      // Midnight Build (north-east) - face center
      { id: "midnight-bar", kind: "bar", position: [11, 0, 11], rotationY: Math.atan2(11, 11), scale: 1.15 },
      { id: "midnight-tree", kind: "tree", position: [8, 0, 16], scale: 0.9 },

      // Compute Floor (east) - face center
      { id: "compute-cyber", kind: "cyberHub", position: [17.5, 0, 3], rotationY: Math.atan2(17.5, 3) },
      { id: "compute-tower", kind: "building", position: [16, 0, 0], scale: [1.8, 3.4, 1.8], rotationY: Math.atan2(16, 0) },

      // Signal & Scale (south-east) - face center
      { id: "signal-diner", kind: "diner", position: [15.5, 0, -7.5], rotationY: Math.atan2(15.5, -7.5) },
      { id: "signal-tree", kind: "tree", position: [11.5, 0, -13.5], scale: 1 },

      // OPPO × AICTE (south) - concert stage faces center
      { id: "oppo-stage", kind: "stage", position: [0, 0, -17.5], rotationY: Math.atan2(0, -17.5) },
      { id: "oppo-truck", kind: "foodTruck", position: [-4, 0, -18], rotationY: Math.atan2(-4, -18) },

      // Independent Stack (south-west) - face center
      { id: "independent-garage", kind: "garage", position: [-15.5, 0, -9.5], rotationY: Math.atan2(-15.5, -9.5) },
      { id: "independent-downtown", kind: "downtown", position: [-14.5, 0, -14.5], rotationY: Math.atan2(-14.5, -14.5), scale: 0.9 },

      // Next System (west) - face center
      { id: "next-tower", kind: "building", position: [-16.5, 0, 0], scale: [1.8, 3.4, 1.8], rotationY: Math.atan2(-16.5, 0) },
      { id: "next-downtown", kind: "downtown", position: [-14.5, 0, 12.5], rotationY: Math.atan2(-14.5, 12.5), scale: 1 },

      // Buffer silhouette for vignette balance
      { id: "buffer-tree-nw", kind: "tree", position: [-8, 0, 15], scale: 1.1 },
    ],
    []
  );

  // IMPORTANT: never change buffer sizes at runtime (Three can't resize GPU attributes).
  // Keep max sizes stable and vary only what's drawn.
  // Quality tier scaling: high=100%, medium=65%, low=25% (was 35%)
  // Mobile gets extra reduction for stable 60fps
  const qualityScale = quality === "high" ? 1.0 : quality === "medium" ? 0.6 : 0.2;
  const mobileMultiplier = isMobile ? 0.4 : 1.0; // Aggressive mobile reduction
  
  const coronasMax = isMobile ? 200 : 800; // Reduced from 400
  const coronasVisible = deferredReady
    ? Math.floor((isMobile ? 120 : 700) * qualityScale * mobileMultiplier)
    : Math.floor((isMobile ? 30 : 120) * qualityScale);
  
  const starsLow = isMobile ? 60 : 200; // Reduced from 120
  const starsHigh = isMobile ? 120 : 500; // Reduced from 280
  const starsCount = deferredReady 
    ? Math.floor(starsHigh * qualityScale) 
    : Math.floor(starsLow * qualityScale);
  const starsKey = deferredReady ? `stars-hi-${quality}` : `stars-lo-${quality}`;
  
  // Disable snow completely on mobile
  const snowMax = isMobile ? 0 : 200;
  const snowVisible = isMobile ? 0 : (deferredReady ? Math.floor(200 * qualityScale) : 0);
  
  // Minimal twinkle on mobile
  const twinkleMax = isMobile ? 15 : 80; // Reduced from 30
  const twinkleVisible = deferredReady ? Math.floor(twinkleMax * qualityScale) : 0;
  const twinkleKey = isMobile ? `twinkle-m-${quality}` : `twinkle-d-${quality}`;

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

    if (ambientRef.current) {
      // Day: brighter + clean; Night: keep mood.
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.88, 0.38, b);
      ambientRef.current.color.lerpColors(palette.ambientDay, palette.ambientNight, b);
    }
    if (dirRef.current) {
      // Key light (sun/moon)
      dirRef.current.intensity = THREE.MathUtils.lerp(2.0, 0.75, b);
      dirRef.current.color.lerpColors(palette.dirDay, palette.dirNight, b);
    }
    if (fillDirRef.current) {
      fillDirRef.current.intensity = THREE.MathUtils.lerp(1.20, 0.32, b);
    }
    if (rimDirRef.current) {
      rimDirRef.current.intensity = THREE.MathUtils.lerp(0.40, 0.22, b);
    }
    if (groundMat.current) groundMat.current.color.lerpColors(palette.groundDay, palette.groundNight, b);
    if (roadMat.current) roadMat.current.color.lerpColors(palette.roadDay, palette.roadNight, b);
    if (hillMat.current) hillMat.current.color.lerpColors(palette.hillDay, palette.hillNight, b);
    if (coronasMat.current) {
      coronasMat.current.opacity = Math.min(1.2 * b, 1);
    }
    if (fogRef.current) {
      fogRef.current.color.lerpColors(palette.fogDay, palette.fogNight, b);
      // Slightly farther fog in day for navigation clarity.
      fogRef.current.near = THREE.MathUtils.lerp(24, 15, b);
      fogRef.current.far = THREE.MathUtils.lerp(105, 65, b);
    }
    tmpBgColor.copy(palette.backgroundDay).lerp(palette.backgroundNight, b);
    gl.setClearColor(tmpBgColor);

    // Small exposure shaping: day slightly brighter, night slightly darker.
    gl.toneMappingExposure = THREE.MathUtils.lerp(1.12, 1.22, b);

    // Cinematic night follow spot (dark world + bright pool around cyclist).
    if (isNight && followSpotRef.current && cyclistRef && cyclistRef.current) {
      const c = cyclistRef.current.position;
      tmpForward.set(0, 0, 1).applyQuaternion(cyclistRef.current.quaternion).setY(0).normalize();
      tmpTarget.copy(c).add(tmpForward.multiplyScalar(1.4));
      followTarget.position.copy(tmpTarget);

      const height = isMobile ? 7.0 : 8.5;
      followSpotRef.current.position.set(c.x, height, c.z);
      followSpotRef.current.intensity = 48;
    }

    if (cyclistRef.current) {
      const scrollValue = scrollProgressRef.current;
      const fallbackAngle = state.clock.elapsedTime * 0.10;
      const targetAngle = scrollValue > 0.001 ? scrollValue * Math.PI * 2 : fallbackAngle;
      cyclistAngleRef.current = THREE.MathUtils.lerp(cyclistAngleRef.current, targetAngle, 1 - Math.exp(-delta * 6));
      const angle = cyclistAngleRef.current;
      const radius = 11.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // turn-rate based lean (shortest angle diff)
      const prev = cyclistPrevAngleRef.current;
      let d = angle - prev;
      d = ((d + Math.PI) % (Math.PI * 2)) - Math.PI;
      const turnVel = d / Math.max(0.0001, delta);
      cyclistTurnVelRef.current = THREE.MathUtils.lerp(cyclistTurnVelRef.current, turnVel, 1 - Math.exp(-delta * 10));
      cyclistPrevAngleRef.current = angle;

      const bob = 0.042 * Math.sin(state.clock.elapsedTime * 9.5);
      cyclistRef.current.position.set(x, 0.22 + bob, z);
      cyclistRef.current.rotation.y = -angle + Math.PI / 2;
      cyclistRef.current.rotation.z = THREE.MathUtils.clamp(-cyclistTurnVelRef.current * 0.02, -0.28, 0.28);
    }

    proximityAccumulator.current += delta;
    if (proximityAccumulator.current > 0.3 && cyclistRef.current && !userPinned.current && !isTransitioning) {
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

      <ambientLight ref={ambientRef} intensity={isNight ? 0.55 : 0.92} color={isNight ? "#6d4bc2" : "#ffffff"} />
      <hemisphereLight args={[isNight ? "#6b7fd8" : "#dbeafe", isNight ? "#2a2f48" : "#ffffff", isNight ? 0.75 : 0.22]} />
      <directionalLight
        ref={dirRef}
        position={[10, 20, 10]}
        intensity={isNight ? 0.55 : 2.05}
        // Shadows are expensive; enable only for day, desktop, and high/medium quality
        castShadow={!isNight && !isMobile && quality === "high"}
        // Quality-based shadow map resolution: high=512, medium=384, low=256
        shadow-mapSize={[
          quality === "high" ? 512 : quality === "medium" ? 384 : 256,
          quality === "high" ? 512 : quality === "medium" ? 384 : 256
        ]}
        shadow-bias={-0.0001}
        shadow-normalBias={0.03}
        shadow-radius={3}
      >
        <orthographicCamera attach="shadow-camera" args={[-20, 20, 20, -20]} />
      </directionalLight>

      {/* Fill + rim for form/readability (no shadows) */}
      <directionalLight ref={fillDirRef} position={[-18, 10, 8]} intensity={isNight ? 0.12 : 1.05} color={isNight ? "#7dd3fc" : "#ffffff"} />
      <directionalLight ref={rimDirRef} position={[-8, 14, -18]} intensity={isNight ? 0.08 : 0.35} color={isNight ? "#a5b4fc" : "#dbeafe"} />

      <fog ref={fogRef} attach="fog" args={[palette.fogDay, 22, 110]} />
      <Skybox isNight={isNight} />
      {isNight && <Stars key={starsKey} radius={140} depth={60} count={starsCount} factor={6} saturation={0.1} fade speed={0.8} />}
      {isNight && <Particles key={twinkleKey} count={twinkleMax} visibleCount={twinkleVisible} isNight />}
      {/* Environment (PMREM) can be heavy on iGPU; enable only for high quality on desktop. */}
      {deferredReady && isNight && quality === "high" && !isMobile && <Environment preset="night" background blur={0.6} />}

      {/* Follow spotlight target (night) - only on high quality desktop */}
      {isNight && quality === "high" && !isMobile && (
        <>
          <primitive object={followTarget} />
          <spotLight
            ref={followSpotRef}
            target={followTarget}
            angle={0.62}
            penumbra={0.85}
            distance={18}
            decay={1.4}
            color="#dbeafe"
            // Keep this light shadowless: it's a moving shadow map otherwise (expensive).
            castShadow={false}
            intensity={16}
          />
        </>
      )}

      {/* Accent point lights - DESKTOP ONLY for FPS on mobile */}
      {isNight && !isMobile && (
        <group>
          {/* Core accent lights - desktop only */}
          <pointLight position={[8, 4, -6]} intensity={1.2} distance={12} color="#ff66c4" decay={1.6} />
          <pointLight position={[-10, 5, 6]} intensity={1.0} distance={12} color="#7dd3fc" decay={1.6} />
          {/* Additional accents for high quality only */}
          {quality === "high" && (
            <>
              <pointLight position={[0, 3, 12]} intensity={0.8} distance={10} color="#c084fc" decay={1.8} />
              <pointLight position={[-8, 3, -10]} intensity={0.7} distance={10} color="#f472b6" decay={1.8} />
            </>
          )}
        </group>
      )}
      {/* Mobile: single overhead light for mood without FPS hit */}
      {isNight && isMobile && (
        <pointLight position={[0, 8, 0]} intensity={0.5} distance={30} color="#a78bfa" decay={1.2} />
      )}

      {/* Snow FPS scales with quality tier */}
      {isNight && <SnowParticles count={snowMax} visibleCount={snowVisible} fps={quality === "high" ? 22 : quality === "medium" ? 16 : 12} />}
      {!isNight && <Clouds count={3} isNight={false} />}
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
