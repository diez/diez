import {cleanupMockOsData, mockOsData} from '@diez/test-utils';
import {join} from 'path';
import {execAsync, findPlugins, isMacOS} from '../src/utils';

jest.mock('os');
jest.unmock('fs-extra');

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
    expect(await execAsync('echo " foobar "')).toBe('foobar');
  });

  test('isMacOS', async () => {
    expect(isMacOS()).toBe(false);
    mockOsData.platform = 'darwin';
    expect(isMacOS()).toBe(true);
  });
});
