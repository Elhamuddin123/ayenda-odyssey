export const CAMERA_DRIFT_AMPLITUDE = 0.09; // softer, more subtle
export const CAMERA_DRIFT_SPEED = 0.085; // slower phase
export const CAMERA_ROTATION_AMPLITUDE = 0.008; // even subtler rotation
export const CAMERA_ROTATION_SPEED = 0.045; // slower rotation
export const CAMERA_SMOOTHING = 0.06; // lerp factor for smooth, weighty motion
// Mission Velocity System
export const CAMERA_BASE_FORWARD_SPEED = 0.6; // units per second (very slow)
export const CAMERA_VELOCITY_MULTIPLIER = 1.0; // global multiplier, overridable by Director
export const CAMERA_IDLE_DRIFT = 0.0025; // sub-amplitude for idle offset while moving
export const CAMERA_ROLL_AMOUNT = 0.0012; // very small roll applied over time
export const CAMERA_MICRO_ROTATION = 0.0009; // tiny micro rotations for craft-like feel
export const CAMERA_BASE_POSITION_Y = 2;
export const CAMERA_BASE_POSITION_Z = 6;
export const CAMERA_BASE_POSITION_X = 0;
