import commander, {Command} from 'commander';
import {bootstrap} from '../src/cli';
import {resolveFixtureModules, restoreModules} from './helpers';

beforeAll(resolveFixtureModules);
afterAll(restoreModules);

describe('cli', () => {
  test('basic functionality', async () => {
    await bootstrap();
    const foobarCommand = commander.commands.find((command: Command) => command.name() === 'foobar');
    expect(foobarCommand).toBeDefined();
    expect(foobarCommand.description()).toBe('Do stuff.');
    // Command should be invoked as `diez foobar`.
    expect(foobarCommand.parent.name()).toBe('diez');
    expect(foobarCommand.parent.parent).toBeUndefined();
  });
});
