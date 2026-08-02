"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { Euler, Vector3, type Group } from "three";
import { useTimeline } from "../timeline";
import { useDirector } from "../director";
import { computeCameraTarget } from "./cameraUtils";
import {
  CAMERA_SMOOTHING,
  CAMERA_BASE_FORWARD_SPEED,
  CAMERA_VELOCITY_MULTIPLIER,
} from "./cameraConstants";

interface CameraControllerProps {
  readonly rigRef: RefObject<Group | null>;
}

export function CameraController({ rigRef }: CameraControllerProps) {
  const position = useRef(new Vector3());
  const rotation = useRef(new Euler());
  const targetPos = useRef(new Vector3());
  const targetRot = useRef(new Euler());
  const localTime = useRef(0);
  const timeline = useTimeline();
  const director = useDirector();
  const forwardDistance = useRef(0);

  useFrame((_, delta) => {
    localTime.current += delta;
    const time = timeline.isPlaying ? timeline.elapsedTime : localTime.current;

    // compute target into reused objects
    computeCameraTarget(time, targetPos.current, targetRot.current);

    // Update forward distance based on base speed and director multiplier (no allocations)
    const moodMultiplier = (() => {
      switch (director?.cameraMood) {
        case "Idle":
          return 0.45;
        case "Floating":
          return 0.85;
        case "Observing":
          return 0.95;
        case "Investigating":
          return 1.15;
        case "Approaching":
          return 1.5;
        default:
          return 1.0;
      }
    })();

    const velocityMultiplier = (CAMERA_VELOCITY_MULTIPLIER || 1) * moodMultiplier;
    forwardDistance.current += delta * CAMERA_BASE_FORWARD_SPEED * velocityMultiplier;

    // apply forward offset to the target position (camera moves forward along -Z)
    targetPos.current.z -= forwardDistance.current;

    if (rigRef.current) {
      // lerp position for weighty, smooth motion
      rigRef.current.position.lerp(targetPos.current, CAMERA_SMOOTHING);

      // smooth rotation by lerping Euler components
      rotation.current.x += (targetRot.current.x - rotation.current.x) * CAMERA_SMOOTHING;
      rotation.current.y += (targetRot.current.y - rotation.current.y) * CAMERA_SMOOTHING;
      rotation.current.z += (targetRot.current.z - rotation.current.z) * CAMERA_SMOOTHING;
      rigRef.current.rotation.copy(rotation.current);
    }
  });

  return null;
}
