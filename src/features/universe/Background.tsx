"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { BACKGROUND_SEGMENTS, BACKGROUND_SPHERE_RADIUS } from "./universeConstants";

const BASE_COLOR = new THREE.Color(0x010305);
const COLOR_VARIANCE = 0.006;

function createBackgroundGeometry() {
  const sphere = new THREE.SphereGeometry(BACKGROUND_SPHERE_RADIUS, BACKGROUND_SEGMENTS, BACKGROUND_SEGMENTS);
  const count = sphere.attributes.position.count;
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const variation = (Math.random() - 0.5) * COLOR_VARIANCE;
    // Slightly bias darker toward the edges for cinematic depth
    const edgeBias = Math.pow(Math.random(), 1.6) * -0.004;
    const color = BASE_COLOR.clone().offsetHSL(0, 0, variation + edgeBias);
    colors[i * 3 + 0] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  sphere.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return sphere;
}

export function Background() {
  const geometry = useMemo(() => {
    return createBackgroundGeometry();
  }, []);

  return (
    <mesh geometry={geometry} scale={1} renderOrder={-1}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
