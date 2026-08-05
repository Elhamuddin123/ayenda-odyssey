export const accretionDiskVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const accretionDiskFragmentShader = `
varying vec2 vUv;
uniform vec3 uInnerColor;
uniform vec3 uOuterColor;
uniform float uOpacity;
uniform float uGlow;

void main() {
  vec2 uv = vUv - 0.5;
  float radius = length(uv);
  float edge = smoothstep(0.5, 0.48, radius) * (1.0 - smoothstep(0.34, 0.36, radius));
  float gradient = 0.72 + 0.28 * (1.0 - radius);
  vec3 color = mix(uOuterColor, uInnerColor, gradient);
  float alpha = edge * uOpacity * gradient * (1.0 + uGlow * 0.5);
  if (alpha < 0.008) discard;
  gl_FragColor = vec4(color * gradient * (1.0 + uGlow), alpha);
}
`;
