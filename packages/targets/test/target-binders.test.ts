import {TargetComponentSpec} from '@diez/compiler';
import {Image} from '@diez/prefabs';
import {assetsBinder as androidImageBinder} from '../src/bindings/Image/android';
import {assetsBinder as iosImageBinder} from '../src/bindings/Image/ios';
import {createAndroidCompilerForFixture, createIosCompilerForFixture} from './helpers';

const mockSpec: TargetComponentSpec = {
  componentName: 'Foobar',
  properties: {},
  public: false,
};

describe('android image binding', () => {
  test('Android images are not bound in hot mode', async () => {
    const compiler = await createAndroidCompilerForFixture('Primitives');
    compiler.program.hot = true;
    await androidImageBinder!(new Image(), compiler.program, compiler.output, mockSpec);
    expect(compiler.output.resources.size).toBe(0);
  });
});

// TODO: add meaningful tests for iOS image catalog constructions.
describe('ios image binding', () => {
  test('iOS images are not bound in hot mode', async () => {
    const compiler = await createIosCompilerForFixture('Primitives');
    compiler.program.hot = true;
    await iosImageBinder!(new Image(), compiler.program, compiler.output, mockSpec);
    expect(compiler.output.assetBindings.size).toBe(0);
  });
});
