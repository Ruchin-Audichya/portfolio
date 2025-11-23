import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const StarShader = {
    vertexShader: `
    attribute float size;
    attribute float speed;
    attribute float offset;
    varying float vOpacity;
    uniform float time;
    
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // Twinkle logic: Sine wave based on time, speed, and random offset
      float twinkle = sin(time * speed + offset) * 0.5 + 0.5;
      vOpacity = 0.5 + 0.5 * twinkle; // Min opacity 0.5, max 1.0
      
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    fragmentShader: `
    varying float vOpacity;
    
    void main() {
      // Circular particle
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float ll = length(xy);
      if(ll > 0.5) discard;
      
      gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity);
    }
  `
};

interface ParticlesProps {
    count: number;
    isNight: boolean;
}

export function Particles({ count, isNight }: ParticlesProps) {
    const meshRef = useRef<THREE.Points>(null);

    // Generate random positions and attributes
    const { positions, sizes, speeds, offsets } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const speeds = new Float32Array(count);
        const offsets = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Random position in a large sphere (Skybox)
            const r = 60 + Math.random() * 60; // Distance from center (60 to 120)
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            sizes[i] = Math.random() * 2 + 1; // Base size
            speeds[i] = Math.random() * 2 + 1; // Twinkle speed
            offsets[i] = Math.random() * 100; // Random start time
        }

        return { positions, sizes, speeds, offsets };
    }, [count]);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 }
            },
            vertexShader: StarShader.vertexShader,
            fragmentShader: StarShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
    }, []);

    useFrame((state) => {
        if (meshRef.current && isNight) {
            const material = meshRef.current.material as THREE.ShaderMaterial;
            material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    if (!isNight) return null;

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-size"
                    count={count}
                    array={sizes}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-speed"
                    count={count}
                    array={speeds}
                    itemSize={1}
                />
                <bufferAttribute
                    attach="attributes-offset"
                    count={count}
                    array={offsets}
                    itemSize={1}
                />
            </bufferGeometry>
            <primitive object={shaderMaterial} attach="material" />
        </points>
    );
}
