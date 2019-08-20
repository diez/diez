import {findPlugins} from '@diez/cli-core';
import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
import {printWarnings} from '../src/utils';
import {createProgramForFixture, TestTargetCompiler} from './helpers';

registerExpectations();

describe('bindings', () => {
  test('assets and writeout', async () => {
    const plugins = await findPlugins();
    // Shim in our BoundComponent binding.
    plugins.get('.')!.bindings = {
      '.:BoundComponent': {
        test: './test/fixtures/Bindings/BoundComponent.binding',
      },
      // (This should fail without crashing.)
      '.:Bindings': {
        test: '/dev/null',
      },
    };

    plugins.set(
      'random',
      {
        bindings: {
          // (This should be skipped without crashing.)
          '.:BoundComponent': {
            test: '/dev/null',
          },
        },
      },
    );

    const program = await createProgramForFixture('Bindings');
    expect(program.targetComponents.size).toBe(2);
    expect(Array.from(program.localComponentNames)).toEqual(['BoundComponent', 'Bindings']);
    expect(Array.from(program.singletonComponentNames)).toEqual(['Bindings']);
    const compiler = new TestTargetCompiler(program);
    compiler.staticRoot = join(compiler.output.sdkRoot, 'static');
    await compiler.start();
    expect(Array.from(compiler.output.assetBindings)).toEqual([
      ['foo', {contents: 'bar'}],
      ['baz', expect.objectContaining({copy: true})],
    ]);

    compiler.writeAssets();
    expect(join(program.projectRoot, 'build')).toMatchDirectory(join(__dirname, 'goldens', 'bindings-output'));
    printWarnings(program.targetComponents);
  });
});
