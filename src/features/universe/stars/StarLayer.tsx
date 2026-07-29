"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";
import type { StarLayerDefinition } from "./starTypes";
import { createStarLayerGeometry, createStarLayerMaterial } from "./starGenerator";

interface StarLayerProps {
  readonly layer: StarLayerDefinition;
}

export function StarLayer({ layer }: StarLayerProps) {
  const pointsRef = useRef<Points>(null);

  const [geometry, material] = useMemo(() => {
    const geometry = createStarLayerGeometry(layer);
    const material = createStarLayerMaterial(layer);
    return [geometry, material] as const;
  }, [layer]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * layer.speed;
      pointsRef.current.rotation.x += delta * layer.speed * 0.09;
      if (layer.twinkle) {
        const shaderMaterial = material;
        shaderMaterial.uniforms.uTime.value += delta;
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
