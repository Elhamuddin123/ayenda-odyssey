"use client";

import { useMemo } from "react";
import type { BlackHoleConfig } from "./blackHoleTypes";
import { EventHorizon } from "./EventHorizon";
import { AccretionDisk } from "./AccretionDisk";
import {
  BLACK_HOLE_DISTANCE,
  BLACK_HOLE_POSITION_Y,
  BLACK_HOLE_POSITION_X,
} from "./blackHoleConstants";

export interface BlackHoleProps extends BlackHoleConfig {
  readonly opacity?: number;
  readonly scale?: number;
  readonly diskOpacity?: number;
  readonly diskGlow?: number;
}

const DEFAULT_POSITION: BlackHoleConfig["position"] = [
  BLACK_HOLE_POSITION_X,
  BLACK_HOLE_POSITION_Y,
  BLACK_HOLE_DISTANCE,
];

export function BlackHole({
  position = DEFAULT_POSITION,
  opacity = 1,
  scale = 1,
  diskOpacity = 1,
  diskGlow = 1,
}: BlackHoleProps) {
  const scenePosition = useMemo(() => position, [position]);
  const scaledScale = useMemo(() => scale, [scale]);

  return (
    <group position={scenePosition} scale={scaledScale}>
      <EventHorizon opacity={opacity} />
      <AccretionDisk opacity={diskOpacity * opacity} glow={diskGlow} />
    </group>
  );
}
