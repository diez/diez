/**
 * A generic generated entity with a predefined initializer.
 */
export interface CodegenEntity {
  name: string;
  initializer: string;
}

/**
 * Folder names where we should store extracted assets.
 */
export enum AssetFolder {
  Slice = 'slices',
  Artboard = 'artboards',
  Group = 'groups',
  Frame = 'frames',
}

/**
 * A generated asset.
 */
export interface GeneratedAsset {
  src: string;
  width: number;
  height: number;
}

/**
 * A collection of extracted assets.
 */
export type GeneratedAssets = Map<AssetFolder, Map<string, GeneratedAsset>>;

/**
 * A specification for a generatable design system.
 */
export interface CodegenDesignSystem {
  assetsDirectory: string;
  designSystemName: string;
  filename: string;
  projectRoot: string;
  colors: CodegenEntity[];
  typographs: CodegenEntity[];
  fontRegistry: Set<string>;
  fontNames: Set<string>;
  assets: GeneratedAssets;
}
