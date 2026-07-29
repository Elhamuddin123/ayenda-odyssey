export interface AssetDescriptor {
  readonly name: string;
  readonly path: string;
}

export const coreAssets: ReadonlyArray<AssetDescriptor> = [];
