"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { EVENT_HORIZON_RADIUS } from "./blackHoleConstants";

interface EventHorizonProps {
  readonly opacity?: number;
}

export function EventHorizon({ opacity = 1 }: EventHorizonProps) {
  const materialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const geometry = useMemo(
    () => new THREE.SphereGeometry(EVENT_HORIZON_RADIUS, 64, 64),
    [],
  );

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: 0x000000,
        toneMapped: false,
        depthWrite: true,
        transparent: true,
        opacity: 0,
      }),
    [],
  );

  useEffect(() => {
    materialRef.current = material;
  }, [material]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.opacity = opacity;
      materialRef.current.visible = opacity > 0.001;
    }
  }, [opacity]);

  return <mesh geometry={geometry} material={material} />;
}
