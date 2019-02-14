/**
 * Defines a common interface for Exporters
 */
export interface Exportable {
  exportSVG (source: string, out: string): Promise<void>;
  canParse (source: string): boolean;
}

/**
 * Defines an interface for exporters that need OAuth credentials.
 */
export interface OAutheable {
  token: string;
}
