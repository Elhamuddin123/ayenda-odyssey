import * as THREE from "three";
import type { NebulaLayerDefinition } from "./nebulaConstants";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Softer FBM + small domain warp to avoid obvious repetition and create large-scale forms
const fragmentShader = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uOpacity;
uniform vec2 uOffset;

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

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.6;
  float frequency = 0.6;

  for (int i = 0; i < 5; i += 1) {
    value += amplitude * noise(p * frequency);
    frequency *= 1.9;
    amplitude *= 0.48;
  }

  return value;
}

void main() {
  // bias uv so the largest structures span the visible frame
  vec2 uv = (vUv - 0.5) * 2.0;

  // small domain warp to reduce visible tiling
  vec2 warp = vec2(fbm(uv * 0.35 + uOffset), fbm(uv * 0.38 - uOffset));
  vec2 p = uv * 0.9 + warp * 0.35;

  float pattern = fbm(p * 0.85 + uOffset * 0.6);

  // large soft edge mask to preserve negative space
  float edge = smoothstep(0.95, 0.25, length(uv));

  // shape mask and soft transitions
  float mask = smoothstep(0.20, 0.65, pattern);
  float glow = pow(mask * edge, 1.4);

  vec3 color = uColor * glow;
  float alpha = glow * uOpacity;

  if (alpha < 0.004) {
    discard;
  }

  gl_FragColor = vec4(color, alpha);
}
`;

export function createNebulaMaterial(layer: NebulaLayerDefinition) {
  // Use a larger range for offsets to decorrelate layers and reduce repetition
  const offset = new THREE.Vector2(
    Math.random() * 18.0 - 9.0,
    Math.random() * 18.0 - 9.0,
  );
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uColor: {
        value: new THREE.Color(layer.color[0], layer.color[1], layer.color[2]),
      },
      uOpacity: { value: layer.opacity },
      uOffset: { value: offset },
    },
  });
}
