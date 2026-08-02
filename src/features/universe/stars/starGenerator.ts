"use client";

import * as THREE from "three";
import type { StarLayerDefinition } from "./starTypes";

const vertexShader = `
attribute float scale;
attribute float brightness;
attribute float twinkle;
varying float vBrightness;
varying float vTwinkle;

void main() {
  vBrightness = brightness;
  vTwinkle = twinkle;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  float z = max(-mvPosition.z, 25.0);
  gl_PointSize = scale * (120.0 / z);
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying float vBrightness;
varying float vTwinkle;
uniform float uTime;
uniform float uTwinkleStrength;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.45, 0.0, dist);
  float twinkle = 1.0 + sin(uTime * 1.7 + vTwinkle * 12.0) * uTwinkleStrength;
  vec3 color = vec3(vBrightness * twinkle);
  gl_FragColor = vec4(color, alpha);
  if (gl_FragColor.a < 0.008) discard;
}
`;

export function createStarLayerGeometry(definition: StarLayerDefinition) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(definition.count * 3);
  const scales = new Float32Array(definition.count);
  const brightness = new Float32Array(definition.count);
  const twinkle = new Float32Array(definition.count);

  for (let i = 0; i < definition.count; i += 1) {
    const radius = definition.radiusMin + (definition.radiusMax - definition.radiusMin) * Math.pow(Math.random(), 0.75);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Bias hero (twinkle) stars slightly toward negative Z to guide the eye
    if (definition.twinkle) {
      positions[i * 3 + 2] = -Math.abs(positions[i * 3 + 2]) - (20.0 + Math.random() * 30.0);
    }

    // Small non-uniform jitter to avoid visible regularity/tiling
    const jitterScale = 0.02 * radius;
    positions[i * 3 + 0] += (Math.random() - 0.5) * jitterScale;
    positions[i * 3 + 1] += (Math.random() - 0.5) * jitterScale;
    positions[i * 3 + 2] += (Math.random() - 0.5) * jitterScale;

    scales[i] = definition.scaleMin + Math.random() * (definition.scaleMax - definition.scaleMin);
    brightness[i] = definition.brightnessMin + Math.random() * (definition.brightnessMax - definition.brightnessMin);
    twinkle[i] = Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute("brightness", new THREE.BufferAttribute(brightness, 1));
  geometry.setAttribute("twinkle", new THREE.BufferAttribute(twinkle, 1));

  return geometry;
}

export function createStarLayerMaterial(definition: StarLayerDefinition) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      // Make hero twinkle extremely subtle
      uTwinkleStrength: { value: definition.twinkle ? 0.04 : 0.0 },
    },
  });
}
