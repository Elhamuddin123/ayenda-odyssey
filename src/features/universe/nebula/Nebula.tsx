"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { NebulaLayer } from "./NebulaLayer";
import { NEBULA_LAYER_DEFINITIONS, NEBULA_PLANE_SIZE } from "./nebulaConstants";

export function Nebula() {
  const geometry = useMemo(
    () => new THREE.PlaneGeometry(NEBULA_PLANE_SIZE, NEBULA_PLANE_SIZE, 1, 1),
    [],
  );

  return (
    <group>
      {NEBULA_LAYER_DEFINITIONS.map((layer) => (
        <NebulaLayer key={layer.key} layer={layer} geometry={geometry} />
      ))}
    </group>
  );
}
