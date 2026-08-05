export interface NebulaLayerDefinition {
  readonly key: string;
  readonly position: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
  readonly scale: number;
  readonly opacity: number;
  readonly speed: number;
  readonly color: readonly [number, number, number];
}

// Make the nebula plane very large to create a sense of scale/infinity
export const NEBULA_PLANE_SIZE = 1600;

export const NEBULA_LAYER_DEFINITIONS: ReadonlyArray<NebulaLayerDefinition> = [
  {
    key: "background",
    position: [0, -6, -420],
    rotation: [0.18, 0.12, 0.02],
    scale: 2.6,
    opacity: 0.035,
    speed: 0.00035,
    color: [0.02, 0.035, 0.08],
  },
  {
    key: "mid",
    position: [0, -20, -240],
    rotation: [0.1, 0.04, -0.01],
    scale: 1.9,
    opacity: 0.048,
    speed: 0.0006,
    color: [0.035, 0.06, 0.12],
  },
  {
    key: "foreground",
    position: [1.5, 12, -110],
    rotation: [0.03, -0.06, 0.05],
    scale: 1.15,
    opacity: 0.066,
    speed: 0.001,
    color: [0.06, 0.08, 0.14],
  },
];
