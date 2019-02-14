// @ts-ignore
import {ReadableMock} from 'stream-mock';

interface options {
  uri: string;
  headers: {[key: string]: string};
}

type callback = (error: Error|null, status: {statusCode: number}, body: string) => void;

const request = (options: options, callback: callback) => {
  if (options.uri.includes('files/')) {
    return callback(null, {statusCode: 200}, require('../fixtures/figma/sample-file.json'));
  }

  if (options.uri.includes('images/')) {
    return callback(null, {statusCode: 200}, require('../fixtures/figma/images.json'));
  }

  if (options.uri.includes('img/')) {
    return callback(null, {statusCode: 200}, '<svg>MOCK</svg>');
  }

  return callback(new Error('undefined'), {statusCode: 404}, '');
};

request.get = () => {
  const stream = new ReadableMock(['<svg>MOCK</svg>']);
  return {
    pipe: stream.pipe.bind(stream),
    on: (event: string, cb: ({}) => void) => {
      cb({statusCode: 200});
    },
  };
};

export default request;
