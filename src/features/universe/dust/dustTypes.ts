export interface DustLayerDefinition {
  readonly key: string;
  readonly count: number;
  readonly radiusMin: number;
  readonly radiusMax: number;
  readonly sizeMin: number;
  readonly sizeMax: number;
  readonly opacity: number;
  readonly speed: number;
  readonly color: readonly [number, number, number];
  readonly position: readonly [number, number, number];
  readonly rotation: readonly [number, number, number];
}
