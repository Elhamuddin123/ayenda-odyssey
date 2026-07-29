export interface StarLayerDefinition {
  readonly key: string;
  readonly count: number;
  readonly radiusMin: number;
  readonly radiusMax: number;
  readonly scaleMin: number;
  readonly scaleMax: number;
  readonly brightnessMin: number;
  readonly brightnessMax: number;
  readonly speed: number;
  readonly rotation: readonly [number, number, number];
  readonly position: readonly [number, number, number];
  readonly color: readonly [number, number, number];
  readonly twinkle: boolean;
}
