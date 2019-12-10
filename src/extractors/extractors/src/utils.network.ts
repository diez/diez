import {findOpenPort, UnauthorizedRequestException} from '@diez/cli-core';
import {createServer} from 'http';
import open from 'open';
import request, {Headers} from 'request';
import serverDestroy from 'server-destroy';
import {URL, URLSearchParams} from 'url';
import {v4} from 'uuid';
import {OAuthCode} from './api';

/**
 * Performs a bare GET request.
 */
export const performGetRequest = <T>(uri: string, json = true, headers?: Headers): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    request({uri, headers, json}, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        // For the purpose of HTTP requests made in this package, 403 and 404 both can mean an unauthorized request.
        if (response && (response.statusCode === 403 || response.statusCode === 404)) {
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
            Location: 'https://diez.org/signed-in',
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

const figmaUrl = 'https://www.figma.com';
const figmaPorts = [46572, 48735, 7826, 44495, 21902];

/**
 * See [http://github.com/diez/diez/tree/master/services/oauth](services/oauth) for the implementation of the OAuth 2.0
 * handshake broker.
 */
const figmaClientId = 'dVkwfl8RBD91688fwCq9Da';
const figmaTokenExchangeUrl = 'https://oauth.diez.org/figma';

/**
 * Implements the OAuth token dance for Figma and resolves a useful access token.
 */
export const getFigmaAccessToken = async (): Promise<string> => {
  const port = await findOpenPort(figmaPorts);
  const state = v4();
  const redirectUri = `http://localhost:${port}`;
  const authParams = new URLSearchParams([
      ['client_id', figmaClientId],
      ['redirect_uri', redirectUri],
      ['scope', 'file_read'],
      ['state', state],
      ['response_type', 'code'],
  ]);
  const authUrl = `${figmaUrl}/oauth?${authParams.toString()}`;
  const {code, state: checkState} = await getOAuthCodeFromBrowser(authUrl, port);
  if (state !== checkState) {
    throw new Error('Security exception!');
  }

  const tokenExchangeParams = new URLSearchParams([
      ['code', code],
      ['redirect_uri', redirectUri],
  ]);
  const {access_token} = await performGetRequest<{access_token: string}>(
    `${figmaTokenExchangeUrl}?${tokenExchangeParams.toString()}`,
    );

  return access_token;
};
