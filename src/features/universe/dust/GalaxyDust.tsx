"use client";

import { usePerformanceStore } from "../../../core/performance";
import { DUST_LAYER_DEFINITIONS } from "./dustConstants";
import { DustLayer } from "./DustLayer";
import type { DustLayerDefinition } from "./dustTypes";

interface GalaxyDustProps {
  readonly opacityScale?: number;
  readonly speedScale?: number;
}

function applyDensity(
  layer: DustLayerDefinition,
  density: number,
): DustLayerDefinition {
  return {
    ...layer,
    count: Math.max(1, Math.floor(layer.count * density)),
  };
}

export function GalaxyDust({ opacityScale = 1, speedScale = 1 }: GalaxyDustProps) {
  const particleDensity = usePerformanceStore((state) => state.particleDensity);

  return (
    <group>
      {DUST_LAYER_DEFINITIONS.map((layer) => (
        <DustLayer
          key={layer.key}
          layer={applyDensity(layer, particleDensity)}
          opacityScale={opacityScale}
          speedScale={speedScale}
        />
      ))}
    </group>
  );
}
