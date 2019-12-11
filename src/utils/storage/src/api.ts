/**
 * All the configuration values we can expect to find in the Registry.
 */
export interface DiezRegistryOptions {
  /**
   * The unique identifier for this device.
   */
  uuid: string;
  /**
   * Whether or not analytics are enabled.
   */
  analyticsEnabled: boolean;
  /**
   * Diez enterprise activation key.
   */
  activationKey: string;
}

/**
 * A diagnostic payload for Diez analytics.
 *
 * See [here](https://github.com/diez/diez/tree/master/services/analytics) for how this is used.
 */
export interface DiezDiagnostics {
  uuid: string;
  eventType: string;
  properties: {
    platform: NodeJS.Platform;
    arch: string;
    diezVersion: string;
    nodeVersion: string;
  };
}
