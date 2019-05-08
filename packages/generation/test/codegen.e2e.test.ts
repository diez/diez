import {getTempFileName} from '@diez/compiler';
import {registerExpectations} from '@diez/test-utils';
import {copySync} from 'fs-extra';
import {join, resolve} from 'path';
import {codegenDesignSystem, createDesignSystemSpec} from '../src/utils';

registerExpectations();
jest.unmock('fs-extra');

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

    spec.textStyles.push(
      {
        name: '',
        initializer: '0',
      },
      {
        name: 'Some Text Style',
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

    await codegenDesignSystem(spec);

    expect(projectRoot).toMatchDirectory(join(__dirname, 'goldens', 'codegennable'));
  });
});
