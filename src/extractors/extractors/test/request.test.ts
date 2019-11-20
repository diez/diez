import {cleanupMockCommandData, cleanupMockOsData, mockCliCoreFactory, mockOsFactory} from '@diez/test-utils';
jest.doMock('os', mockOsFactory);
jest.doMock('@diez/cli-core', mockCliCoreFactory);

import {RequestListener} from 'http';
import {getFigmaAccessToken, getOAuthCodeFromBrowser} from '../src/utils.network';

jest.mock('open');

afterEach(() => {
  cleanupMockOsData();
  cleanupMockCommandData();
});

class MockServer {
  constructor (readonly listener: RequestListener) {}

  static mockListenOnPort = jest.fn();
  static mockResponse = {
    writeHead: jest.fn(),
    end: jest.fn(),
  };

  static mockDestroy = jest.fn();
  destroy () {
    MockServer.mockDestroy();
  }

  listen (port: number, callback: any) {
    MockServer.mockListenOnPort(port);
    callback();
    // @ts-ignore
    setImmediate(() => this.listener({url: 'http://server.com/oauth?code=foo&state=bar'}, MockServer.mockResponse));
    return this;
  }
}

jest.mock('server-destroy', () => () => {});
jest.mock('http', () => ({
  ...jest.requireActual('http'),
  createServer (listener: RequestListener) {
    return new MockServer(listener);
  },
}));
jest.mock('uuid', () => ({
  counter: 0,
  v4 () {
    switch (this.counter++) {
      case 0:
        return 'bar';
      default:
        return 'baz';
    }
  },
}));

jest.mock('request', () => (_: never, callback: any) => {
  callback(null, {statusCode: 200}, {access_token: 'supersecure'});
});

describe('utils.network', () => {
  test('oauth handshake', async () => {
    expect(await getOAuthCodeFromBrowser('http://server.com/login', 9001)).toEqual({code: 'foo', state: 'bar'});
    expect(MockServer.mockResponse.writeHead).toHaveBeenCalledWith(302, {Location: 'https://diez.org/signed-in'});
    expect(MockServer.mockResponse.end).toHaveBeenCalled();
    expect(MockServer.mockDestroy).toHaveBeenCalled();
  });

  test('figma oauth', async () => {
    expect(await getFigmaAccessToken()).toBe('supersecure');
    // Security exception on second pass
    await expect(getFigmaAccessToken()).rejects.toThrow();
  });
});
