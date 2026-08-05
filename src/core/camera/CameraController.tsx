"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { Euler, Vector3, type Group } from "three";
import { computeCameraTarget } from "./cameraUtils";
import { CAMERA_SMOOTHING } from "./cameraConstants";
import { useDirector } from "../director";

interface CameraControllerProps {
  readonly rigRef: RefObject<Group | null>;
}

export function CameraController({ rigRef }: CameraControllerProps) {
  const position = useRef(new Vector3());
  const rotation = useRef(new Euler());
  const targetPos = useRef(new Vector3());
  const targetRot = useRef(new Euler());
  const localTime = useRef(0);
  const director = useDirector();

  useFrame((_, delta) => {
    localTime.current += delta;

    const state = {
      act: director.currentAct,
      sceneProgress: director.sceneProgress,
      totalProgress:
        director.totalDuration > 0
          ? director.totalElapsedTime / director.totalDuration
          : 0,
      cameraMood: director.cameraMood,
    };

    computeCameraTarget(state, localTime.current, targetPos.current, targetRot.current);

    if (rigRef.current) {
      position.current.lerp(targetPos.current, CAMERA_SMOOTHING);
      rotation.current.x +=
        (targetRot.current.x - rotation.current.x) * CAMERA_SMOOTHING;
      rotation.current.y +=
        (targetRot.current.y - rotation.current.y) * CAMERA_SMOOTHING;
      rotation.current.z +=
        (targetRot.current.z - rotation.current.z) * CAMERA_SMOOTHING;

      rigRef.current.position.copy(position.current);
      rigRef.current.rotation.copy(rotation.current);
    }
  });

  return null;
}
