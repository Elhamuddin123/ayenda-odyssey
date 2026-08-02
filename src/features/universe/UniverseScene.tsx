"use client";

import { Background } from "./Background";
import { Starfield } from "./stars";
import { Nebula } from "./nebula";
import { GalaxyDust } from "./dust";

export function UniverseScene() {
  return (
    <>
      <Background />
      <Nebula />
      <GalaxyDust />
      <Starfield />
    </>
  );
}
