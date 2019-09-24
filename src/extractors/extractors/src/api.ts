/**
 * Defines an interface for extractors that need OAuth credentials.
 */
export interface OAuthable {
  token: string;
}

/**
 * Supported image formats for exporting.
 */
export enum ImageFormats {
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
