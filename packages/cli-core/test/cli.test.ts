import {assignMock} from '@diez/test-utils';
import commander, {Command} from 'commander';
import {join} from 'path';
import {bootstrap, run} from '../src/cli';
import {mockAction, mockBooleanValidator, mockPreinstall, mockStringValidator} from './fixtures/mocks';

beforeEach(() => {
  assignMock(process, 'exit');
});

jest.mock('@diez/storage', () => ({
  ...jest.requireActual('@diez/storage'),
  Registry: {
    get: jest.fn(),
    set: jest.fn(),
  },
  emitDiagnostics: jest.fn().mockRejectedValue('noop'),
}));

describe('cli', () => {
  test('command registration', async () => {
    await bootstrap(join(__dirname, 'fixtures', 'starting-point'), __dirname);
    const foobarCommand = commander.commands.find((command: Command) => command.name() === 'foobar');
    expect(foobarCommand).toBeDefined();
    expect(foobarCommand.description()).toBe('Do stuff.');
    expect(foobarCommand.parent.name()).toBe('diez');
    expect(foobarCommand.parent.parent).toBeUndefined();
  });

  test('command e2e', async () => {
    // "booleanParam": true is provided in `.diezrc` of ./fixtures/starting-point
    // "stringParam": "baz" is provided in `.diezrc`, but overridden at calltime
    process.argv = ['node', 'diez', 'foobar', '--stringParam', 'foo'];
    mockAction.mockRejectedValueOnce('<fake error>');
    await run();
    process.nextTick(() => {
      expect(mockAction).toHaveBeenCalled();
      expect(mockAction).toHaveBeenCalledWith(
        expect.objectContaining({
          stringParam: 'foo',
          booleanParam: true,
        }),
        expect.anything(),
        expect.anything(),
      );
      expect(mockStringValidator).toHaveBeenCalledWith(expect.objectContaining({stringParam: 'foo'}));
      expect(mockBooleanValidator).toHaveBeenCalledWith(expect.objectContaining({booleanParam: true}));
      expect(mockPreinstall).toHaveBeenCalled();
    });
  });
});
