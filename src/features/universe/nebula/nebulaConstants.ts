export interface NebulaLayerDefinition {
  readonly key: string;
  readonly position: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
  readonly scale: number;
  readonly opacity: number;
  readonly speed: number;
  readonly color: readonly [number, number, number];
}

export const NEBULA_PLANE_SIZE = 460;

export const NEBULA_LAYER_DEFINITIONS: ReadonlyArray<NebulaLayerDefinition> = [
  {
    key: "background",
    position: [0, 0, -120],
    rotation: [0.12, 0.18, 0.02],
    scale: 1.8,
    opacity: 0.05,
    speed: 0.0008,
    color: [0.055, 0.08, 0.12],
  },
  {
    key: "mid",
    position: [0, -12, -60],
    rotation: [0.08, 0.06, -0.02],
    scale: 1.25,
    opacity: 0.07,
    speed: 0.0010,
    color: [0.06, 0.095, 0.135],
  },
  {
    key: "foreground",
    position: [1, 14, -28],
    rotation: [0.02, -0.08, 0.05],
    scale: 0.95,
    opacity: 0.09,
    speed: 0.0014,
    color: [0.07, 0.11, 0.14],
  },
];
