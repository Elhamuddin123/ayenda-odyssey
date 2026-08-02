"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { Euler, Vector3, type Group } from "three";
import { useTimeline } from "../timeline";
import { computeCameraTarget } from "./cameraUtils";
import { CAMERA_SMOOTHING } from "./cameraConstants";

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

  useFrame((_, delta) => {
    localTime.current += delta;
    const time = timeline.isPlaying ? timeline.elapsedTime : localTime.current;

    // compute target into reused objects
    computeCameraTarget(time, targetPos.current, targetRot.current);

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
