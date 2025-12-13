/**
 * Performance utilities for Three.js / React Three Fiber optimization.
 * 
 * This module provides:
 * - Shared geometry cache (reduces draw calls via geometry reuse)
 * - Throttled animation utilities (reduces CPU overhead)
 * - Quality tier definitions for adaptive rendering
 * - Static mesh optimization helpers
 */

import * as THREE from "three";

// =============================================================================
// QUALITY TIERS
// =============================================================================

export type QualityTier = "high" | "medium" | "low";

export interface QualitySettings {
  // Particles & effects
  particleMultiplier: number;
  starCount: number;
  snowCount: number;
  coronaCount: number;
  
  // Lighting
  maxPointLights: number;
  shadowMapSize: number;
  enableShadows: boolean;
  enableEnvironment: boolean;
  
  // Post-processing
  enableBloom: boolean;
  bloomIntensity: number;
  
  // Rendering
  antialias: boolean;
  targetFps: number;
  idleFps: number;
}

const QUALITY_PRESETS: Record<QualityTier, QualitySettings> = {
  high: {
    particleMultiplier: 1.0,
    starCount: 900,
    snowCount: 420,
    coronaCount: 1100,
    maxPointLights: 8,
    shadowMapSize: 512,
    enableShadows: true,
    enableEnvironment: true,
    enableBloom: true,
    bloomIntensity: 0.35,
    antialias: true,
    targetFps: 60,
    idleFps: 15,
  },
  medium: {
    particleMultiplier: 0.65,
    starCount: 600,
    snowCount: 200,
    coronaCount: 600,
    maxPointLights: 4,
    shadowMapSize: 384,
    enableShadows: true,
    enableEnvironment: false,
    enableBloom: true,
    bloomIntensity: 0.25,
    antialias: true,
    targetFps: 45,
    idleFps: 12,
  },
  low: {
    particleMultiplier: 0.35,
    starCount: 320,
    snowCount: 0,
    coronaCount: 260,
    maxPointLights: 2,
    shadowMapSize: 256,
    enableShadows: false,
    enableEnvironment: false,
    enableBloom: false,
    bloomIntensity: 0,
    antialias: false,
    targetFps: 30,
    idleFps: 10,
  },
};

export function getQualitySettings(tier: QualityTier, isMobile: boolean): QualitySettings {
  const base = QUALITY_PRESETS[tier];
  if (isMobile) {
    return {
      ...base,
      particleMultiplier: base.particleMultiplier * 0.5,
      starCount: Math.floor(base.starCount * 0.5),
      snowCount: 0, // No snow on mobile
      coronaCount: Math.floor(base.coronaCount * 0.5),
      maxPointLights: Math.max(1, Math.floor(base.maxPointLights * 0.5)),
      shadowMapSize: Math.floor(base.shadowMapSize * 0.75),
      enableShadows: false,
      enableEnvironment: false,
      antialias: false,
    };
  }
  return base;
}

// =============================================================================
// SHARED GEOMETRY CACHE
// Reusing geometries reduces GPU memory and draw call overhead.
// =============================================================================

const geometryCache = new Map<string, THREE.BufferGeometry>();

export function getSharedGeometry(
  key: string,
  factory: () => THREE.BufferGeometry
): THREE.BufferGeometry {
  if (!geometryCache.has(key)) {
    const geom = factory();
    geometryCache.set(key, geom);
  }
  return geometryCache.get(key)!;
}

// Pre-built commonly used geometries
export const SharedGeometries = {
  // Tree parts
  treeTrunk: () => getSharedGeometry("tree-trunk", () => new THREE.CylinderGeometry(0.2, 0.4, 1, 6)),
  treeCone1: () => getSharedGeometry("tree-cone-1", () => new THREE.ConeGeometry(1.2, 2, 6)),
  treeCone2: () => getSharedGeometry("tree-cone-2", () => new THREE.ConeGeometry(1.0, 1.8, 6)),
  treeCone3: () => getSharedGeometry("tree-cone-3", () => new THREE.ConeGeometry(0.8, 1.5, 6)),

  // Street props
  lampPole: () => getSharedGeometry("lamp-pole", () => new THREE.CylinderGeometry(0.06, 0.08, 3.1, 8)),
  lampBase: () => getSharedGeometry("lamp-base", () => new THREE.CylinderGeometry(0.18, 0.22, 0.24, 10)),
  lampHead: () => getSharedGeometry("lamp-head", () => new THREE.SphereGeometry(0.13, 12, 12)),
  lampArm: () => getSharedGeometry("lamp-arm", () => new THREE.BoxGeometry(0.28, 0.16, 0.38)),

  // Building parts
  unitCube: () => getSharedGeometry("unit-cube", () => new THREE.BoxGeometry(1, 1, 1)),
  windowPane: () => getSharedGeometry("window-pane", () => new THREE.PlaneGeometry(1, 1)),

  // Stops / beacons
  stopRing: () => getSharedGeometry("stop-ring", () => new THREE.RingGeometry(1.0, 1.6, 48)),
  stopInnerRing: () => getSharedGeometry("stop-inner-ring", () => new THREE.RingGeometry(0.76, 0.92, 48)),
  stopHalo: () => getSharedGeometry("stop-halo", () => new THREE.RingGeometry(1.65, 2.25, 48)),
  stopPlinth: () => getSharedGeometry("stop-plinth", () => new THREE.CylinderGeometry(0.62, 0.72, 0.24, 18)),
  stopPlinthTop: () => getSharedGeometry("stop-plinth-top", () => new THREE.CylinderGeometry(0.42, 0.5, 0.12, 18)),

  // Particles
  snowflake: () => getSharedGeometry("snowflake", () => new THREE.DodecahedronGeometry(0.05, 0)),
  cloudSphere: () => getSharedGeometry("cloud-sphere", () => new THREE.SphereGeometry(0.8, 16, 16)),
};

// =============================================================================
// ANIMATION THROTTLING
// Reduces CPU overhead by skipping frames for non-critical animations.
// =============================================================================

export class ThrottledUpdater {
  private accumulator = 0;
  private interval: number;

  constructor(fps: number) {
    this.interval = 1 / Math.max(1, fps);
  }

  setFps(fps: number) {
    this.interval = 1 / Math.max(1, fps);
  }

  /**
   * Returns true if enough time has passed to run an update.
   * Call this in useFrame; only run heavy logic when it returns true.
   */
  shouldUpdate(delta: number): boolean {
    this.accumulator += delta;
    if (this.accumulator >= this.interval) {
      this.accumulator = 0;
      return true;
    }
    return false;
  }

  /** Returns accumulated time since last update (useful for step-based animation). */
  getStep(): number {
    return this.accumulator;
  }
}

// =============================================================================
// STATIC MESH OPTIMIZATION
// Freezes matrices on static objects to skip per-frame updates.
// =============================================================================

export function freezeMesh(mesh: THREE.Object3D) {
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();
  mesh.updateMatrixWorld(true);
}

export function freezeGroup(group: THREE.Group) {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
      freezeMesh(child);
    }
  });
}

// =============================================================================
// LIGHT BUDGET MANAGER
// Ensures we don't exceed the light budget for the current quality tier.
// =============================================================================

export class LightBudget {
  private used = 0;
  private max: number;

  constructor(maxLights: number) {
    this.max = maxLights;
  }

  reset() {
    this.used = 0;
  }

  setMax(max: number) {
    this.max = max;
  }

  /** Returns true if a light can be added; increments counter if so. */
  canAddLight(): boolean {
    if (this.used < this.max) {
      this.used++;
      return true;
    }
    return false;
  }

  /** Check without consuming budget. */
  hasCapacity(): boolean {
    return this.used < this.max;
  }

  getUsed(): number {
    return this.used;
  }
}

// =============================================================================
// DISPOSE HELPERS
// Proper cleanup prevents GPU memory leaks.
// =============================================================================

export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach((m) => m.dispose());
      } else if (child.material) {
        child.material.dispose();
      }
    }
  });
}
