"use client";

import { Html, useProgress } from "@react-three/drei";
import { useMemo } from "react";

export function LoadingProgress() {
  const { active, progress, item, loaded, total } = useProgress();
  const pct = useMemo(() => Math.min(100, Math.max(0, progress)), [progress]);

  if (!active) return null;

  return (
    <Html fullscreen style={{ pointerEvents: "none" }}>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm text-white">
        <div className="text-xs uppercase tracking-[0.2em] text-white/70 mb-3">Streaming world assets</div>
        <div className="w-64 h-2 rounded-full bg-white/10 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-amber-300"
            style={{ width: `${pct}%`, transition: "width 0.3s ease" }}
          />
        </div>
        <div className="mt-3 text-sm text-white/80 font-mono">
          {Math.round(pct)}% · {loaded}/{total} {total === 1 ? "asset" : "assets"}
        </div>
        {item && <div className="mt-1 text-[11px] text-white/60">{item}</div>}
      </div>
    </Html>
  );
}
