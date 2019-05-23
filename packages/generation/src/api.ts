/**
 * A generic generated entity with a predefined initializer.
 */
export interface CodegenEntity {
  name: string;
  initializer: string;
}

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
}
