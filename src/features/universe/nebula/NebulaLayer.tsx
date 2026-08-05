"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Mesh } from "three";
import * as THREE from "three";
import type { NebulaLayerDefinition } from "./nebulaConstants";
import { createNebulaMaterial } from "./nebulaUtils";

interface NebulaLayerProps {
  readonly layer: NebulaLayerDefinition;
  readonly geometry: THREE.PlaneGeometry;
  readonly opacityScale?: number;
}

export function NebulaLayer({ layer, geometry, opacityScale = 1 }: NebulaLayerProps) {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const material = useMemo(() => createNebulaMaterial(layer), [layer]);

  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = layer.opacity * opacityScale;
    }
  }, [layer.opacity, opacityScale]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * layer.speed;
      meshRef.current.rotation.x += delta * layer.speed * 0.12;
      meshRef.current.position.y += Math.sin(layer.speed * delta) * 0.01;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      position={layer.position}
      rotation={layer.rotation}
      scale={layer.scale}
      frustumCulled={false}
      renderOrder={0}
      material={material}
    />
  );
}
