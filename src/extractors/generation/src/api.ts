/**
 * A generic generated entity with a predefined initializer.
 */
export interface CodegenEntity {
  name: string;
  initializer: string;
}

/**
 * Describes assets that can be extracted from design tools.
 */
export enum ExtractableAssetType {
  Slice = 'slice',
  Component = 'component',
}

/**
 * Folder names where we should store extracted assets.
 */
export enum AssetFolder {
  Image = 'images',
  /**
   * @deprecated since version 10.4.0
   */
  Slice = 'slices',
  /**
   * @deprecated since version 10.4.0
   */
  Component  = 'components',
}

/**
 * Maps assets that can be extracted from design tools to folder names.
 */
export type AssetFolderByAssetType = Record<ExtractableAssetType, AssetFolder>;

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
export type GeneratedAssets = Map<ExtractableAssetType, Map<string, GeneratedAsset>>;

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
 * A specification for a generatable design language.
 */
export interface CodegenDesignLanguage {
  assetsDirectory: string;
  designLanguageName: string;
  filename: string;
  projectRoot: string;
  colors: CodegenEntity[];
  gradients: CodegenEntity[];
  shadows: CodegenEntity[];
  typographs: CodegenEntity[];
  fonts: GeneratedFonts;
  assets: GeneratedAssets;
}

/**
 * Describes typograph data serialized in a format useful to manipulate.
 */
export interface SerializedTypographData {
  color: string;
  fontSize: number;
  letterSpacing: number;
  lineHeight: number;
  alignment: string;
}
