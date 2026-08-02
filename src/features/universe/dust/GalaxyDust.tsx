"use client";

import { DUST_LAYER_DEFINITIONS } from "./dustConstants";
import { DustLayer } from "./DustLayer";

export function GalaxyDust() {
  return (
    <group>
      {DUST_LAYER_DEFINITIONS.map((layer) => (
        <DustLayer key={layer.key} layer={layer} />
      ))}
    </group>
  );
}
