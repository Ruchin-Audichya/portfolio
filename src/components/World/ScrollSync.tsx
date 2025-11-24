import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export function ScrollSync() {
    const { camera } = useThree();
    const targetPosition = useRef(new THREE.Vector3(0, 5, 14));
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const height = document.body.scrollHeight - window.innerHeight;
            const progress = Math.min(scrollY / height, 1);

            // Define camera path based on scroll progress
            // Start: [0, 5, 14] -> looking at [0, 0, 0]
            // End: [0, 10, 20] -> looking at [0, -2, 0] (just an example)

            // Simple interpolation for now
            targetPosition.current.y = 5 + progress * 5;
            targetPosition.current.z = 14 + progress * 6;

            // Slight rotation around the island
            const angle = progress * Math.PI * 0.5;
            targetPosition.current.x = Math.sin(angle) * 10;
            targetPosition.current.z = Math.cos(angle) * 14 + 5;

        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useFrame((state, delta) => {
        // Smoothly interpolate camera position
        camera.position.lerp(targetPosition.current, delta * 2);

        // Make camera look at the center (or slightly offset)
        const currentLookAt = new THREE.Vector3(0, 0, 0);
        camera.lookAt(currentLookAt);
    });

    return null;
}
