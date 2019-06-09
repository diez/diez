const mockFontLoader = jest.fn();
jest.doMock('fontkit', () => ({
  openSync: mockFontLoader,
}));

import {TargetComponentSpec} from '@diez/compiler';
import {File, FileType, Font, Image} from '@diez/prefabs';
import {emptyDirSync, ensureDirSync, ensureFileSync} from 'fs-extra';
import {join} from 'path';
import {fileAssetBinder} from '../src/asset-binders/file';
import {createIosCompilerForFixture, stubProjectRoot} from './helpers';

afterEach(() => {
  emptyDirSync(join(stubProjectRoot, 'assets'));
});

describe('asset binding', () => {
  const mockSpec: TargetComponentSpec = {
    componentName: 'Foobar',
    properties: {},
    public: false,
  };

  test('file handling exceptions', async () => {
    const compiler = await createIosCompilerForFixture('Primitives');

    // Wrong file type for Image host component is an error.
    const illegalImage = new Image({
      file: new File({
        src: '/dev/null',
        type: FileType.Raw,
      }),
    });
    await expect(fileAssetBinder(illegalImage.file, compiler.program, compiler.output, mockSpec)).rejects.toThrow();

    // Wrong file type for Font host component is an error.
    const illegalFont = new Font({
      file: new File({src: '/dev/null', type: FileType.Image}),
    });
    await expect(fileAssetBinder(illegalFont.file, compiler.program, compiler.output, mockSpec)).rejects.toThrow();

    // Fonts are uniquely permitted to have missing sources.
    const fontFile = new File({type: FileType.Font});
    await expect(fileAssetBinder(fontFile, compiler.program, compiler.output, mockSpec)).resolves.toBeUndefined();

    // Fonts must be either TTF or OTF.
    const invalidFontFile = new File({src: '/path/to/font.svg', type: FileType.Font});
    await expect(fileAssetBinder(invalidFontFile, compiler.program, compiler.output, mockSpec)).rejects.toThrow();

    // Unhosted font files are unchecked.
    ensureFileSync(join(compiler.program.projectRoot, 'assets', 'FontName.otf'));
    const unhostedFontFile = new File({src: 'assets/FontName.otf', type: FileType.Font});
    await expect(fileAssetBinder(unhostedFontFile, compiler.program, compiler.output, mockSpec)).resolves
      .toBeUndefined();

    ensureFileSync(join(compiler.program.projectRoot, 'assets', 'CorrectName.ttf'));
    const namedFont = Font.fromFile('assets/CorrectName.ttf', '');

    // We should throw with no name…
    await expect(fileAssetBinder(namedFont.file, compiler.program, compiler.output, mockSpec)).rejects.toThrow();

    // …and with the wrong name…
    mockFontLoader.mockImplementationOnce(() => ({postscriptName: 'WrongName'}));
    namedFont.name = 'CorrectName';
    await expect(fileAssetBinder(namedFont.file, compiler.program, compiler.output, mockSpec)).rejects.toThrow();

    // …and resolve with the correct name.
    mockFontLoader.mockImplementationOnce(() => ({postscriptName: 'CorrectName'}));
    await expect(fileAssetBinder(namedFont.file, compiler.program, compiler.output, mockSpec)).resolves.toBeUndefined();

    // A TrueType collection masquerading as a TrueType font should fail.
    ensureFileSync(join(compiler.program.projectRoot, 'assets', 'Collection.ttf'));
    const collectionFont = Font.fromFile('assets/Collection.ttf', 'Foobar-Italic');
    class TrueTypeCollection {}
    mockFontLoader.mockImplementationOnce(() => new TrueTypeCollection());
    await expect(fileAssetBinder(collectionFont.file, compiler.program, compiler.output, mockSpec)).rejects.toThrow();

    // Directories should fail.
    ensureDirSync(join(compiler.program.projectRoot, 'assets'));
    await expect(fileAssetBinder(
      new File({src: 'assets'}), compiler.program, compiler.output, mockSpec)).rejects.toThrow();
  });
});
