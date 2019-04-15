import {findPlugins} from '../src';
import {resolveFixtureModules, restoreModules} from './helpers';

beforeAll(resolveFixtureModules);
afterAll(restoreModules);

describe('utils', () => {
  test('findPlugins', async () => {
    const plugins = await findPlugins('starting-point');
    expect(plugins.has('command-provider')).toBe(true);
  });
});
