import {findPlugins} from '@diez/cli-core';
import {registerExpectations} from '@diez/test-utils';
import {join} from 'path';
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
    };

    const program = await createProgramForFixture('Bindings');
    expect(program.targetComponents.size).toBe(2);
    expect(program.localComponentNames).toEqual(['BoundComponent', 'Bindings']);
    const compiler = new TestTargetCompiler(program);
    compiler.staticRoot = join(compiler.output.sdkRoot, 'static');
    await compiler.start();
    expect(Array.from(compiler.output.assetBindings)).toEqual([
      ['foo', {contents: 'bar'}],
      ['baz', expect.objectContaining({copy: true})],
    ]);

    compiler.writeAssets();
    expect(join(program.projectRoot, 'build')).toMatchDirectory(join(__dirname, 'goldens', 'bindings-output'));
  });
});
