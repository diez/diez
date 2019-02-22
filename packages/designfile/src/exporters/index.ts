export type ProgressReporter = (message: string) => void;

/**
 * Defines a common interface for Exporters
 */
export interface Exportable {
  exportSVG (source: string, out: string, onProgress: ProgressReporter): Promise<void>;
  canParse (source: string): Promise<boolean>;
}

/**
 * Defines an interface for exporters that need OAuth credentials.
 */
export interface OAutheable {
  token: string;
}
