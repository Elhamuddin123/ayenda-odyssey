"use client";

import * as THREE from "three";
import type { DustLayerDefinition } from "./dustTypes";

const vertexShader = `
attribute float size;
attribute float brightness;
varying float vBrightness;

void main() {
  vBrightness = brightness;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float z = max(-mvPosition.z, 20.0);
  gl_PointSize = size * (80.0 / z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying float vBrightness;
uniform vec3 uColor;
uniform float uOpacity;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.5, 0.0, dist) * uOpacity * vBrightness;
  if (alpha < 0.01) discard;
  gl_FragColor = vec4(uColor * vBrightness, alpha);
}
`;

export function createDustGeometry(definition: DustLayerDefinition) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(definition.count * 3);
  const sizes = new Float32Array(definition.count);
  const brightness = new Float32Array(definition.count);

  for (let i = 0; i < definition.count; i += 1) {
    const radius =
      definition.radiusMin +
      Math.pow(Math.random(), 0.8) * (definition.radiusMax - definition.radiusMin);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    sizes[i] =
      definition.sizeMin + Math.random() * (definition.sizeMax - definition.sizeMin);
    // Slightly reduce brightness variation for subtle dust
    brightness[i] = 0.7 + Math.random() * 0.12;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("brightness", new THREE.BufferAttribute(brightness, 1));

  return geometry;
}

export function createDustMaterial(definition: DustLayerDefinition) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uColor: {
        value: new THREE.Color(
          definition.color[0],
          definition.color[1],
          definition.color[2],
        ),
      },
      uOpacity: { value: definition.opacity },
    },
  });
}
