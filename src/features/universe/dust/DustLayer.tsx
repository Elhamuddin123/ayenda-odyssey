"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Points } from "three";
import { createDustGeometry, createDustMaterial } from "./dustGenerator";
import type { DustLayerDefinition } from "./dustTypes";

interface DustLayerProps {
  readonly layer: DustLayerDefinition;
  readonly opacityScale?: number;
  readonly speedScale?: number;
}

export function DustLayer({ layer, opacityScale = 1, speedScale = 1 }: DustLayerProps) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [geometry, material] = useMemo(() => {
    const geometry = createDustGeometry(layer);
    const material = createDustMaterial(layer);
    return [geometry, material] as const;
  }, [layer]);

  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uOpacity.value = layer.opacity * opacityScale;
    }
  }, [layer.opacity, opacityScale]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * layer.speed * speedScale;
      pointsRef.current.rotation.x += delta * layer.speed * 0.06 * speedScale;
    }
  });

  return (
    <points
      ref={pointsRef}
      geometry={geometry}
      material={material}
      position={layer.position}
      rotation={layer.rotation}
      frustumCulled={false}
    />
  );
}
