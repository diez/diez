const mockParse = jest.fn();
jest.doMock('commander', () => {
  const commander = jest.requireActual('commander');
  commander.parse = mockParse;
  return commander;
});

import {assignMock, diezRun} from '../src/utils';

describe('mock helpers', () => {
  test('assignMock', () => {
    const originalExit = process.exit;
    const {mock, restore} = assignMock(process, 'exit');
    expect(process.exit).not.toBe(originalExit);
    // This shouldn't actually exit!
    process.exit(1);
    expect(mock).toHaveBeenCalledWith(1);
    restore();
    expect(process.exit).toBe(originalExit);
  });

  test('assignMock - no original property to replace', () => {
    expect(Object.getOwnPropertyDescriptor(process, 'meow')).toBeUndefined();
    const {mock, restore} = assignMock(process, 'meow');
    expect(Object.getOwnPropertyDescriptor(process, 'meow')).toBeDefined();
    // @ts-ignore
    process.meow();
    expect(mock).toHaveBeenCalled();
    restore();
  });

  test('diezRun', async () => {
    // tslint:disable-next-line: no-implicit-dependencies
    const cliCore = await import('@diez/cli-core');
    const {mock} = assignMock(cliCore, 'bootstrap');
    await diezRun(' foo --bar', 'baz');
    expect(cliCore.bootstrap).toHaveBeenCalledWith(global.process.cwd(), 'baz');
    expect(mockParse).toHaveBeenCalledWith(['node', 'diez', 'foo', '--bar']);

    mock.mockRejectedValueOnce('failure');
    expect(diezRun('')).rejects.toThrow();
  });
});
