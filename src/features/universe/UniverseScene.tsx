"use client";

import { Background } from "./Background";
import { Starfield } from "./stars";
import { Nebula } from "./nebula";
import { GalaxyDust } from "./dust";
import { BlackHole } from "./blackhole";

export function UniverseScene() {
  return (
    <>
      <Background />
      <Nebula />
      <BlackHole />
      <GalaxyDust />
      <Starfield />
    </>
  );
}
