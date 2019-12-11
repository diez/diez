/**
 * Valid configuration options.
 */
export interface InkstoneConfig {
  baseUrl?: string;
  authToken?: string;
}

/**
 * Default configuration options.
 */
export const inkstoneConfig: InkstoneConfig = {
  baseUrl: process.env.HAIKU_API || 'https://inkstone.haiku.ai/',
};

/**
 * Sets a new configuration.
 */
export const setConfig = (newVals: InkstoneConfig) => {
  Object.assign(inkstoneConfig, newVals);
};
