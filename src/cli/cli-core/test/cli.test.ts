class MockSentry {
  static mockClose = jest.fn();
  static mockSetUser = jest.fn();
  static mockSetExtra = jest.fn();
  static mockGetClient = jest.fn().mockImplementation((() => ({close: MockSentry.mockClose})));
  static captureException = jest.fn();
  static init = jest.fn();
  static configureScope = jest.fn().mockImplementation((callback) => callback({
    setUser: MockSentry.mockSetUser,
    setExtra: MockSentry.mockSetExtra,
  }));
  static getCurrentHub = jest.fn().mockImplementation(() => ({getClient: MockSentry.mockGetClient}));
}
jest.doMock('@sentry/node', () => MockSentry);

import {assignMock} from '@diez/test-utils';
import commander, {Command} from 'commander';
import {join} from 'path';
import {bootstrap, run} from '../src/cli';
import {mockAction, mockBooleanValidator, mockPreinstall, mockStringValidator} from './fixtures/mocks';

let analyticsEnabled: boolean | undefined = false;

beforeAll(async (done) => {
  await bootstrap(join(__dirname, 'fixtures', 'starting-point'), __dirname);
  done();
});

beforeEach(() => {
  assignMock(process, 'exit');
  analyticsEnabled = false;
});

jest.mock('@diez/storage', () => ({
  ...jest.requireActual('@diez/storage'),
  Registry: {
    get (key: string) {
      switch (key) {
        case 'analyticsEnabled':
          return analyticsEnabled;
        case 'uuid':
          return 'user-1';
        default:
          throw new Error(`Unexpected key: ${key}`);
      }
    },
    set: jest.fn(),
  },
  emitDiagnostics: jest.fn().mockRejectedValue('noop'),
}));

describe('cli', () => {
  test('command registration', async () => {
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

  test('sentry e2e', async () => {
    delete process.env.DIEZ_DO_NOT_TRACK;
    analyticsEnabled = true;
    process.argv = ['node', 'diez', 'foobar', '--stringParam', 'foo'];

    // Simulate the actual behaviors of Sentry.
    mockAction.mockRejectedValueOnce({
      exception: {
        values: [{
          stacktrace: {
            frames: [
              {filename: 'path/to/@diez/packagename/lib/filename.js'},
            ],
          },
        }],
      },
    });

    const eventTrap = jest.fn();
    // beforeSend() should be called when we captureException().
    MockSentry.init.mockImplementation(({beforeSend}: any) => {
      MockSentry.captureException.mockImplementation((event) => {
        eventTrap(beforeSend(event));
      });
    });

    await run();
    expect(MockSentry.mockSetExtra).toHaveBeenCalledWith('command_arguments', 'foobar --stringParam foo');

    process.nextTick(() => {
      expect(eventTrap).toHaveBeenCalledWith({
        exception: {
          values: [{
            stacktrace: {
              frames: [
                {filename: 'app:///@diez/packagename/lib/filename.js'},
              ],
            },
          }],
        },
      });
      expect(MockSentry.mockClose).toHaveBeenCalledWith(1000);
    });
  });
});
