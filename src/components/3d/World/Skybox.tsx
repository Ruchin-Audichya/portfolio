import React, { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SkyboxProps {
  isNight: boolean;
}

export function Skybox({ isNight }: SkyboxProps) {
  if (isNight) return null;
  return <DaySkybox />;
}

function DaySkybox() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        transparent: false,
        uniforms: {
          time: { value: 0 },
          topColor: { value: new THREE.Color(0.24, 0.65, 1.0) },
          horizonColor: { value: new THREE.Color(0.78, 0.9, 1.0) },
          cloudColor: { value: new THREE.Color(1.0, 0.98, 0.94) },
        },
        vertexShader: `
          varying vec3 vWorldDir;
          void main() {
            vWorldDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vWorldDir;
          uniform float time;
          uniform vec3 topColor;
          uniform vec3 horizonColor;
          uniform vec3 cloudColor;

          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            float n = mix(
              mix(hash(i.xy), hash(i.xy + vec2(1.0, 0.0)), f.x),
              mix(hash(i.xy + vec2(0.0, 1.0)), hash(i.xy + vec2(1.0, 1.0)), f.x),
              f.y
            );
            float n2 = mix(
              mix(hash(i.zy), hash(i.zy + vec2(1.0, 0.0)), f.z),
              mix(hash(i.zy + vec2(0.0, 1.0)), hash(i.zy + vec2(1.0, 1.0)), f.z),
              f.y
            );
            return mix(n, n2, 0.5);
          }

          float fbm(vec3 p) {
            float v = 0.0;
            float a = 0.55;
            for (int i = 0; i < 4; i++) {
              v += a * noise(p);
              p *= 2.1;
              a *= 0.55;
            }
            return v;
          }

          void main() {
            float h = clamp(vWorldDir.y * 0.6 + 0.4, 0.0, 1.0);
            vec3 base = mix(horizonColor, topColor, smoothstep(0.0, 1.0, h));

            vec3 p = normalize(vWorldDir) * 3.5;
            p.xy += time * vec2(0.02, 0.015);
            float clouds = fbm(p);
            float mask = smoothstep(0.45, 0.7, clouds);
            float softness = smoothstep(0.2, 0.7, clouds);
            vec3 cloudMix = mix(base, cloudColor, mask * 0.65);
            vec3 color = mix(base, cloudMix, softness);

            gl_FragColor = vec4(color, 1.0);
          }
        `,
      }),
    []
  );

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime;
  });

  useEffect(() => () => material.dispose(), [material]);

  return (
    <mesh scale={320} frustumCulled={false} material={material}>
      <icosahedronGeometry args={[1, 5]} />
    </mesh>
  );
}
