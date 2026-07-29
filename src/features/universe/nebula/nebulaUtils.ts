import * as THREE from "three";
import type { NebulaLayerDefinition } from "./nebulaConstants";

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uOpacity;

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
  float amplitude = 0.55;
  float frequency = 1.0;

  for (int i = 0; i < 4; i += 1) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float pattern = fbm(uv * 1.25 + vec2(0.17, 0.24));
  float edge = smoothstep(0.6, 0.15, length(uv));
  float mask = smoothstep(0.18, 0.58, pattern);
  float glow = pow(mask * edge, 1.7);
  vec3 color = uColor * glow;
  float alpha = glow * uOpacity;

  if (alpha < 0.008) {
    discard;
  }

  gl_FragColor = vec4(color, alpha);
}
`;

export function createNebulaMaterial(layer: NebulaLayerDefinition) {
  return new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
    uniforms: {
      uColor: { value: new THREE.Color(layer.color[0], layer.color[1], layer.color[2]) },
      uOpacity: { value: layer.opacity },
    },
  });
}
