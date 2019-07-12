import {mockCanRunCommand, mockCliCoreFactory, mockExec, registerExpectations} from '@diez/test-utils';
jest.doMock('@diez/cli-core', mockCliCoreFactory);

import {dirname, join, resolve} from 'path';

const ttfFont = resolve(__dirname, 'fixtures', 'fonts', 'font.ttf');
const ttcFont = resolve(__dirname, 'fixtures', 'fonts', 'font.ttc');

const mockGetFont = jest.fn();
jest.doMock('fontkit', () => ({
  openSync (filename: string) {
    switch (filename) {
      case ttfFont:
        return {postscriptName: 'SomeFont-BoldItalic'};
      case ttcFont:
        class TrueTypeCollection {
          getFont = mockGetFont;
        }
        return new TrueTypeCollection();
      default:
        throw new Error('Unexpected font filename.');
    }
  },
}));

import {getTempFileName} from '@diez/storage';
import {copySync, writeFileSync} from 'fs-extra';
import {AssetFolder} from '../src/api';
import {codegenDesignSystem, createDesignSystemSpec, registerAsset, registerFont} from '../src/utils';

beforeAll(() => {
  // Allow 1 minute per test.
  jest.setTimeout(6e4);
});

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

    await registerFont(
      {
        family: 'Some Font',
        style: 'BoldItalic',
        name: 'SomeFont-BoldItalic',
        path: ttfFont,
      },
      spec.fonts,
    );

    const tryRegisterTtcFont = () => registerFont(
      {
        family: 'Some Font',
        style: 'Extra Medium',
        name: 'SomeFont-ExtraMedium',
        path: ttcFont,
      },
      spec.fonts,
    );

    mockGetFont.mockImplementationOnce(() => null);
    await expect(tryRegisterTtcFont()).rejects.toThrow();

    mockGetFont.mockImplementation(() => true);
    mockCanRunCommand.mockResolvedValueOnce(false);
    await tryRegisterTtcFont();
    expect(spec.fonts.get('SomeFont')!.get('ExtraMedium')!.path).toBeUndefined();

    mockCanRunCommand.mockResolvedValue(true);
    await tryRegisterTtcFont();
    expect(spec.fonts.get('SomeFont')!.get('ExtraMedium')!.path).toBeUndefined();
    await codegenDesignSystem(spec);

    mockExec.mockImplementation((command: string) => {
      const fontFile = command.split(' ')[1];
      writeFileSync(join(dirname(fontFile), 'SomeFont-ExtraMedium.ttf'), 'Font collection content.');
    });
    await tryRegisterTtcFont();

    expect(mockGetFont).toHaveBeenCalledWith('SomeFont-ExtraMedium');

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

    spec.gradients.push(
      {
        name: '',
        initializer: '4',
      },
      {
        name: 'Some Gradient',
        initializer: '5',
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
