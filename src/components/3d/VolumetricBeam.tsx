import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BeamShader = {
    vertexShader: `
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vViewPosition;
    
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
    fragmentShader: `
    uniform vec3 color;
    uniform float opacity;
    uniform float noiseStrength;
    
    varying vec3 vNormal;
    varying vec2 vUv;
    varying vec3 vViewPosition;
    
    void main() {
      // Fresnel-like fade from center to edge
      float viewDot = dot(vNormal, normalize(vViewPosition));
      float fresnel = pow(1.0 - abs(viewDot), 2.0);
      
      // Top-down fade (beam intensity)
      float beam = smoothstep(0.0, 1.0, 1.0 - vUv.y);
      
      // Soft edges
      float edge = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);
      
      // Combine for volumetric look
      float alpha = opacity * beam * fresnel * edge;
      
      gl_FragColor = vec4(color, alpha);
    }
  `
};

interface VolumetricBeamProps {
    position: [number, number, number];
    color?: string;
    scale?: [number, number, number];
    opacity?: number;
}

export function VolumetricBeam({
    position,
    color = '#ffffff',
    scale = [1, 5, 1],
    opacity = 0.6
}: VolumetricBeamProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                opacity: { value: opacity },
                noiseStrength: { value: 0.1 }
            },
            vertexShader: BeamShader.vertexShader,
            fragmentShader: BeamShader.fragmentShader,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
    }, [color, opacity]);

    useFrame((state) => {
        if (meshRef.current) {
            // Look at camera for billboard effect (optional, but good for 2DFX feel)
            // meshRef.current.lookAt(state.camera.position);
            // Lock X/Z rotation if we want it to stay vertical
            // meshRef.current.rotation.x = 0;
            // meshRef.current.rotation.z = 0;
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            scale={scale}
            rotation={[Math.PI, 0, 0]} // Point down
        >
            {/* Open-ended cylinder for the beam */}
            <cylinderGeometry args={[0.1, 1.5, 1, 32, 1, true]} />
            <primitive object={shaderMaterial} attach="material" />
        </mesh>
    );
}
