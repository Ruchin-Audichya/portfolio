"use client";

import { Canvas } from "@react-three/fiber";
import { lazy, Suspense } from "react";
import { Html, Loader } from "@react-three/drei";
// Lazy load World to reduce initial bundle impact
const World = lazy(() => import("./World").then(module => ({ default: module.World })));
import type { ProjectNodeId } from "./ProjectNode";

interface SceneProps {
  onNodeClick?: (id: ProjectNodeId) => void;
}

function LoaderFallback() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-purple-300">Loading World...</p>
      </div>
    </Html>
  );
}

import { usePerf, getAdaptiveDpr, useFPSMonitor } from "@/lib/three/perf";

function FPSLogger() {
  useFPSMonitor();
  return null;
}

export default function Scene({ onNodeClick }: SceneProps) {
  const dpr = usePerf((state) => state.dpr);
  const setDpr = usePerf((state) => state.setDpr);

  return (
    <div className="absolute inset-0 z-0 h-screen w-full overflow-hidden" id="world">
      <Canvas
        shadows="soft"
        camera={{ position: [0, 5, 14], fov: 45 }}
        dpr={dpr}
        gl={{
          antialias: false, // FXAA or SMAA is better for performance usually, but let's stick to false for now and maybe add EffectComposer later
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          toneMappingExposure: 1.1
        }}
        onCreated={({ gl, viewport }) => {
          const initialDpr = getAdaptiveDpr(window.devicePixelRatio);
          setDpr(initialDpr);
          gl.setPixelRatio(initialDpr);
        }}
      >
        <FPSLogger />
        <Suspense fallback={<LoaderFallback />}>
          <World onNodeClick={onNodeClick} />
        </Suspense>
      </Canvas>

      {/* UI Overlay for Day/Night hint */}
      <div className="pointer-events-none absolute bottom-8 left-8 z-10 hidden md:block">
        <p className="text-xs font-medium text-white/50">
          Press <span className="rounded bg-white/10 px-1 py-0.5 text-white">N</span> to toggle theme
        </p>
      </div>
    </div>
  );
}
