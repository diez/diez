import {cleanupMockOsData, mockOsData, mockOsFactory} from '@diez/test-utils';
jest.doMock('os', mockOsFactory);

import {join} from 'path';
import {canRunCommand, execAsync, findPlugins, isMacOS} from '../src/utils';

beforeEach(() => {
  cleanupMockOsData();
});

describe('utils', () => {
  test('findPlugins', async () => {
    const plugins = await findPlugins(join(__dirname, 'fixtures', 'starting-point'));
    expect(plugins.has('command-provider')).toBe(true);
  });

  test('execAsync', async () => {
    await expect(execAsync('nonexistentcommand')).rejects.toThrow();
    expect(await canRunCommand('nonexistentcommand')).toBe(false);
    expect(await execAsync('echo " foobar "')).toBe('foobar');
    expect(await canRunCommand('echo " foobar "')).toBe(true);
  });

  test('isMacOS', async () => {
    expect(isMacOS()).toBe(false);
    mockOsData.platform = 'darwin';
    expect(isMacOS()).toBe(true);
  });
});
