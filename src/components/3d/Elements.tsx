import React from "react";

export function SceneElements({ isNight }: { isNight?: boolean }) {
  // Placeholder to satisfy legacy imports; real world assets are now in 3d/World/
  return <group name={isNight ? "scene-elements-night" : "scene-elements-day"} />;
}
