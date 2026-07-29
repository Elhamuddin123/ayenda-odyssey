"use client";

import { useRef } from "react";
import type { Group } from "three";
import { EngineCamera } from "./EngineCamera";
import { CameraController } from "./CameraController";

export function CameraRig() {
  const rigRef = useRef<Group>(null);

  return (
    <group ref={rigRef}>
      <EngineCamera />
      <CameraController rigRef={rigRef} />
    </group>
  );
}
