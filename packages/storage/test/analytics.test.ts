import {cleanupMockFileSystem, mockFsExtraFactory} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);
const mockFetch = jest.fn();
jest.doMock('node-fetch', () => mockFetch);
import {arch, platform} from 'os';
import {disableAnalytics, emitDiagnostics, enableAnalytics} from '../src/analytics';
import {Registry} from '../src/registry';

jest.mock('uuid', () => ({
  v4 () {
    return 'secret-id';
  },
}));

afterEach(() => {
  cleanupMockFileSystem();
  mockFetch.mockReset();
  Registry.reset();
});

describe('analytics', () => {
  test('analytics event emit throws when disabled', async () => {
    await expect(emitDiagnostics('some-event', '10.10.10', {extra: 'data'})).rejects.toThrow();
  });

  test('enable/disable analytics', async () => {
    expect(await Registry.get('analyticsEnabled')).toBeUndefined();
    expect(await Registry.get('uuid')).toBeUndefined();
    await enableAnalytics();
    expect(await Registry.get('analyticsEnabled')).toBe(true);
    expect(await Registry.get('uuid')).toBe('secret-id');
    await disableAnalytics();
    expect(await Registry.get('analyticsEnabled')).toBe(false);
    expect(await Registry.get('uuid')).toBeUndefined();
  });

  test('emit analytics event', async () => {
    await enableAnalytics();
    expect(await Registry.get('analyticsEnabled')).toBe(true);
    expect(await Registry.get('uuid')).toBe('secret-id');
    process.argv = ['node', 'diez', 'do', '--something'];
    await emitDiagnostics('some-event', '10.10.10', {extra: 'data'});
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://analytics.diez.org/ping',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'some-event',
          uuid: 'secret-id',
          properties: {
            diezVersion: '10.10.10',
            commandArguments: 'do --something',
            platform: platform(),
            arch: arch(),
            nodeVersion: process.version,
            extra: 'data',
          },
        }),
      },
    );
  });
});
