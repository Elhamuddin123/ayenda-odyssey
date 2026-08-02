export interface BlackHoleConfig {
  readonly position?: readonly [number, number, number];
  readonly eventHorizonRadius?: number;
  readonly diskInnerRadius?: number;
  readonly diskOuterRadius?: number;
  readonly diskRotationSpeed?: number;
}
