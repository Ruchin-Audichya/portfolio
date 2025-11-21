"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, Loader } from "@react-three/drei";
import { World } from "./World";
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

export default function Scene({ onNodeClick }: SceneProps) {
  return (
    <div className="absolute inset-0 z-0 h-screen w-full overflow-hidden" id="world">
      <Canvas
        shadows
        camera={{ position: [0, 5, 14], fov: 45 }}
        dpr={[1, 2]} // Optimization for high DPI screens
        gl={{ antialias: true, toneMappingExposure: 1.1 }}
      >
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
