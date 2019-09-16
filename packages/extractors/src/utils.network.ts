import {UnauthorizedRequestException} from '@diez/cli-core';
import {createServer} from 'http';
import open from 'open';
import request, {Headers} from 'request';
import serverDestroy from 'server-destroy';
import {URL} from 'url';
import {OAuthCode} from './api';

/**
 * Performs a bare GET request.
 */
export const performGetRequest = <T>(uri: string, json = true, headers?: Headers): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    request({uri, headers, json}, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        if (response.statusCode === 403) {
          reject(new UnauthorizedRequestException());
        } else {
          reject(new Error(error ? error.message : body.err));
        }
      } else {
        resolve(body as T);
      }
    });
  });
};

/**
 * Performs an authenticated OAuth GET request using a Bearer token.
 */
export const performGetRequestWithBearerToken = <T>(uri: string, token: string): Promise<T> => {
  return performGetRequest<T>(uri, true, {Authorization: `Bearer ${token}`});
};

/**
 * Requests an OAuth 2.0 code using the default web browser, starts a mini-web server for handling the redirect,
 * and redirects to a success page after completion.
 * @param authUrl The pre-built authentication URL where we can request a code.
 * @param port The (open) port number where we should start listening for tokens.
 */
export const getOAuthCodeFromBrowser = (authUrl: string, port: number): Promise<OAuthCode> => {
  return new Promise((resolve, reject) => {
    const server = createServer(async (serverRequest, response) => {
      try {
        if (serverRequest) {
          const {searchParams: qs} = new URL(serverRequest.url!, `http:localhost:${port}`);
          response.writeHead(302, {
            Location: 'https://beta.diez.org/signed-in',
          });
          response.end();
          server.destroy();
          resolve({code: qs.get('code')!, state: qs.get('state')!});
        }
      } catch (error) {
        reject(error);
      }
    }).listen(port, async () => {
      const cp = await open(authUrl, {wait: false});
      cp.unref();
    });

    serverDestroy(server);
  });
};
