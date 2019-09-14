import {findPlugins} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {dirname, join, resolve} from 'path';
import {getCoreFiles, getProjectRoot, getTargets} from '../src/utils';

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

  test('project root detection', async () => {
    expect(await getProjectRoot()).toBe(global.process.cwd());
    const plugins = await findPlugins();
    plugins.set('.', {
      projectRoot: './foobar',
    });
    expect(await getProjectRoot()).toBe(join(global.process.cwd(), 'foobar'));
  });

  test('core files', async () => {
    const plugins = await findPlugins();
    // Shim in some local core files.
    plugins.get('.')!.coreFiles = {
      [Target.Android]: ['abc', '123'],
    };

    // Shim in some foreign core files.
    plugins.set('@diez/test-utils', {
      coreFiles: {[Target.Ios]: ['def', '456']},
    });

    expect(await getCoreFiles(Target.Web)).toEqual([]);

    const localPath = resolve(__dirname, '..');
    expect(await getCoreFiles(Target.Android)).toEqual([`${localPath}/abc`, `${localPath}/123`]);
    // The second query should draw from the cache.
    expect(await getCoreFiles(Target.Android)).toEqual([`${localPath}/abc`, `${localPath}/123`]);

    const testUtilsPath = dirname(require.resolve('@diez/test-utils/package.json'));
    expect(await getCoreFiles(Target.Ios)).toEqual([`${testUtilsPath}/def`, `${testUtilsPath}/456`]);
  });
});
