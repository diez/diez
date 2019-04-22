import commander, {Command} from 'commander';
import {join} from 'path';
import {bootstrap} from '../src/cli';

describe('cli', () => {
  test('basic functionality', async () => {
    await bootstrap(join(__dirname, 'fixtures', 'starting-point'));
    const foobarCommand = commander.commands.find((command: Command) => command.name() === 'foobar');
    expect(foobarCommand).toBeDefined();
    expect(foobarCommand.description()).toBe('Do stuff.');
    // Command should be invoked as `diez foobar`.
    expect(foobarCommand.parent.name()).toBe('diez');
    expect(foobarCommand.parent.parent).toBeUndefined();
  });
});
