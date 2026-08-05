"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface EarthProps {
  readonly opacity?: number;
  readonly scale?: number;
  readonly atmosphereOpacity?: number;
}

export function Earth({ opacity = 1, scale = 1, atmosphereOpacity = 1 }: EarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial | null>(null);

  const [planetGeometry, planetMaterial, atmosphereGeometry, atmosphereMaterial] =
    useMemo(() => {
      const planetGeometry = new THREE.SphereGeometry(10, 64, 64);
      const planetMaterial = new THREE.MeshStandardMaterial({
        color: 0x0a1a3a,
        emissive: 0x051020,
        roughness: 0.8,
        metalness: 0.1,
        transparent: true,
        opacity: 0,
      });

      const atmosphereGeometry = new THREE.SphereGeometry(11, 64, 64);
      const atmosphereMaterial = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
        fragmentShader: `
        varying vec3 vNormal;
        uniform float uOpacity;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          vec3 color = vec3(0.3, 0.6, 1.0) * intensity;
          float alpha = intensity * uOpacity;
          if (alpha < 0.01) discard;
          gl_FragColor = vec4(color, alpha);
        }
      `,
        uniforms: {
          uOpacity: { value: 0 },
        },
        side: THREE.BackSide,
      });

      return [
        planetGeometry,
        planetMaterial,
        atmosphereGeometry,
        atmosphereMaterial,
      ] as const;
    }, []);

  useEffect(() => {
    planetMaterialRef.current = planetMaterial;
    atmosphereMaterialRef.current = atmosphereMaterial;
  }, [planetMaterial, atmosphereMaterial]);

  useEffect(() => {
    if (planetMaterialRef.current) {
      planetMaterialRef.current.opacity = opacity;
      planetMaterialRef.current.visible = opacity > 0.001;
    }
    if (atmosphereMaterialRef.current) {
      atmosphereMaterialRef.current.uniforms.uOpacity.value = atmosphereOpacity;
      atmosphereMaterialRef.current.visible = atmosphereOpacity > 0.001;
    }
  }, [opacity, atmosphereOpacity]);

  return (
    <group ref={groupRef} position={[0, 0, -240]} scale={scale}>
      <mesh geometry={planetGeometry} material={planetMaterial} />
      <mesh geometry={atmosphereGeometry} material={atmosphereMaterial} />
    </group>
  );
}
