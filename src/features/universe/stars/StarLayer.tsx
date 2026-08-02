"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Points } from "three";
import type { StarLayerDefinition } from "./starTypes";
import { createStarLayerGeometry, createStarLayerMaterial } from "./starGenerator";

interface StarLayerProps {
  readonly layer: StarLayerDefinition;
}

export function StarLayer({ layer }: StarLayerProps) {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [geometry, material] = useMemo(() => {
    const geometry = createStarLayerGeometry(layer);
    const material = createStarLayerMaterial(layer);
    return [geometry, material] as const;
  }, [layer]);

  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * layer.speed;
      pointsRef.current.rotation.x += delta * layer.speed * 0.09;
      if (layer.twinkle) {
        const shaderMaterial = materialRef.current;
        if (shaderMaterial) {
          shaderMaterial.uniforms.uTime.value += delta;
        }
      }
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
