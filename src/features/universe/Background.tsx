"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { BACKGROUND_SEGMENTS, BACKGROUND_SPHERE_RADIUS } from "./universeConstants";

const vertex = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Very subtle gradient + low-frequency noise to suggest deep space without introducing patterns
const fragment = `
varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);

  // deep black center, subtle cold-blue toward top-left, tiny noise
  vec3 center = vec3(0.01, 0.02, 0.03);
  vec3 cold = vec3(0.03, 0.06, 0.12);

  float t = smoothstep(0.0, 1.0, r * 1.05);
  float n = noise(vUv * 0.8) * 0.08;
  vec3 color = mix(center, cold, t) + n * 0.02;

  // preserve deep black dominance
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

function createBackgroundGeometry() {
  return new THREE.SphereGeometry(
    BACKGROUND_SPHERE_RADIUS,
    BACKGROUND_SEGMENTS,
    BACKGROUND_SEGMENTS,
  );
}

export function Background() {
  const geometry = useMemo(() => createBackgroundGeometry(), []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        side: THREE.BackSide,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );

  return <mesh geometry={geometry} scale={1} renderOrder={-1} material={material} />;
}
