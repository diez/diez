import {findPlugins} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {getTargets} from '../src/utils';

describe('utils', () => {
  test('target discovery', async () => {
    const plugins = await findPlugins();
    plugins.set('.', {
      providers: {
        targets: [
          './test/target',
        ],
      },
    });
    const targets = await getTargets();
    expect(targets.has('test' as Target)).toBe(true);
  });
});
