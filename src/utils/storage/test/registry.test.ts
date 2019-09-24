import {cleanupMockFileSystem, mockFileSystem, mockFsExtraFactory} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);

import {homedir} from 'os';
import {join} from 'path';
import {Registry} from '../src/registry';

afterEach(cleanupMockFileSystem);

declare module '../src/api' {
  interface DiezRegistryOptions {
    foo: string;
  }
}

describe('Registry', () => {
  test('basic functionality', async () => {
    await Registry.set({foo: 'bar'});
    expect(mockFileSystem[join(homedir(), '.diez')]).toBe('FOLDER');
    expect(mockFileSystem[join(homedir(), '.diez', 'registry.json')]).toBe('{"foo":"bar"}');

    expect(await Registry.get('foo')).toBe('bar');

    await Registry.delete('foo');
    expect(mockFileSystem[join(homedir(), '.diez', 'registry.json')]).toBe('{}');
  });
});
