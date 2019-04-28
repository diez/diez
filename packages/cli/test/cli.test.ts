import {assignMock} from '@diez/test-utils';
import commander, {Command} from 'commander';
import {join} from 'path';
import {bootstrap, run} from '../src/cli';
import {mockAction, mockBooleanValidator, mockStringValidator} from './fixtures/mocks';

beforeEach(() => {
  assignMock(process, 'exit');
});

jest.unmock('fs-extra');

jest.mock('package-json', () => {
  const mock = jest.fn();
  // Covers all nag scenarios.
  mock.mockImplementationOnce(() => ({version: '1000.1000.1000'}));
  mock.mockRejectedValueOnce('<fake error>');
  mock.mockImplementation(() => ({version: '0.0.0'}));
  return mock;
});

describe('cli', () => {
  test('command registration', async () => {
    await bootstrap(join(__dirname, 'fixtures', 'starting-point'));
    const foobarCommand = commander.commands.find((command: Command) => command.name() === 'foobar');
    expect(foobarCommand).toBeDefined();
    expect(foobarCommand.description()).toBe('Do stuff.');
    expect(foobarCommand.parent.name()).toBe('diez');
    expect(foobarCommand.parent.parent).toBeUndefined();
  });

  test('command e2e', async () => {
    process.argv = ['node', 'diez', 'foobar', '--stringParam', 'foo', '--booleanParam'];
    mockAction.mockRejectedValueOnce('<fake error>');
    await run();
    expect(mockAction).toHaveBeenCalled();
    expect(mockAction).toHaveBeenCalledWith(
      expect.objectContaining({
        stringParam: 'foo',
        booleanParam: true,
      }),
      expect.anything(),
      expect.anything(),
    );
    expect(mockStringValidator).toHaveBeenCalledWith('foo');
    expect(mockBooleanValidator).toHaveBeenCalledWith(true);
  });
});
