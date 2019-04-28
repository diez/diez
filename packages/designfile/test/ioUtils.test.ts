import {cleanupMockCommandData, cleanupMockOsData, mockExec, mockOsData} from '@diez/test-utils';
import {RequestListener} from 'http';
import {getOAuthCodeFromBrowser, locateBinaryMacOS} from '../src/helpers/ioUtils';

jest.mock('@diez/cli');
jest.mock('open');
jest.mock('os');

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
  createServer (listener: RequestListener) {
    return new MockServer(listener);
  },
}));

describe('ioUtils', () => {
  test('oauth handshake', async () => {
    mockOsData.platform = 'darwin';
    expect(await getOAuthCodeFromBrowser('http://server.com/login', 9001)).toEqual({code: 'foo', state: 'bar'});
    expect(MockServer.mockResponse.writeHead).toHaveBeenCalledWith(302, {Location: 'https://www.haiku.ai/'});
    expect(MockServer.mockResponse.end).toHaveBeenCalled();
    expect(MockServer.mockDestroy).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalledWith('open -b com.apple.Terminal');
  });

  test('locate binary', () => {
    mockOsData.platform = 'darwin';
    locateBinaryMacOS('com.foo.bar');
    expect(mockExec).toHaveBeenCalledWith('mdfind kMDItemCFBundleIdentifier=com.foo.bar');
  });

  test('locate binary failure', async () => {
    mockOsData.platform = 'windows-vista';
    await expect(locateBinaryMacOS('com.foo.bar')).rejects.toThrow();
  });
});
