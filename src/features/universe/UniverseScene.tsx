"use client";

import { Background } from "./Background";
import { Starfield } from "./stars";
import { Nebula } from "./nebula";

export function UniverseScene() {
  return (
    <>
      <Background />
      <Nebula />
      <Starfield />
    </>
  );
}
