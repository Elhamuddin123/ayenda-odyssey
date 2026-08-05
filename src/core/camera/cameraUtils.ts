import { Euler, Vector3 } from "three";
import type { CameraMood } from "../director/directorTypes";
import {
  CAMERA_BASE_POSITION_X,
  CAMERA_BASE_POSITION_Y,
  CAMERA_BASE_POSITION_Z,
  CAMERA_DRIFT_AMPLITUDE,
  CAMERA_DRIFT_SPEED,
  CAMERA_MICRO_ROTATION,
  CAMERA_ROLL_AMOUNT,
  CAMERA_ROTATION_AMPLITUDE,
  CAMERA_ROTATION_SPEED,
} from "./cameraConstants";

// Narrative anchor positions (world space)
const BLACK_HOLE_POSITION = new Vector3(-12, -4, -200);
const EARTH_POSITION = new Vector3(0, 0, -240);
const HERO_POSITION = new Vector3(0, 0, 8);

export interface CameraJourneyState {
  readonly act: number;
  readonly sceneProgress: number;
  readonly totalProgress: number;
  readonly cameraMood: CameraMood;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function applyDrift(time: number, outPosition: Vector3, outRotation: Euler) {
  const driftX = Math.sin(time * CAMERA_DRIFT_SPEED * 0.9) * CAMERA_DRIFT_AMPLITUDE;
  const driftY =
    Math.cos(time * CAMERA_DRIFT_SPEED * 0.7) * CAMERA_DRIFT_AMPLITUDE * 0.55;
  const driftZ =
    Math.sin(time * CAMERA_DRIFT_SPEED * 0.35) * CAMERA_DRIFT_AMPLITUDE * 0.12;

  const microX =
    Math.sin(time * CAMERA_MICRO_ROTATION * 0.9) * CAMERA_MICRO_ROTATION * 0.8;
  const microY =
    Math.cos(time * CAMERA_MICRO_ROTATION * 1.1) * CAMERA_MICRO_ROTATION * 0.9;
  const roll = Math.sin(time * CAMERA_ROTATION_SPEED * 0.43) * CAMERA_ROLL_AMOUNT;

  const rotX =
    Math.sin(time * CAMERA_ROTATION_SPEED * 0.7) * CAMERA_ROTATION_AMPLITUDE * 0.8 +
    microX;
  const rotY =
    Math.cos(time * CAMERA_ROTATION_SPEED * 0.9) * CAMERA_ROTATION_AMPLITUDE * 0.95 +
    microY;
  const rotZ =
    roll +
    Math.sin(time * CAMERA_ROTATION_SPEED * 0.43) * CAMERA_ROTATION_AMPLITUDE * 0.5;

  outPosition.set(
    outPosition.x + driftX,
    outPosition.y + driftY,
    outPosition.z + driftZ,
  );
  outRotation.set(rotX, rotY, rotZ, "XYZ");
}

function lookAt(position: Vector3, target: Vector3, outRotation: Euler) {
  const dummy = new Vector3().copy(target).sub(position).normalize();
  const yaw = Math.atan2(dummy.x, dummy.z);
  const pitch = Math.asin(-dummy.y);
  outRotation.set(pitch, yaw, 0, "XYZ");
}

function computeBasePosition(
  state: CameraJourneyState,
  time: number,
  outPosition: Vector3,
  outRotation: Euler,
) {
  const { act, sceneProgress, totalProgress } = state;
  const eased = easeInOutCubic(sceneProgress);

  switch (act) {
    case 1: {
      // Silence: barely moving, facing forward into the dark.
      outPosition.set(
        CAMERA_BASE_POSITION_X,
        CAMERA_BASE_POSITION_Y,
        CAMERA_BASE_POSITION_Z,
      );
      outRotation.set(0, 0, 0, "XYZ");
      break;
    }
    case 2: {
      // Universe breathes: slow forward drift, subtle rotation.
      const z = lerp(CAMERA_BASE_POSITION_Z, 2, eased);
      outPosition.set(CAMERA_BASE_POSITION_X, CAMERA_BASE_POSITION_Y, z);
      outRotation.set(0, 0, 0, "XYZ");
      break;
    }
    case 3: {
      // Distant signal: turn toward black hole, continue forward.
      const z = lerp(2, -8, eased);
      const turn = lerp(0, 0.12, eased);
      outPosition.set(CAMERA_BASE_POSITION_X, CAMERA_BASE_POSITION_Y, z);
      outRotation.set(0, turn, 0, "XYZ");
      break;
    }
    case 4: {
      // Approach: move toward black hole.
      const startPos = new Vector3(0, 2, -8);
      const endPos = new Vector3(-8, -2, -60);
      outPosition.lerpVectors(startPos, endPos, eased);
      lookAt(outPosition, BLACK_HOLE_POSITION, outRotation);
      break;
    }
    case 5: {
      // Event horizon: close to black hole, slow orbit.
      const radius = 28;
      const orbitAngle = lerp(0, Math.PI * 0.35, eased);
      const orbitCenter = BLACK_HOLE_POSITION.clone().add(new Vector3(0, 0, radius));
      outPosition.set(
        orbitCenter.x + Math.sin(orbitAngle) * radius * 0.3,
        orbitCenter.y + Math.cos(orbitAngle) * radius * 0.15,
        orbitCenter.z - Math.cos(orbitAngle) * radius,
      );
      lookAt(outPosition, BLACK_HOLE_POSITION, outRotation);
      break;
    }
    case 6: {
      // Crossing: plunge past event horizon into darkness.
      const startPos = new Vector3(-6, -1.5, -28);
      const endPos = new Vector3(-4, -1, -8);
      outPosition.lerpVectors(startPos, endPos, eased);
      lookAt(outPosition, BLACK_HOLE_POSITION, outRotation);
      break;
    }
    case 7: {
      // Rebirth: pull back, Earth emerges ahead.
      const startPos = new Vector3(-4, -1, -8);
      const endPos = new Vector3(0, 0, -180);
      outPosition.lerpVectors(startPos, endPos, eased);
      lookAt(outPosition, EARTH_POSITION, outRotation);
      break;
    }
    case 8: {
      // Arrival: approach Earth atmosphere.
      const startPos = new Vector3(0, 0, -180);
      const endPos = new Vector3(0, 0, -20);
      outPosition.lerpVectors(startPos, endPos, eased);
      lookAt(outPosition, EARTH_POSITION, outRotation);
      break;
    }
    case 9: {
      // Ayenda identity: settle into a clean viewing angle.
      const startPos = new Vector3(0, 0, -20);
      const endPos = new Vector3(0, 0, 6);
      outPosition.lerpVectors(startPos, endPos, eased);
      outRotation.set(0, 0, 0, "XYZ");
      break;
    }
    case 10: {
      // Website begins: final hero camera position.
      const startPos = new Vector3(0, 0, 6);
      const endPos = HERO_POSITION.clone();
      outPosition.lerpVectors(startPos, endPos, eased);
      outRotation.set(0, 0, 0, "XYZ");
      break;
    }
    default: {
      outPosition.set(
        CAMERA_BASE_POSITION_X,
        CAMERA_BASE_POSITION_Y,
        CAMERA_BASE_POSITION_Z,
      );
      outRotation.set(0, 0, 0, "XYZ");
    }
  }

  applyDrift(time, outPosition, outRotation);
}

export function computeCameraTarget(
  state: CameraJourneyState,
  time: number,
  outPosition: Vector3,
  outRotation: Euler,
) {
  computeBasePosition(state, time, outPosition, outRotation);
}
