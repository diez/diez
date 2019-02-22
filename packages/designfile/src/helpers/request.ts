import {createWriteStream, unlink} from 'fs-extra';
import request from 'request';

export const performGetRequestWithBearerToken = <T>(uri: string, token: string): Promise<T> => {
  const headers = {Authorization: `Bearer ${token}`};
  return new Promise<T>((resolve, reject) => {
    request({uri, headers, json: true}, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(new Error(error ? error.message : body.err));
      } else {
        resolve(body as T);
      }
    });
  });
};

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
