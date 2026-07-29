"use client";

import { Background } from "./Background";
import { Stars } from "./Stars";
import { Nebula } from "./nebula";

export function UniverseScene() {
  return (
    <>
      <Background />
      <Nebula />
      <Stars />
    </>
  );
}
