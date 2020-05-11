const mockFontLoader = jest.fn();
jest.doMock('fontkit', () => ({
  openSync: mockFontLoader,
}));

import {Property} from '@diez/compiler-core';
import {File, FileType, Font, Image} from '@diez/prefabs';
import {emptyDirSync, ensureDirSync, ensureFileSync} from 'fs-extra';
import {join} from 'path';
import {fileAssetBinder} from '../src/asset-binders/file';
import {createIosCompilerForFixture, stubProjectRoot} from './helpers';

afterEach(() => {
  emptyDirSync(join(stubProjectRoot, 'assets'));
});

describe('asset binding', () => {
  const mockComponent: any = {
    type: 'Foobar',
    properties: [],
    isRootComponent: false,
    source: '.',
  };

  const mockProperty: Property = {
    name: '',
    isComponent: true,
    depth: 1,
    type: 'File',
    description: {
      body: '',
    },
    references: [],
  };

  test('file handling exceptions', async () => {
    const compiler = await createIosCompilerForFixture('Bindings');

    // Wrong file type for Image host component is an error.
    const illegalImage = new Image({
      file: new File({
        src: '/dev/null',
        type: FileType.Raw,
      }),
    });
    await expect(fileAssetBinder(illegalImage.file, compiler.parser, compiler.output, mockComponent, mockProperty))
      .rejects.toThrow();

    // Wrong file type for Font host component is an error.
    const illegalFont = new Font({
      file: new File({src: '/dev/null', type: FileType.Raw}),
    });
    await expect(fileAssetBinder(illegalFont.file, compiler.parser, compiler.output, mockComponent, mockProperty))
      .rejects.toThrow();

    // Fonts are uniquely permitted to have missing sources.
    const fontFile = new File({type: FileType.Font});
    await expect(fileAssetBinder(fontFile, compiler.parser, compiler.output, mockComponent, mockProperty))
      .resolves.toBeUndefined();

    // Fonts must be either TTF or OTF.
    const invalidFontFile = new File({src: '/path/to/font.svg', type: FileType.Font});
    await expect(fileAssetBinder(invalidFontFile, compiler.parser, compiler.output, mockComponent, mockProperty))
      .rejects.toThrow();

    // Unhosted font files are unchecked.
    ensureFileSync(join(compiler.parser.projectRoot, 'assets', 'FontName.otf'));
    const unhostedFontFile = new File({src: 'assets/FontName.otf', type: FileType.Font});
    await expect(fileAssetBinder(unhostedFontFile, compiler.parser, compiler.output, mockComponent, mockProperty))
      .resolves
      .toBeUndefined();

    ensureFileSync(join(compiler.parser.projectRoot, 'assets', 'CorrectName.ttf'));
    const namedFont = Font.fromFile('assets/CorrectName.ttf', '');

    // We should throw with no name...
    await expect(fileAssetBinder(namedFont.file, compiler.parser, compiler.output, mockComponent, mockProperty))
      .rejects.toThrow();

    // ...and with the wrong name...
    mockFontLoader.mockImplementationOnce(() => ({postscriptName: 'WrongName'}));
    namedFont.name = 'CorrectName';
    await expect(fileAssetBinder(namedFont.file, compiler.parser, compiler.output, mockComponent, mockProperty))
      .rejects.toThrow();

    // ...and resolve with the correct name.
    mockFontLoader.mockImplementationOnce(() => ({postscriptName: 'CorrectName'}));
    await expect(fileAssetBinder(namedFont.file, compiler.parser, compiler.output, mockComponent, mockProperty))
      .resolves.toBeUndefined();

    // A TrueType collection masquerading as a TrueType font should fail.
    ensureFileSync(join(compiler.parser.projectRoot, 'assets', 'Collection.ttf'));
    const collectionFont = Font.fromFile('assets/Collection.ttf', 'Foobar-Italic');
    class TrueTypeCollection {}
    mockFontLoader.mockImplementationOnce(() => new TrueTypeCollection());
    await expect(fileAssetBinder(collectionFont.file, compiler.parser, compiler.output, mockComponent, mockProperty))
      .rejects.toThrow();

    // Directories should fail.
    ensureDirSync(join(compiler.parser.projectRoot, 'assets'));
    await expect(fileAssetBinder(
      new File({src: 'assets'}), compiler.parser, compiler.output, mockComponent, mockProperty))
        .rejects.toThrow();

    // Missing Image files should use a fallback
    const missingImageFile = new File({src: '/path/to/missing-image.jpg', type: FileType.Image});
    await expect(fileAssetBinder(missingImageFile, compiler.parser, compiler.output, mockComponent, mockProperty))
      .resolves.toBeUndefined();
  });
});
