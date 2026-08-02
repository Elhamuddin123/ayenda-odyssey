"use client";

import { useMemo } from "react";
import type { BlackHoleConfig } from "./blackHoleTypes";
import { EventHorizon } from "./EventHorizon";
import { AccretionDisk } from "./AccretionDisk";
import { BLACK_HOLE_DISTANCE, BLACK_HOLE_POSITION_Y, BLACK_HOLE_POSITION_X } from "./blackHoleConstants";

const DEFAULT_CONFIG: BlackHoleConfig = {
  position: [BLACK_HOLE_POSITION_X, BLACK_HOLE_POSITION_Y, BLACK_HOLE_DISTANCE],
};

export function BlackHole({ position = DEFAULT_CONFIG.position }: BlackHoleConfig) {
  const scenePosition = useMemo(() => position, [position]);

  return (
    <group position={scenePosition}>
      <EventHorizon />
      <AccretionDisk />
    </group>
  );
}
