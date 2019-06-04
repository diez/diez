/**
 * Reports exporter progress.
 * @ignore
 */
export type ProgressReporter = (...message: any[]) => void;

/**
 * Reports exporter errors.
 * @ignore
 */
export type ErrorReporter = (...message: any[]) => void;

/**
 * A collection of exporter reporters.
 * @ignore
 */
export interface Reporters {
  progress: ProgressReporter;
  error: ErrorReporter;
}

/**
 * The input received by an Exporter.
 */
export interface ExporterInput {
  source: string;
  assets: string;
  code: string;
  figmaToken?: string;
}

/**
 * Defines a common interface for Exporters
 */
export interface Exporter {
  export (input: ExporterInput, projectRoot: string, reporters?: Reporters): Promise<void>;
}

/**
 * Defines a common interface for Exporter constructors.
 */
export interface ExporterFactory {
  new (): Exporter;
  canParse (source: string): Promise<boolean>;
  create (...args: any[]): Exporter;
}

/**
 * Defines an interface for exporters that need OAuth credentials.
 */
export interface OAuthable {
  token: string;
}

/**
 * Supported image formats for exporting.
 */
export const enum ImageFormats {
  png = 'png',
  svg = 'svg',
  jpg = 'jpg',
}

/**
 * A specification for an OAuth code.
 * @ignore
 */
export interface OAuthCode {
  code: string;
  state: string;
}

/**
 * Specifies metadata associated with design sources.
 */
export interface DesignSources {
  /**
   * The directory where design files should sit, relative to the project root.
   *
   * The default value is `./designs`.
   */
  sources: string;
  /**
   * The directory to which assets should be extracted, relative to the project root.
   *
   * The default value is `./assets`.
   */
  assets: string;
  /**
   * The directory where we should generate code, relative to the project root.
   *
   * The default value is `./src/designs`.
   */
  code: string;
  /**
   * An array of supported design source service identifiers (typically URLs).
   */
  services: string[];
}

declare module '@diez/storage/types/api' {
  /**
   * Extends DiezRegistryOptions.
   */
  export interface DiezRegistryOptions {
    /**
     * The stored Figma access token.
     */
    figmaAccessToken: string;
  }
}

declare module '@diez/cli-core/types/api' {
  /**
   * Extends FullDiezConfiguration for the extract command.
   */
  export interface FullDiezConfiguration {
    designs: Partial<DesignSources>;
  }
}
