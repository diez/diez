import {findPlugins} from '../src';

describe('utils', () => {
  test('findPlugins', async () => {
    const plugins = await findPlugins('starting-point');
    expect(plugins.has('command-provider')).toBe(true);
  });
});
