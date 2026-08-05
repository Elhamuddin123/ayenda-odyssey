"use client";

import { usePerformanceStore } from "../../../core/performance";
import { STAR_LAYER_DEFINITIONS } from "./starConstants";
import { StarLayer } from "./StarLayer";
import type { StarLayerDefinition } from "./starTypes";

interface StarfieldProps {
  readonly opacityScale?: number;
  readonly speedScale?: number;
}

function applyDensity(
  layer: StarLayerDefinition,
  density: number,
): StarLayerDefinition {
  return {
    ...layer,
    count: Math.max(1, Math.floor(layer.count * density)),
  };
}

export function Starfield({ opacityScale = 1, speedScale = 1 }: StarfieldProps) {
  const particleDensity = usePerformanceStore((state) => state.particleDensity);

  return (
    <group>
      {STAR_LAYER_DEFINITIONS.map((layer) => (
        <StarLayer
          key={layer.key}
          layer={applyDensity(layer, particleDensity)}
          opacityScale={opacityScale}
          speedScale={speedScale}
        />
      ))}
    </group>
  );
}
