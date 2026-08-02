"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";
import { createDustGeometry, createDustMaterial } from "./dustGenerator";
import type { DustLayerDefinition } from "./dustTypes";

interface DustLayerProps {
  readonly layer: DustLayerDefinition;
}

export function DustLayer({ layer }: DustLayerProps) {
  const pointsRef = useRef<Points>(null);

  const [geometry, material] = useMemo(() => {
    const geometry = createDustGeometry(layer);
    const material = createDustMaterial(layer);
    return [geometry, material] as const;
  }, [layer]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * layer.speed;
      pointsRef.current.rotation.x += delta * layer.speed * 0.06;
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
