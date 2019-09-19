import {TargetComponentSpec, TargetProperty} from '@diez/compiler-core';
import {Image} from '@diez/prefabs';
import {assetsBinder as androidImageBinder} from '../src/bindings/Image/android';
import {assetsBinder as iosImageBinder} from '../src/bindings/Image/ios';
import {createAndroidCompilerForFixture, createIosCompilerForFixture} from './helpers';

const mockSpec: TargetComponentSpec = {
  componentName: 'Foobar',
  properties: {},
  public: false,
};

const mockTargetProperty: TargetProperty = {
  name: '',
  isComponent: true,
  depth: 1,
  type: 'Image',
  description: {
    body: '',
  },
};

describe('android image binding', () => {
  test('Android images are not bound in hot mode', async () => {
    const compiler = await createAndroidCompilerForFixture('Bindings');
    compiler.parser.hot = true;
    await androidImageBinder!(new Image(), compiler.parser, compiler.output, mockSpec, mockTargetProperty);
    expect(compiler.output.resources.size).toBe(0);
  });
});

// TODO: add meaningful tests for iOS image catalog constructions.
describe('ios image binding', () => {
  test('iOS images are not bound in hot mode', async () => {
    const compiler = await createIosCompilerForFixture('Bindings');
    compiler.parser.hot = true;
    await iosImageBinder!(new Image(), compiler.parser, compiler.output, mockSpec, mockTargetProperty);
    expect(compiler.output.assetBindings.size).toBe(0);
  });
});
