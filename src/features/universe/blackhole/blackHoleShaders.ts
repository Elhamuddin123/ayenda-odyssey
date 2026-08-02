export const accretionDiskVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const accretionDiskFragmentShader = `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uOpacity;

void main() {
  vec2 uv = vUv - 0.5;
  float radius = length(uv);
  float edge = smoothstep(0.5, 0.48, radius) * (1.0 - smoothstep(0.34, 0.36, radius));
  float gradient = 0.82 + 0.18 * (1.0 - radius);
  float alpha = edge * uOpacity * gradient;
  if (alpha < 0.008) discard;
  gl_FragColor = vec4(uColor * gradient, alpha);
}
`;
