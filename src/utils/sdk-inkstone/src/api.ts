/**
 * Describes an endpoint that requires an activation key.
 */
export interface EndpointWithActivationKey {
  activationKey: string;
}

/**
 * Describes an invalid response.
 */
export interface InvalidResponse {
  error: Error;
}

/**
 * Describes the shape of sdk-inkstone responses.
 */
export type SdkResponse<T> = Promise<T | InvalidResponse>;

/**
 * Response of performing an activation.
 */
export type PerformActivationResponse = SdkResponse<{}>;

/**
 * Parameters required for [[getPackageUrls]]
 */
export type GetPackageUrlsParams = EndpointWithActivationKey  & {
  names: string[];
  version: string;
};

/**
 * Response of [[getPackageUrls]].
 */
export type GetPackageUrlsResponse = SdkResponse<{packageUrls: {[key: string]: string}}>;

/**
 * Response of [[checkActivation]]
 */
export type CheckActivationResponse = SdkResponse<{organizationKey: string}>;
