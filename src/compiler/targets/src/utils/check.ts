import {Registry} from '@diez/storage';
import {DiezRegistryOptions} from '@diez/storage/types/api';

const decoder = (...args: number[]) => String.fromCharCode(...args);

/**
 * Intentionally obscured strings, you can obscure new ones with this:
 *
 * ```js
 * 'string to obscure'.split('').map((letter) => letter.charCodeAt(0));
 * ```
 */

// resolves to '@diez/sdk-inkstone'
const diezSdkName = decoder(64, 100, 105, 101, 122, 47, 115, 100, 107, 45, 105, 110, 107, 115, 116, 111, 110, 101);
// resolves to 'checkActivation'
const sdkMethodName = decoder(99, 104, 101, 99, 107, 65, 99, 116, 105, 118, 97, 116, 105, 111, 110);
// resolves to 'activationKey'
const paramName = decoder(97, 99, 116, 105, 118, 97, 116, 105, 111, 110, 75, 101, 121);
// resolves to 'DIEZ_ACTIVATION_KEY'
const activationKeyEnvVariableName = decoder(68, 73, 69, 90, 95, 65, 67, 84, 73, 86, 65, 84, 73, 79, 78, 95, 75, 69, 89);
/**
 * Check if the user has a valid activationId in ~/.diezrc
 *
 * This method is made intentionally obscure to add a dumb layer of protection before giving the 'keys to the kingdom'
 * to an user trying to hack our licensing scheme.
 */
export const check = async () => {
  // Require diez-sdk-inkstone
  const diezSdkInkstone = require(diezSdkName);

  // Build the params for the request
  const requestParams: {[key: string]: string | undefined} = {};

  requestParams[paramName] = await getKey();

  // Perform the request
  const response = await diezSdkInkstone[sdkMethodName](requestParams);

  if (response.error) {
    throw response.error;
  }
};

/**
 * Try to find an activation key
 */
export const getKey = async () => {
  const registryKey = await Registry.get(paramName as keyof DiezRegistryOptions);

  if (registryKey) {
    return String(registryKey);
  }

  if (process && process.env[activationKeyEnvVariableName]) {
    return process.env[activationKeyEnvVariableName];
  }

  return;
};
