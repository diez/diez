// @ts-ignore
import {__cleanup, __fileSystem} from 'fs-extra';
import {FigmaExporter, getSVGLinks} from '../../src/exporters/figma';

jest.mock('fs-extra');
jest.mock('request');

const figma = FigmaExporter.create('mock-token');

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
      expect(__fileSystem['out/groups/Group.svg']).toBeTruthy();
      expect(__fileSystem['out/groups/Subgroup.svg']).toBeTruthy();
      expect(__fileSystem['out/frames/Frame.svg']).toBeTruthy();
      expect(__fileSystem['out/groups/Component.svg']).toBeTruthy();
      expect(__fileSystem['out/groups/Missing-URL.svg']).toBeFalsy();
    });
  });
});

describe('#getSVGLinks', () => {
  test('throws an error if there are\'n assets to export', async () => {
    await expect(getSVGLinks([], '', '')).rejects.toBeDefined();
  });
});
