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
  Component = 'components',
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
 * A generated font.
 */
export interface GeneratedFont {
  name: string;
  family: string;
  style: string;
  path: string;
}

/**
 * A generated font.
 */
export type GeneratedFonts = Map<string, Map<string, {name: string, path?: string}>>;

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
  fonts: GeneratedFonts;
  assets: GeneratedAssets;
}
