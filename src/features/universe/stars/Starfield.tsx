"use client";

import { STAR_LAYER_DEFINITIONS } from "./starConstants";
import { StarLayer } from "./StarLayer";

export function Starfield() {
  return (
    <group>
      {STAR_LAYER_DEFINITIONS.map((layer) => (
        <StarLayer key={layer.key} layer={layer} />
      ))}
    </group>
  );
}
