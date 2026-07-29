"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  STAR_COUNT,
  STAR_FIELD_RADIUS,
  STAR_FIELD_DEPTH,
  STAR_MIN_SIZE,
  STAR_MAX_SIZE,
  STAR_BASE_BRIGHTNESS,
  STAR_BRIGHTNESS_VARIANCE,
} from "./universeConstants";

const vertexShader = `
attribute float scale;
attribute float brightness;
varying float vBrightness;

void main() {
  vBrightness = brightness;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float z = max(-mvPosition.z, 25.0);
  gl_PointSize = scale * (120.0 / z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying float vBrightness;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.45, 0.0, dist);
  vec3 color = vec3(vBrightness);
  gl_FragColor = vec4(color, alpha);
}
`;

export function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const [geometry, material] = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(STAR_COUNT * 3);
    const scales = new Float32Array(STAR_COUNT);
    const brightness = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i += 1) {
      const radius = 60 + STAR_FIELD_RADIUS * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      scales[i] = STAR_MIN_SIZE + Math.random() * (STAR_MAX_SIZE - STAR_MIN_SIZE);
      brightness[i] = STAR_BASE_BRIGHTNESS + (Math.random() - 0.5) * STAR_BRIGHTNESS_VARIANCE;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute("brightness", new THREE.BufferAttribute(brightness, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
    });

    return [geometry, material] as const;
  }, []);

  useFrame((_, delta) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.004;
      starsRef.current.rotation.x += delta * 0.0018;
    }
  });

  return <points ref={starsRef} geometry={geometry} material={material} />;
}
