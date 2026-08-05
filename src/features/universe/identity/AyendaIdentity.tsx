"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface AyendaIdentityProps {
  readonly opacity?: number;
}

export function AyendaIdentity({ opacity = 1 }: AyendaIdentityProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const coreMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const [ringGeometry, ringMaterial, coreGeometry, coreMaterial] = useMemo(() => {
    const ringGeometry = new THREE.TorusGeometry(3.2, 0.04, 16, 128);
    const ringMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uOpacity;
        void main() {
          float angle = vUv.x * 6.28318;
          float pulse = 0.85 + 0.15 * sin(angle * 3.0);
          vec3 color = vec3(0.9, 0.6, 0.15) * pulse;
          float alpha = uOpacity * pulse;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      uniforms: {
        uOpacity: { value: 0 },
      },
    });

    const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0xffcc66,
      transparent: true,
      opacity: 0,
    });

    return [ringGeometry, ringMaterial, coreGeometry, coreMaterial] as const;
  }, []);

  useEffect(() => {
    ringMaterialRef.current = ringMaterial;
    coreMaterialRef.current = coreMaterial;
  }, [ringMaterial, coreMaterial]);

  useEffect(() => {
    if (ringMaterialRef.current) {
      ringMaterialRef.current.uniforms.uOpacity.value = opacity;
      ringMaterialRef.current.visible = opacity > 0.001;
    }
    if (coreMaterialRef.current) {
      coreMaterialRef.current.opacity = opacity;
      coreMaterialRef.current.visible = opacity > 0.001;
    }
  }, [opacity]);

  return (
    <group ref={groupRef} position={[0, 0, -20]}>
      <mesh
        geometry={ringGeometry}
        material={ringMaterial}
        rotation={[Math.PI / 2, 0, 0]}
      />
      <mesh geometry={coreGeometry} material={coreMaterial} />
    </group>
  );
}
