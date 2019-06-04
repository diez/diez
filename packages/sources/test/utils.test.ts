import {cleanupMockFileSystem, mockFileSystem, mockFsExtraFactory} from '@diez/test-utils';
jest.doMock('fs-extra', mockFsExtraFactory);

import {AssetFolder} from '@diez/generation';
import {writeFile} from 'fs-extra';
import {join} from 'path';
import {ImageFormats} from '../src/api';
import {
  adjustImageGamma,
  chunk,
  createFolders,
  escapeShell,
  fixGammaOfSVGs,
  generateRandomFilePath,
  sanitizeFileName,
} from '../src/utils';

jest.mock('fs-walk');
jest.mock('open');

afterEach(cleanupMockFileSystem);

describe('arrayUtils', () => {
  test('chunk splits an array into chunks of `chunkSize` elements', () => {
    expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
    expect(chunk([1, 2, 3], 1)).toEqual([[1], [2], [3]]);
  });
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

describe('escapeShell', () => {
  test('', () => {
    expect(escapeShell('my/super/path')).toBe('my\/super\/path');
  });
});

describe('adjustImageGamma', () => {
  test('if the file format is not SVG, it returs the base64 data intact', () => {
    expect(adjustImageGamma(pixel, ImageFormats.svg)).toBe(pixel);
    expect(adjustImageGamma(pixel, ImageFormats.jpg)).toBe(pixel);
  });

  test('properly corrects the gamma of a png', () => {
    expect(adjustImageGamma(pixel, ImageFormats.png)).toBe(processedPixel);
  });

  test('does not choke on invalid data values', () => {
    expect(adjustImageGamma('', ImageFormats.png)).toBe('');
    expect(adjustImageGamma('invalidvalue', ImageFormats.png)).toBe('invalidvalue');
  });

  test('does not parse svg or jpg files', () => {
    expect(adjustImageGamma('content', ImageFormats.svg)).toBe('content');
    expect(adjustImageGamma('content', ImageFormats.jpg)).toBe('content');
  });
});

describe('sanitizeFileName', () => {
  test('replaces slashes with dashes', () => {
    expect(sanitizeFileName('my / file / name')).toBe('my - file - name');
  });

  test('does not modify file names without invalid characters', () => {
    expect(sanitizeFileName('valid-file-name')).toBe('valid-file-name');
  });

  test('returns an empty string if the filename provided is not an string', () => {
    expect(sanitizeFileName(null as unknown as string)).toBe('');
  });
});

describe('generateRandomScriptPath', () => {
  test('does not returns two consecutive equal paths', () => {
    expect(generateRandomFilePath()).not.toEqual(generateRandomFilePath());
  });

  test('accepts an extension argument', () => {
    expect(generateRandomFilePath('svg')).toContain('.svg');
  });
});

describe('createFolders', () => {
  test('creates the provided root in disk', async () => {
    await createFolders('out/path', []);
    expect(mockFileSystem['out/path']).toBe('FOLDER');
  });

  test('creates the provided folders inside the root folder in disk', async () => {
    expect(mockFileSystem['out/path/slices']).toBeUndefined();
    await createFolders('out/path', [AssetFolder.Slice]);
    expect(mockFileSystem['out/path/slices']).toBe('FOLDER');
  });
});

describe('fixGammaOfPNGFiles', () => {
  test('fixes the gamma values of a png embedded in a svg file', async () => {
    await writeFile(join(file1.fullPath, sanitizeFileName(file1.name)), file1.content);
    await writeFile(join(file2.fullPath, sanitizeFileName(file2.name)), file2.content);
    await writeFile(join(file3.fullPath, sanitizeFileName(file3.name)), file3.content);
    await fixGammaOfSVGs('full/path');
    expect(mockFileSystem['full/path/file-one.svg']).toBe(svgWrap(processedPixel));
    expect(mockFileSystem['full/path/nested/file-two.svg']).toBe(file2.content);
  });
});
