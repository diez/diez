import {FigmaExporter, getSVGLinks} from '../../src/exporters/figma';
import {cleanupMockFileSystem, mockFileSystem} from '../mockUtils';

jest.mock('fs-extra');
jest.mock('request');

const figma = FigmaExporter.create('mock-token');

afterEach(cleanupMockFileSystem);

describe('Figma', () => {
  describe('#canParse', () => {
    test('returns `false` if the file does not look like a Figma file', async () => {
      expect(await FigmaExporter.canParse('test.sketch')).toBe(false);
      expect(await FigmaExporter.canParse('test.figmaster')).toBe(false);
      expect(await FigmaExporter.canParse('http://illustrator.com/file/key/name')).toBe(false);
    });

    test('returns `true` if the file does look like a Figma file', async () => {
      expect(await FigmaExporter.canParse('http://figma.com/file/key/name')).toBe(true);
      expect(await FigmaExporter.canParse('http://figma.com/file/key')).toBe(true);
      expect(await FigmaExporter.canParse('test.figma')).toBe(true);
      expect(await FigmaExporter.canParse('my/awesome/path/test.figma')).toBe(true);
    });
  });

  describe('#exportSVG', () => {
    test('exports assets as expected from a Figma URL', async () => {
      const result = await figma.exportSVG('http://figma.com/file/key/name', 'out', () => {});
      expect(result).toBeUndefined();
      expect(mockFileSystem['out/groups/Group.svg']).toBeTruthy();
      expect(mockFileSystem['out/groups/Subgroup.svg']).toBeTruthy();
      expect(mockFileSystem['out/frames/Frame.svg']).toBeTruthy();
      expect(mockFileSystem['out/groups/Component.svg']).toBeTruthy();
      expect(mockFileSystem['out/groups/Missing-URL.svg']).toBeFalsy();
    });
  });
});

describe('#getSVGLinks', () => {
  test('throws an error if there are\'n assets to export', async () => {
    await expect(getSVGLinks([], '', '')).rejects.toBeDefined();
  });
});
