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
uniform float uOpacity;

void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  float alpha = smoothstep(0.45, 0.0, dist);
  float twinkle = 1.0 + sin(uTime * 1.7 + vTwinkle * 12.0) * uTwinkleStrength;

  // Cool base color biased toward blue; brightest stars get a subtle warm tint
  vec3 cool = vec3(0.86, 0.92, 1.0);
  vec3 warm = vec3(1.0, 0.88, 0.6);
  float warmFactor = smoothstep(0.82, 1.0, vBrightness);
  vec3 color = mix(cool, warm, warmFactor) * vBrightness * twinkle;

  gl_FragColor = vec4(color, alpha * uOpacity);
  if (gl_FragColor.a < 0.006) discard;
}
`;

export function createStarLayerGeometry(definition: StarLayerDefinition) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(definition.count * 3);
  const scales = new Float32Array(definition.count);
  const brightness = new Float32Array(definition.count);
  const twinkle = new Float32Array(definition.count);

  // Generate a small number of cluster centers to produce natural-looking clusters
  const clusterCount = Math.max(2, Math.floor(definition.count / 600));
  const clusterCenters: Array<{ x: number; y: number; z: number; r: number }> = [];
  for (let c = 0; c < clusterCount; c += 1) {
    const r =
      definition.radiusMin +
      Math.random() * (definition.radiusMax - definition.radiusMin);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const cx = r * Math.sin(phi) * Math.cos(theta);
    const cy = r * Math.sin(phi) * Math.sin(theta);
    const cz = r * Math.cos(phi);
    clusterCenters.push({
      x: cx,
      y: cy,
      z: cz,
      r: Math.max(12.0, (definition.radiusMax - definition.radiusMin) * 0.12),
    });
  }

  for (let i = 0; i < definition.count; i += 1) {
    let px = 0;
    let py = 0;
    let pz = 0;

    // 65% of stars belong to clusters, others are spread to avoid obvious regularity
    if (Math.random() < 0.65 && clusterCenters.length > 0) {
      const c = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
      // sample around cluster center with a soft falloff
      const rr = Math.abs(Math.random() * 1.0) * c.r;
      const angle = Math.random() * Math.PI * 2;
      px = c.x + rr * Math.cos(angle) * 0.6;
      py = c.y + rr * Math.sin(angle) * 0.6;
      pz = c.z + (Math.random() - 0.5) * 6.0;
    } else {
      const radius =
        definition.radiusMin +
        (definition.radiusMax - definition.radiusMin) * Math.pow(Math.random(), 0.9);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      px = radius * Math.sin(phi) * Math.cos(theta);
      py = radius * Math.sin(phi) * Math.sin(theta);
      pz = radius * Math.cos(phi);
    }

    // Bias a few 'hero' twinkle stars toward negative Z to subtly guide the eye
    if (definition.twinkle && Math.random() < 0.035) {
      pz = -Math.abs(pz) - (20.0 + Math.random() * 40.0);
    }

    // Small non-uniform jitter to avoid visible regularity/tiling
    const jitterScale = 0.015 * Math.max(1.0, Math.abs(px) * 0.002 + 1.0);
    px += (Math.random() - 0.5) * jitterScale;
    py += (Math.random() - 0.5) * jitterScale;
    pz += (Math.random() - 0.5) * jitterScale;

    positions[i * 3 + 0] = px;
    positions[i * 3 + 1] = py;
    positions[i * 3 + 2] = pz;

    scales[i] =
      definition.scaleMin + Math.random() * (definition.scaleMax - definition.scaleMin);
    brightness[i] =
      definition.brightnessMin +
      Math.random() * (definition.brightnessMax - definition.brightnessMin);
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
      // Keep hero twinkle subtle; layer-level twinkle still controls overall behavior
      uTwinkleStrength: { value: definition.twinkle ? 0.028 : 0.0 },
      uOpacity: { value: 1.0 },
    },
  });
}
