import {findPlugins} from '@diez/cli-core';
import {Target} from '@diez/engine';
import {join} from 'path';
import {getAssemblerFactory, getProjectRoot, getTargets} from '../src/utils';

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

  test('assembler factory', async () => {
    expect(getAssemblerFactory(Target.Android)).rejects.toThrow();

    const plugins = await findPlugins();
    plugins.set('.', {
      providers: {
        assemblers: {
          [Target.Android]: './test/assembler',
        },
      },
    });

    expect(await getAssemblerFactory(Target.Android)).toBe(require('./assembler'));
  });
});
