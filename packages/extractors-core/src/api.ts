/**
 * Reports extractor progress.
 */
export type ProgressReporter = (...message: any[]) => void;

/**
 * Reports extractor errors.
 */
export type ErrorReporter = (...message: any[]) => void;

/**
 * A wrapper for extractor reporters used during extraction.
 */
export interface Reporters {
  progress: ProgressReporter;
  error: ErrorReporter;
}

/**
 * The input received by an Extractor.
 */
export interface ExtractorInput {
  source: string;
  assets: string;
  code: string;
}

/**
 * Defines a common interface for extraction.
 */
export interface Extractor {
  export (input: ExtractorInput, projectRoot: string, reporters?: Reporters): Promise<any>;
}

/**
 * Defines a common interface for Extractor constructors.
 */
export interface ExtractorFactory {
  new (): Extractor;
  configure? (constructorArgs: string[]): Promise<void>;
  shouldRetryError? (error: Error): Promise<boolean>;
  canParse (source: string): Promise<boolean>;
  create (...args: any[]): Extractor;
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

declare module '@diez/cli-core/types/api' {
  /**
   * Extends FullDiezConfiguration for the extract command.
   */
  export interface FullDiezConfiguration {
    designs: Partial<DesignSources>;
  }
}
