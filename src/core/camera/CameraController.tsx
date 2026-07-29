"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { Euler, Vector3, type Group } from "three";
import { useTimeline } from "../timeline";
import { updateCameraMotion } from "./cameraUtils";

interface CameraControllerProps {
  readonly rigRef: RefObject<Group | null>;
}

export function CameraController({ rigRef }: CameraControllerProps) {
  const position = useRef(new Vector3());
  const rotation = useRef(new Euler());
  const localTime = useRef(0);
  const timeline = useTimeline();

  useFrame((_, delta) => {
    localTime.current += delta;
    const time = timeline.isPlaying ? timeline.elapsedTime : localTime.current;

    updateCameraMotion(time, position.current, rotation.current);

    if (rigRef.current) {
      rigRef.current.position.copy(position.current);
      rigRef.current.rotation.copy(rotation.current);
    }
  });

  return null;
}
