export type ProgressReporter = (...message: any[]) => void;
export type Reporters = {progress: ProgressReporter}

/**
 * Defines a common interface for Exporters
 */
export interface Exporter {
  exportSVG (source: string, out: string, reporters?: Reporters): Promise<void>;
}

/**
 * Defines a common interface for Exporter constructors.
 */
export interface ExporterFactory {
  canParse (source: string): Promise<boolean>;
  create (...args: any[]): Exporter;
}

/**
 * Defines an interface for exporters that need OAuth credentials.
 */
export interface OAuthable {
  token: string;
}
