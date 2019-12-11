import {
  del as delRequest,
  get as getRequest,
  OptionsWithUrl,
  post as postRequest,
  put as putRequest,
  RequestCallback,
  Response,
} from 'request';

interface TransportResponse<T> {
  body: T;
  httpResponse: Partial<Response>;
}

const promisifyRequest = (requestMethod: (options: OptionsWithUrl, cb: RequestCallback) => any) => {
  return <T>(options: OptionsWithUrl) => {
    return new Promise<TransportResponse<T>>((resolve, reject) => {
      requestMethod(options, (err, httpResponse, body) => {
        if (err) {
          reject(err);
        }

        resolve({httpResponse, body: body as T});
      });
    });
  };
};

/**
 * Perform a GET request.
 */
export const get = promisifyRequest(getRequest);

/**
 * Perform a POST request.
 */
export const post = promisifyRequest(postRequest);

/**
 * Perform a DELETE request.
 */
export const del = promisifyRequest(delRequest);

/**
 * Perform a PUT request.
 */
export const put = promisifyRequest(putRequest);
