"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { accretionDiskVertexShader, accretionDiskFragmentShader } from "./blackHoleShaders";
import {
  DISK_INNER_RADIUS,
  DISK_OUTER_RADIUS,
  DISK_ROTATION_SPEED,
  DISK_SEGMENTS,
} from "./blackHoleConstants";

export function AccretionDisk() {
  const meshRef = useRef<THREE.Mesh>(null);

  const [geometry, material] = useMemo(() => {
    const geometry = new THREE.RingGeometry(DISK_INNER_RADIUS, DISK_OUTER_RADIUS, DISK_SEGMENTS, 1);
    const material = new THREE.ShaderMaterial({
      vertexShader: accretionDiskVertexShader,
      fragmentShader: accretionDiskFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uColor: { value: new THREE.Color(0.95, 0.55, 0.16) },
        uOpacity: { value: 0.16 },
      },
      side: THREE.DoubleSide,
    });
    return [geometry, material] as const;
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * DISK_ROTATION_SPEED;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      material={material}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0, 0]}
      frustumCulled={false}
    />
  );
}
