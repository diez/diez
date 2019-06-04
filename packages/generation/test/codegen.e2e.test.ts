import {getTempFileName} from '@diez/storage';
import {registerExpectations} from '@diez/test-utils';
import {copySync} from 'fs-extra';
import {join, resolve} from 'path';
import {AssetFolder} from '../src/api';
import {codegenDesignSystem, createDesignSystemSpec, registerAsset} from '../src/utils';

registerExpectations();

describe('codegen.e2e', () => {
  test('generates the expected code', async () => {
    const projectRoot = getTempFileName();
    copySync(resolve(__dirname, 'fixtures', 'codegennable'), projectRoot);
    const spec = createDesignSystemSpec(
      'My Design System',
      join(projectRoot, 'assets'),
      join(projectRoot, 'src', 'index.ts'),
      projectRoot,
    );

    spec.fontNames.add('SomeFont-BoldItalic');
    spec.fontRegistry.add(resolve(__dirname, 'fixtures', 'fonts', 'font.ttf'));

    spec.typographs.push(
      {
        name: '',
        initializer: '0',
      },
      {
        name: 'Some Typograph',
        initializer: '1',
      },
    );

    spec.colors.push(
      {
        name: '',
        initializer: '2',
      },
      {
        name: 'Some Color',
        initializer: '3',
      },
    );

    registerAsset(
      {
        src: 'assets/blah/Foobar.png',
        width: 640,
        height: 480,
      },
      AssetFolder.Slice,
      spec.assets,
    );

    registerAsset(
      {
        src: 'assets/blah/Bazbat.png',
        width: 320,
        height: 240,
      },
      AssetFolder.Slice,
      spec.assets,
    );

    await codegenDesignSystem(spec);

    expect(projectRoot).toMatchDirectory(join(__dirname, 'goldens', 'codegennable'));
  });
});
