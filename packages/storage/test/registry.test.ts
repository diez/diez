import {cleanupMockFileSystem, mockFileSystem} from '@diez/test-utils';
import {homedir} from 'os';
import {join} from 'path';
import {Registry} from '../src/registry';

jest.mock('fs-extra');

afterEach(cleanupMockFileSystem);

describe('Registry', () => {
  test('basic functionality', async () => {
    await Registry.set('figmaAccessToken', 'supersecret');
    expect(mockFileSystem[join(homedir(), '.diez')]).toBe('FOLDER');
    expect(mockFileSystem[join(homedir(), '.diez', 'registry.json')]).toBe('{"figmaAccessToken":"supersecret"}');

    expect(await Registry.get('figmaAccessToken')).toBe('supersecret');
  });
});
