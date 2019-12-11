import {
  CheckActivationResponse,
  EndpointWithActivationKey,
  GetPackageUrlsParams,
  GetPackageUrlsResponse,
  PerformActivationResponse,
} from './api';
import {inkstoneConfig} from './config';
import {get, post} from './transport';

const enum Endpoints {
  PerformActivation = 'v0/diez/activation',
  CheckActivation = 'v0/diez/activation/:ACTIVATION_ID',
  GetPackage = 'v0/diez/package/:DIEZ_ORG_KEY/:PACKAGE_ID/:VERSION',
}

const baseHeaders = {
  'Content-Type': 'application/json',
};

const encodePackageName = (name: string) => {
  return name.replace('/', '+');
};

/**
 * Helper method:  round-trips to server to get org key, then interpolates into package.json-ready string
 * NOTE: this endpoint makes no guarantees of the validity of the resulting URL; the only validation
 *      that occurs is that the requesting user has a active seat.  E.g. a wrong package name or version number would
 *      yield a 'validly constructed' package URL, which would result in a 404.
 */
export const getPackageUrls = async ({names, version, activationKey}: GetPackageUrlsParams): GetPackageUrlsResponse => {
  const activationResponse = await checkActivation({activationKey});

  if ('error' in activationResponse) {
    return activationResponse;
  }

  const packageUrls = names.reduce((acc: {[key: string]: string}, name) => {
    acc[name] = `${inkstoneConfig.baseUrl}${Endpoints.GetPackage}`
      .replace(':DIEZ_ORG_KEY', JSON.parse(activationResponse.organizationKey))
      .replace(':PACKAGE_ID', encodePackageName(name))
      .replace(':VERSION', version);

    return acc;
  }, {});

  return {packageUrls};
};

/**
 * Performs activation of the provided seat.
 */
export const performActivation = async ({activationKey}: EndpointWithActivationKey): PerformActivationResponse => {
  const formData = {
    SeatId: activationKey,
  };

  const options = {
    url: inkstoneConfig.baseUrl + Endpoints.PerformActivation,
    json: formData,
    headers: baseHeaders,
  };

  const {httpResponse} = await post<string>(options);

  if (httpResponse.statusCode === 200) {
    return {};
  }

  if (httpResponse.statusCode === 409) {
    return {error: new Error('This device has already been activated — multiple activations are not supported at this time. If you have any questions, please reach out to contact@haikuforteams.com.')};
  }

  return {error: new Error('Error activating the license, please contact Haiku at contact@haikuforteams.com')};
};

/**
 * Checks if an activation is valid.
 */
export const checkActivation = async ({activationKey}: EndpointWithActivationKey): CheckActivationResponse => {
  if (!activationKey) {
    return {error: new Error('You must provide an activation key.')};
  }

  const options = {
    url: `${inkstoneConfig.baseUrl}${Endpoints.CheckActivation}`.replace(':ACTIVATION_ID', activationKey),
    headers: baseHeaders,
  };

  const {body, httpResponse} = await get<string>(options);

  if (httpResponse && httpResponse.statusCode === 200) {
    return {organizationKey: body};
  }

  return {error: new Error('Error validating your license, if you think this is an error please reach out to contact@haikuforteams.com.')};
};
