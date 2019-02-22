// @ts-ignore
import {__cleanup, __fileSystem, writeFile} from 'fs-extra';
import {join} from 'path';
import * as ioUtils from '../../src/helpers/ioUtils';

jest.mock('fs-extra');
jest.mock('opn');

beforeEach(() => {
  __cleanup();
});

const svgWrap = (base64: string) => {
  return `<svg><image xlink:href="data:image/png;base64,${base64}"></image></svg>`;
};

const pixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const processedPixel =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4AWNg+M9QDwADgQF/Vry1+wAAAABJRU5ErkJggg==';
const file1 = {content: svgWrap(pixel), fullPath: 'full/path/', name: 'file-one.svg'};
const file2 = {content: 'file two content', fullPath: 'full/path/nested', name: 'file/two.svg'};
const file3 = {content: 'file three content', fullPath: 'full/path/nested', name: 'file/three.png'};

beforeEach(() => {
  __cleanup();
});

describe('#escapeShell', () => {
  test('', () => {
    expect(ioUtils.escapeShell('my/super/path')).toBe('my\/super\/path');
  });
});

describe('#adjustImageGamma', () => {
  test('if the file format is not SVG, it returs the base64 data intact', () => {
    expect(ioUtils.adjustImageGamma(pixel, ioUtils.IMAGE_FORMATS.svg)).toBe(pixel);
    expect(ioUtils.adjustImageGamma(pixel, ioUtils.IMAGE_FORMATS.jpg)).toBe(pixel);
  });

  test('properly corrects the gamma of a png', () => {
    expect(ioUtils.adjustImageGamma(pixel, ioUtils.IMAGE_FORMATS.png)).toBe(processedPixel);
  });

  test('does not choke on invalid data values', () => {
    expect(ioUtils.adjustImageGamma('', ioUtils.IMAGE_FORMATS.png)).toBe('');
    expect(ioUtils.adjustImageGamma('invalidvalue', ioUtils.IMAGE_FORMATS.png)).toBe('invalidvalue');
  });

  test('does not parse svg or jpg files', () => {
    expect(ioUtils.adjustImageGamma('content', ioUtils.IMAGE_FORMATS.svg)).toBe('content');
    expect(ioUtils.adjustImageGamma('content', ioUtils.IMAGE_FORMATS.jpg)).toBe('content');
  });
});

describe('#sanitizeFileName', () => {
  test('replaces slashes with dashes', () => {
    expect(ioUtils.sanitizeFileName('my / file / name')).toBe('my - file - name');
  });

  test('does not modify file names without invalid characters', () => {
    expect(ioUtils.sanitizeFileName('valid-file-name')).toBe('valid-file-name');
  });

  test('returns an empty string if the filename provided is not an string', () => {
    expect(ioUtils.sanitizeFileName(null as unknown as string)).toBe('');
  });
});

describe('#generateRandomScriptPath', () => {
  test('does not returns two consecutive equal paths', () => {
    expect(ioUtils.generateRandomFilePath()).not.toEqual(ioUtils.generateRandomFilePath());
  });

  test('accepts an extension argument', () => {
    expect(ioUtils.generateRandomFilePath('svg')).toContain('.svg');
  });
});

describe('#createFolders', () => {
  test('creates the provided root in disk', async () => {
    await ioUtils.createFolders('out/path', new Map([[0, 'content/slices'], [1, 'content/artboards']]));
    expect(__fileSystem['out/path']).toBe('FOLDER');
  });

  test('creates the provided folders inside the root folder in disk', async () => {
    await ioUtils.createFolders('out/path', new Map([[0, 'content/slices'], [1, 'content/artboards']]));
    expect(__fileSystem['out/path/content/slices']).toBe('FOLDER');
    expect(__fileSystem['out/path/content/artboards']).toBe('FOLDER');
  });
});

describe('#fixGammaOfPNGFiles', () => {
  test('fixes the gamma values of a png embedded in a svg file', async () => {
    await writeFile(join(file1.fullPath, ioUtils.sanitizeFileName(file1.name)), file1.content);
    await writeFile(join(file2.fullPath, ioUtils.sanitizeFileName(file2.name)), file2.content);
    await writeFile(join(file3.fullPath, ioUtils.sanitizeFileName(file3.name)), file3.content);
    await ioUtils.fixGammaOfPNGFiles('full/path');
    expect(__fileSystem['full/path/file-one.svg']).toBe(svgWrap(processedPixel));
    expect(__fileSystem['full/path/nested/file-two.svg']).toBe(file2.content);
  });
});
