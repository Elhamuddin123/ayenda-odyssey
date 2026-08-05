"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  accretionDiskVertexShader,
  accretionDiskFragmentShader,
} from "./blackHoleShaders";
import {
  DISK_INNER_RADIUS,
  DISK_OUTER_RADIUS,
  DISK_ROTATION_SPEED,
  DISK_SEGMENTS,
} from "./blackHoleConstants";

interface AccretionDiskProps {
  readonly opacity?: number;
  readonly glow?: number;
}

export function AccretionDisk({ opacity = 1, glow = 1 }: AccretionDiskProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [geometry, material] = useMemo(() => {
    const geometry = new THREE.RingGeometry(
      DISK_INNER_RADIUS,
      DISK_OUTER_RADIUS,
      DISK_SEGMENTS,
      1,
    );
    const material = new THREE.ShaderMaterial({
      vertexShader: accretionDiskVertexShader,
      fragmentShader: accretionDiskFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uInnerColor: { value: new THREE.Color(1.0, 0.78, 0.18) },
        uOuterColor: { value: new THREE.Color(0.93, 0.42, 0.08) },
        uOpacity: { value: 0 },
        uGlow: { value: 0 },
      },
      side: THREE.DoubleSide,
    });
    return [geometry, material] as const;
  }, []);

  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = 0.14 * opacity;
      materialRef.current.uniforms.uGlow.value = glow;
    }
  }, [opacity, glow]);

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
