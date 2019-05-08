import {cleanupMockFileSystem, mockFileSystem} from '@diez/test-utils';
import {FigmaExporter, getSVGLinks} from '../../src/exporters/figma';

jest.mock('fs-extra');
jest.mock('request');

const figma = FigmaExporter.create('mock-token');

afterEach(cleanupMockFileSystem);

describe('Figma', () => {
  describe('canParse', () => {
    test('returns `false` if the file does not look like a Figma file', async () => {
      expect(await FigmaExporter.canParse('test.sketch')).toBe(false);
      expect(await FigmaExporter.canParse('http://illustrator.com/file/key/name')).toBe(false);
    });

    test('returns `true` if the file does look like a Figma file', async () => {
      expect(await FigmaExporter.canParse('http://figma.com/file/key/name')).toBe(true);
      expect(await FigmaExporter.canParse('http://figma.com/file/key')).toBe(true);
    });
  });

  describe('export', () => {
    test('exports assets as expected from a Figma URL', async () => {
      const result = await figma.export(
        {
          source: 'http://figma.com/file/key/name',
          assets: 'out',
          code: 'noop',
        },
        'noop',
      );
      expect(result).toBeUndefined();
      expect(mockFileSystem['out/Hello.figma.contents/groups/Group.svg']).toBeTruthy();
      expect(mockFileSystem['out/Hello.figma.contents/groups/Subgroup.svg']).toBeTruthy();
      expect(mockFileSystem['out/Hello.figma.contents/frames/Frame.svg']).toBeTruthy();
      expect(mockFileSystem['out/Hello.figma.contents/groups/Component.svg']).toBeTruthy();
      expect(mockFileSystem['out/Hello.figma.contents/groups/Missing-URL.svg']).toBeFalsy();
    });

    test('throws errors if unable to parse', async () => {
      await expect(figma.export({source: 'www.google.com', assets: 'out', code: 'noop'}, 'noop')).rejects.toThrow();
      await expect(FigmaExporter.create().export(

        {
          source: 'http://figma.com/file/key/name',
          assets: 'out',
          code: 'noop',
        },
        'noop',
      )).rejects.toThrow();
    });
  });
});

describe('getSVGLinks', () => {
  test('throws an error if there are\'n assets to export', async () => {
    await expect(getSVGLinks([], '', '')).rejects.toThrow();
  });
});
