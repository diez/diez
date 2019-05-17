import {execAsync, isMacOS, UnauthorizedRequestException} from '@diez/cli-core';
import {createWriteStream, unlink} from 'fs-extra';
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
 * Downloads a file asynchronously.
 */
export const downloadFile = (url: string, dest: string) => {
  const file = createWriteStream(dest);
  const sendReq = request.get(url);

  return new Promise<void>((resolve, reject) => {
    sendReq.on('finish', (response) => {
      if (response.statusCode !== 200) {
        return reject(`Response status was ${response.statusCode}`);
      }

      sendReq.pipe(file);
    });

    file.on('finish', () => {
      file.close();
      resolve();
    });

    sendReq.on('error', (err) => {
      unlink(dest, () => {
        reject(err.message);
      });
    });

    file.on('error', (err) => {
      unlink(dest, () => {
        reject(err.message);
      });
    });
  });
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
          // TODO: improve the redirect location of this handshake.
          response.writeHead(302, {
            Location: 'https://diez.org/figma-auth',
          });
          response.end();
          server.destroy();
          // TODO: take users back to Terminal (if possible) on other platforms.
          if (isMacOS()) {
            try {
              await execAsync('open -b com.apple.Terminal');
            } catch (_) {
              // Noop.
            }
          }
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
