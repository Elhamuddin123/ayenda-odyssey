"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { EVENT_HORIZON_RADIUS } from "./blackHoleConstants";

export function EventHorizon() {
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
      }),
    [],
  );

  return <mesh geometry={geometry} material={material} />;
}
