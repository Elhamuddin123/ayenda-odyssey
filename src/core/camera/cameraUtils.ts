import { Euler, Vector3 } from "three";
import {
  CAMERA_DRIFT_AMPLITUDE,
  CAMERA_DRIFT_SPEED,
  CAMERA_ROTATION_AMPLITUDE,
  CAMERA_ROTATION_SPEED,
  CAMERA_BASE_POSITION_X,
  CAMERA_BASE_POSITION_Y,
  CAMERA_BASE_POSITION_Z,
} from "./cameraConstants";

export function computeCameraTarget(time: number, outPosition: Vector3, outRotation: Euler) {
  // Compute target position and rotation based on slow procedural motion.
  const driftX = Math.sin(time * CAMERA_DRIFT_SPEED * 0.9) * CAMERA_DRIFT_AMPLITUDE;
  const driftY = Math.cos(time * CAMERA_DRIFT_SPEED * 0.7) * CAMERA_DRIFT_AMPLITUDE * 0.55;
  const driftZ = Math.sin(time * CAMERA_DRIFT_SPEED * 0.35) * CAMERA_DRIFT_AMPLITUDE * 0.12;

  const rotX = Math.sin(time * CAMERA_ROTATION_SPEED * 0.7) * CAMERA_ROTATION_AMPLITUDE * 0.8;
  const rotY = Math.cos(time * CAMERA_ROTATION_SPEED * 0.9) * CAMERA_ROTATION_AMPLITUDE * 0.95;
  const rotZ = Math.sin(time * CAMERA_ROTATION_SPEED * 0.43) * CAMERA_ROTATION_AMPLITUDE * 0.5;

  outPosition.set(
    CAMERA_BASE_POSITION_X + driftX,
    CAMERA_BASE_POSITION_Y + driftY,
    CAMERA_BASE_POSITION_Z + driftZ,
  );
  outRotation.set(rotX, rotY, rotZ, "XYZ");
}

